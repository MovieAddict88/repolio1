from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from models.profile import Profile, ProfileCreate, ProfileUpdate
from utils.auth import get_current_user, verify_token
from utils.database import DatabaseManager
from utils.file_handler import save_profile_image, delete_file
from server import db

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=Profile)
async def get_profile(token_data: dict = Depends(verify_token)):
    """Get user profile."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        db_manager = DatabaseManager(db)
        profile = await db_manager.get_user_profile(user_id)
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Convert ObjectId to string for response
        profile["_id"] = str(profile["_id"])
        profile["userId"] = str(profile["userId"])
        
        return Profile(**profile)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get profile: {str(e)}"
        )


@router.put("", response_model=Profile)
async def update_profile(profile_data: ProfileUpdate, token_data: dict = Depends(verify_token)):
    """Update user profile."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        # Get current profile
        db_manager = DatabaseManager(db)
        existing_profile = await db_manager.get_user_profile(user_id)
        
        if not existing_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Update profile data
        update_data = profile_data.dict(by_alias=True, exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        await db_manager.create_or_update_profile(user_id, update_data)
        
        # Get updated profile
        updated_profile = await db_manager.get_user_profile(user_id)
        updated_profile["_id"] = str(updated_profile["_id"])
        updated_profile["userId"] = str(updated_profile["userId"])
        
        return Profile(**updated_profile)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.post("/upload-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    token_data: dict = Depends(verify_token)
):
    """Upload profile image."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        # Save the uploaded image
        file_path = await save_profile_image(file)
        
        # Update profile with new image path
        db_manager = DatabaseManager(db)
        existing_profile = await db_manager.get_user_profile(user_id)
        
        if existing_profile:
            # Delete old image if exists
            old_image = existing_profile.get("profileImage")
            if old_image and old_image.startswith("/uploads/"):
                delete_file(old_image)
        
        # Update profile with new image
        update_data = {
            "profileImage": file_path,
            "updatedAt": datetime.utcnow()
        }
        
        await db_manager.create_or_update_profile(user_id, update_data)
        
        return {
            "message": "Profile image uploaded successfully",
            "profileImage": file_path
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
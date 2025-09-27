import os
import shutil
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status


# File upload settings
UPLOAD_DIR = Path("/app/uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_DOCUMENT_TYPES = {
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
}

# Ensure upload directory exists
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "profiles").mkdir(exist_ok=True)
(UPLOAD_DIR / "projects").mkdir(exist_ok=True)
(UPLOAD_DIR / "documents").mkdir(exist_ok=True)


def validate_file_type(file: UploadFile, allowed_types: set) -> bool:
    """Validate file type against allowed types."""
    return file.content_type in allowed_types


def validate_file_size(file: UploadFile, max_size: int = MAX_FILE_SIZE) -> bool:
    """Validate file size."""
    # For UploadFile, we need to read and reset to get size
    file.file.seek(0, 2)  # Seek to end
    size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    return size <= max_size


def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename while preserving extension."""
    name, ext = os.path.splitext(original_filename)
    unique_id = str(uuid.uuid4())
    return f"{unique_id}{ext}"


async def save_upload_file(file: UploadFile, subdirectory: str = "") -> str:
    """Save uploaded file and return file path."""
    try:
        # Validate file size
        if not validate_file_size(file):
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )

        # Generate unique filename
        unique_filename = generate_unique_filename(file.filename)
        
        # Determine save path
        if subdirectory:
            save_dir = UPLOAD_DIR / subdirectory
            save_dir.mkdir(exist_ok=True)
        else:
            save_dir = UPLOAD_DIR
        
        file_path = save_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return relative path for storage in database
        if subdirectory:
            return f"/uploads/{subdirectory}/{unique_filename}"
        else:
            return f"/uploads/{unique_filename}"
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )


async def save_profile_image(file: UploadFile) -> str:
    """Save profile image with validation."""
    if not validate_file_type(file, ALLOWED_IMAGE_TYPES):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only images are allowed."
        )
    
    return await save_upload_file(file, "profiles")


async def save_project_media(file: UploadFile) -> str:
    """Save project media with validation."""
    if not validate_file_type(file, ALLOWED_IMAGE_TYPES):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only images are allowed for project media."
        )
    
    return await save_upload_file(file, "projects")


async def save_document(file: UploadFile) -> str:
    """Save document with validation."""
    if not validate_file_type(file, ALLOWED_DOCUMENT_TYPES):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only documents (PDF, DOC, DOCX, TXT) are allowed."
        )
    
    return await save_upload_file(file, "documents")


def delete_file(file_path: str) -> bool:
    """Delete file from filesystem."""
    try:
        full_path = Path(f"/app{file_path}")
        if full_path.exists():
            full_path.unlink()
            return True
        return False
    except Exception:
        return False


def get_file_info(file_path: str) -> Optional[dict]:
    """Get file information."""
    try:
        full_path = Path(f"/app{file_path}")
        if full_path.exists():
            stat = full_path.stat()
            return {
                "size": stat.st_size,
                "modified": stat.st_mtime,
                "exists": True
            }
        return {"exists": False}
    except Exception:
        return {"exists": False}
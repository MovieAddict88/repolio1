from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from typing import List

from models.content import (
    Skill, SkillCreate,
    Experience, ExperienceCreate,
    Education, EducationCreate,
    Project, ProjectCreate
)
from utils.auth import get_current_user, verify_token
from utils.database import DatabaseManager
from server import db

router = APIRouter(tags=["Content"])


# Skills endpoints
@router.get("/skills")
async def get_skills(token_data: dict = Depends(verify_token)):
    """Get all user skills."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        db_manager = DatabaseManager(db)
        skills = await db_manager.get_documents_by_user("skills", user_id, "order", 1)
        
        # Convert to response format
        soft_skills = []
        hard_skills = []
        
        for skill in skills:
            skill["_id"] = str(skill["_id"])
            skill["userId"] = str(skill["userId"])
            skill_obj = Skill(**skill)
            
            if skill_obj.category == "soft":
                soft_skills.append(skill_obj.dict(by_alias=True))
            else:
                hard_skills.append(skill_obj.dict(by_alias=True))
        
        return {
            "softSkills": soft_skills,
            "hardSkills": hard_skills
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get skills: {str(e)}"
        )


@router.post("/skills", response_model=Skill)
async def create_skill(skill_data: SkillCreate, token_data: dict = Depends(verify_token)):
    """Create a new skill."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        skill_dict = skill_data.dict()
        skill_dict["userId"] = ObjectId(user_id)
        skill_dict["createdAt"] = datetime.utcnow()
        skill_dict["updatedAt"] = datetime.utcnow()
        
        skill = Skill(**skill_dict)
        
        db_manager = DatabaseManager(db)
        skill_id = await db_manager.create_document("skills", skill.dict(by_alias=True, exclude={"id"}))
        
        # Get created skill
        created_skill = await db_manager.get_document_by_id("skills", skill_id)
        created_skill["_id"] = str(created_skill["_id"])
        created_skill["userId"] = str(created_skill["userId"])
        
        return Skill(**created_skill)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create skill: {str(e)}"
        )


@router.delete("/skills/{skill_id}")
async def delete_skill(skill_id: str, token_data: dict = Depends(verify_token)):
    """Delete a skill."""
    try:
        current_user = await get_current_user(db, token_data)
        
        db_manager = DatabaseManager(db)
        success = await db_manager.delete_document("skills", skill_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        return {"message": "Skill deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete skill: {str(e)}"
        )


# Experience endpoints
@router.get("/experience", response_model=List[Experience])
async def get_experience(token_data: dict = Depends(verify_token)):
    """Get all user experience."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        db_manager = DatabaseManager(db)
        experiences = await db_manager.get_documents_by_user("experience", user_id, "order", 1)
        
        # Convert ObjectIds to strings
        for exp in experiences:
            exp["_id"] = str(exp["_id"])
            exp["userId"] = str(exp["userId"])
        
        return [Experience(**exp) for exp in experiences]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get experience: {str(e)}"
        )


@router.post("/experience", response_model=Experience)
async def create_experience(exp_data: ExperienceCreate, token_data: dict = Depends(verify_token)):
    """Create new experience entry."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        exp_dict = exp_data.dict(by_alias=True)
        exp_dict["userId"] = ObjectId(user_id)
        exp_dict["createdAt"] = datetime.utcnow()
        exp_dict["updatedAt"] = datetime.utcnow()
        
        experience = Experience(**exp_dict)
        
        db_manager = DatabaseManager(db)
        exp_id = await db_manager.create_document("experience", experience.dict(by_alias=True, exclude={"id"}))
        
        # Get created experience
        created_exp = await db_manager.get_document_by_id("experience", exp_id)
        created_exp["_id"] = str(created_exp["_id"])
        created_exp["userId"] = str(created_exp["userId"])
        
        return Experience(**created_exp)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create experience: {str(e)}"
        )


# Education endpoints
@router.get("/education", response_model=List[Education])
async def get_education(token_data: dict = Depends(verify_token)):
    """Get all user education."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        db_manager = DatabaseManager(db)
        education = await db_manager.get_documents_by_user("education", user_id, "order", 1)
        
        # Convert ObjectIds to strings
        for edu in education:
            edu["_id"] = str(edu["_id"])
            edu["userId"] = str(edu["userId"])
        
        return [Education(**edu) for edu in education]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get education: {str(e)}"
        )


@router.post("/education", response_model=Education)
async def create_education(edu_data: EducationCreate, token_data: dict = Depends(verify_token)):
    """Create new education entry."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        edu_dict = edu_data.dict()
        edu_dict["userId"] = ObjectId(user_id)
        edu_dict["createdAt"] = datetime.utcnow()
        edu_dict["updatedAt"] = datetime.utcnow()
        
        education = Education(**edu_dict)
        
        db_manager = DatabaseManager(db)
        edu_id = await db_manager.create_document("education", education.dict(by_alias=True, exclude={"id"}))
        
        # Get created education
        created_edu = await db_manager.get_document_by_id("education", edu_id)
        created_edu["_id"] = str(created_edu["_id"])
        created_edu["userId"] = str(created_edu["userId"])
        
        return Education(**created_edu)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create education: {str(e)}"
        )


# Projects endpoints
@router.get("/projects", response_model=List[Project])
async def get_projects(token_data: dict = Depends(verify_token)):
    """Get all user projects."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        db_manager = DatabaseManager(db)
        projects = await db_manager.get_documents_by_user("projects", user_id, "order", 1)
        
        # Convert ObjectIds to strings
        for project in projects:
            project["_id"] = str(project["_id"])
            project["userId"] = str(project["userId"])
        
        return [Project(**project) for project in projects]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get projects: {str(e)}"
        )


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, token_data: dict = Depends(verify_token)):
    """Get single project by ID."""
    try:
        current_user = await get_current_user(db, token_data)
        
        db_manager = DatabaseManager(db)
        project = await db_manager.get_document_by_id("projects", project_id)
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        project["_id"] = str(project["_id"])
        project["userId"] = str(project["userId"])
        
        return Project(**project)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get project: {str(e)}"
        )


@router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, token_data: dict = Depends(verify_token)):
    """Create new project."""
    try:
        current_user = await get_current_user(db, token_data)
        user_id = str(current_user["_id"])
        
        project_dict = project_data.dict(by_alias=True)
        project_dict["userId"] = ObjectId(user_id)
        project_dict["createdAt"] = datetime.utcnow()
        project_dict["updatedAt"] = datetime.utcnow()
        
        project = Project(**project_dict)
        
        db_manager = DatabaseManager(db)
        project_id = await db_manager.create_document("projects", project.dict(by_alias=True, exclude={"id"}))
        
        # Get created project
        created_project = await db_manager.get_document_by_id("projects", project_id)
        created_project["_id"] = str(created_project["_id"])
        created_project["userId"] = str(created_project["userId"])
        
        return Project(**created_project)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )
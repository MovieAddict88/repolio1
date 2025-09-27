from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId


class Skill(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., alias="userId")
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., pattern="^(soft|hard)$")
    icon: str = Field(..., min_length=1, max_length=50)
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., pattern="^(soft|hard)$")
    icon: str = Field(..., min_length=1, max_length=50)
    order: int = Field(default=0)


class Experience(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., alias="userId")
    job_title: str = Field(..., min_length=1, max_length=200, alias="jobTitle")
    institution: str = Field(..., min_length=1, max_length=200)
    duration: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=2000)
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ExperienceCreate(BaseModel):
    job_title: str = Field(..., min_length=1, max_length=200, alias="jobTitle")
    institution: str = Field(..., min_length=1, max_length=200)
    duration: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=2000)
    order: int = Field(default=0)

    class Config:
        allow_population_by_field_name = True


class Education(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., alias="userId")
    school: str = Field(..., min_length=1, max_length=200)
    course: str = Field(..., min_length=1, max_length=200)
    year: str = Field(..., min_length=1, max_length=100)
    achievements: Optional[str] = Field(default="", max_length=1000)
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class EducationCreate(BaseModel):
    school: str = Field(..., min_length=1, max_length=200)
    course: str = Field(..., min_length=1, max_length=200)
    year: str = Field(..., min_length=1, max_length=100)
    achievements: Optional[str] = Field(default="", max_length=1000)
    order: int = Field(default=0)


class ProjectMedia(BaseModel):
    type: str = Field(..., pattern="^(image|video|link)$")
    url: str = Field(..., min_length=1, max_length=500)
    caption: Optional[str] = Field(default="", max_length=200)


class ProjectLink(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    url: str = Field(..., min_length=1, max_length=500)


class Project(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., alias="userId")
    title: str = Field(..., min_length=1, max_length=200)
    short_desc: str = Field(..., min_length=1, max_length=500, alias="shortDesc")
    full_desc: str = Field(..., min_length=1, max_length=2000, alias="fullDesc")
    thumbnail: str = Field(..., min_length=1, max_length=500)
    media: List[ProjectMedia] = Field(default=[])
    links: List[ProjectLink] = Field(default=[])
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    short_desc: str = Field(..., min_length=1, max_length=500, alias="shortDesc")
    full_desc: str = Field(..., min_length=1, max_length=2000, alias="fullDesc")
    thumbnail: str = Field(..., min_length=1, max_length=500)
    media: List[ProjectMedia] = Field(default=[])
    links: List[ProjectLink] = Field(default=[])
    order: int = Field(default=0)

    class Config:
        allow_population_by_field_name = True
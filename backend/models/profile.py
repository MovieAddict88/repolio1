from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId


class SocialLink(BaseModel):
    platform: str
    value: str
    url: str
    icon: str


class Profile(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., alias="userId")
    name: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    bio: str = Field(..., min_length=1, max_length=2000)
    profile_image: Optional[str] = Field(default=None, alias="profileImage")
    intro_video: Optional[str] = Field(default=None, alias="introVideo")
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    address: Optional[str] = Field(default=None, max_length=200)
    social_links: List[SocialLink] = Field(default=[], alias="socialLinks")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "userId": "507f1f77bcf86cd799439011",
                "name": "Sarah Johnson",
                "title": "Elementary Education Teacher",
                "bio": "Passionate elementary education teacher...",
                "profileImage": "https://example.com/profile.jpg",
                "email": "sarah@example.com",
                "phone": "+1 (555) 123-4567",
                "address": "Springfield, Illinois, USA"
            }
        }


class ProfileCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    bio: str = Field(..., min_length=1, max_length=2000)
    profile_image: Optional[str] = Field(default=None, alias="profileImage")
    intro_video: Optional[str] = Field(default=None, alias="introVideo")
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    address: Optional[str] = Field(default=None, max_length=200)
    social_links: List[SocialLink] = Field(default=[], alias="socialLinks")

    class Config:
        allow_population_by_field_name = True


class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    bio: Optional[str] = Field(None, min_length=1, max_length=2000)
    profile_image: Optional[str] = Field(None, alias="profileImage")
    intro_video: Optional[str] = Field(None, alias="introVideo")
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=200)
    social_links: Optional[List[SocialLink]] = Field(None, alias="socialLinks")

    class Config:
        allow_population_by_field_name = True
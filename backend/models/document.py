from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId


class Document(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., alias="userId")
    file_name: str = Field(..., min_length=1, max_length=200, alias="fileName")
    file_path: str = Field(..., min_length=1, max_length=500, alias="filePath")
    file_size: int = Field(..., ge=0, alias="fileSize")
    mime_type: str = Field(..., min_length=1, max_length=100, alias="mimeType")
    password_protected: bool = Field(default=False, alias="passwordProtected")
    password: Optional[str] = Field(default=None)  # Hashed password
    description: Optional[str] = Field(default="", max_length=500)
    download_count: int = Field(default=0, alias="downloadCount")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class DocumentCreate(BaseModel):
    file_name: str = Field(..., min_length=1, max_length=200, alias="fileName")
    password_protected: bool = Field(default=False, alias="passwordProtected")
    password: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = Field(default="", max_length=500)

    class Config:
        allow_population_by_field_name = True


class DocumentResponse(BaseModel):
    id: str
    fileName: str
    fileSize: int
    mimeType: str
    passwordProtected: bool
    description: str
    downloadCount: int
    createdAt: datetime

    class Config:
        allow_population_by_field_name = True


class ContactMessage(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1, max_length=200)
    subject: Optional[str] = Field(default="", max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)
    ip_address: Optional[str] = Field(default=None, alias="ipAddress")
    user_agent: Optional[str] = Field(default=None, alias="userAgent")
    is_read: bool = Field(default=False, alias="isRead")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1, max_length=200)
    subject: Optional[str] = Field(default="", max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)


class Analytics(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[PyObjectId] = Field(default=None, alias="userId")
    event_type: str = Field(..., regex="^(visit|download|contact)$", alias="eventType")
    event_data: dict = Field(default={}, alias="eventData")
    ip_address: Optional[str] = Field(default=None, alias="ipAddress")
    user_agent: Optional[str] = Field(default=None, alias="userAgent")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
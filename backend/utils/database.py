from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Database manager for common operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_document(self, collection: str, document: Dict[str, Any]) -> str:
        """Create a new document and return its ID."""
        try:
            result = await self.db[collection].insert_one(document)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating document in {collection}: {e}")
            raise
    
    async def get_document_by_id(self, collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID."""
        try:
            if not ObjectId.is_valid(doc_id):
                return None
            return await self.db[collection].find_one({"_id": ObjectId(doc_id)})
        except Exception as e:
            logger.error(f"Error getting document from {collection}: {e}")
            return None
    
    async def get_documents_by_user(self, collection: str, user_id: str, sort_field: str = "createdAt", sort_order: int = -1) -> List[Dict[str, Any]]:
        """Get all documents for a user."""
        try:
            if not ObjectId.is_valid(user_id):
                return []
            
            cursor = self.db[collection].find({"userId": ObjectId(user_id)})
            cursor = cursor.sort(sort_field, sort_order)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error getting user documents from {collection}: {e}")
            return []
    
    async def update_document(self, collection: str, doc_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a document."""
        try:
            if not ObjectId.is_valid(doc_id):
                return False
            
            update_data["updatedAt"] = update_data.get("updatedAt", None)
            result = await self.db[collection].update_one(
                {"_id": ObjectId(doc_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error updating document in {collection}: {e}")
            return False
    
    async def delete_document(self, collection: str, doc_id: str) -> bool:
        """Delete a document."""
        try:
            if not ObjectId.is_valid(doc_id):
                return False
            
            result = await self.db[collection].delete_one({"_id": ObjectId(doc_id)})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting document from {collection}: {e}")
            return False
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile."""
        try:
            if not ObjectId.is_valid(user_id):
                return None
            return await self.db.profiles.find_one({"userId": ObjectId(user_id)})
        except Exception as e:
            logger.error(f"Error getting user profile: {e}")
            return None
    
    async def create_or_update_profile(self, user_id: str, profile_data: Dict[str, Any]) -> str:
        """Create or update user profile."""
        try:
            if not ObjectId.is_valid(user_id):
                raise ValueError("Invalid user ID")
            
            existing = await self.get_user_profile(user_id)
            
            if existing:
                # Update existing profile
                profile_data["updatedAt"] = profile_data.get("updatedAt", None)
                await self.db.profiles.update_one(
                    {"userId": ObjectId(user_id)},
                    {"$set": profile_data}
                )
                return str(existing["_id"])
            else:
                # Create new profile
                profile_data["userId"] = ObjectId(user_id)
                profile_data["createdAt"] = profile_data.get("createdAt", None)
                profile_data["updatedAt"] = profile_data.get("updatedAt", None)
                result = await self.db.profiles.insert_one(profile_data)
                return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating/updating profile: {e}")
            raise


async def init_database_with_sample_data(db: AsyncIOMotorDatabase):
    """Initialize database with sample data from mock.js."""
    try:
        db_manager = DatabaseManager(db)
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": "sarah.johnson@email.com"})
        
        if not existing_user:
            # Create sample user
            from utils.auth import get_password_hash
            
            user_data = {
                "username": "sarah_teacher",
                "email": "sarah.johnson@email.com",
                "password": get_password_hash("teacher123"),
                "role": "admin"
            }
            
            user_id = await db_manager.create_document("users", user_data)
            logger.info(f"Created sample user with ID: {user_id}")
            
            # Create sample profile
            profile_data = {
                "userId": ObjectId(user_id),
                "name": "Sarah Johnson",
                "title": "Elementary Education Teacher",
                "bio": "Passionate elementary education teacher with 3+ years of experience creating engaging learning environments. Dedicated to fostering creativity, critical thinking, and academic growth in young learners through innovative teaching methods and personalized instruction.",
                "profileImage": "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=1000&auto=format&fit=crop",
                "email": "sarah.johnson@email.com",
                "phone": "+1 (555) 123-4567",
                "address": "Springfield, Illinois, USA",
                "socialLinks": [
                    {"platform": "Email", "value": "sarah.johnson@email.com", "icon": "Mail", "url": "mailto:sarah.johnson@email.com"},
                    {"platform": "LinkedIn", "value": "/in/sarahjohnson", "icon": "Linkedin", "url": "https://linkedin.com/in/sarahjohnson"},
                    {"platform": "Facebook", "value": "/sarah.teacher", "icon": "Facebook", "url": "https://facebook.com/sarah.teacher"},
                    {"platform": "Instagram", "value": "@sarahteaches", "icon": "Instagram", "url": "https://instagram.com/sarahteaches"}
                ]
            }
            
            await db_manager.create_or_update_profile(user_id, profile_data)
            logger.info("Created sample profile")
            
            return user_id
        else:
            logger.info("Sample user already exists")
            return str(existing_user["_id"])
            
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise
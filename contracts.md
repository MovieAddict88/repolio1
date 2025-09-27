# Teacher Portfolio API Contracts

## Overview
This document defines the API contracts, data models, and integration protocol for converting the mock-based teacher portfolio frontend to a full-stack application.

## Current Mock Data Structure

### 1. Profile Data
```javascript
// Frontend: profileData in mock.js
{
  name: "Sarah Johnson",
  title: "Elementary Education Teacher", 
  bio: "...",
  profileImage: "url",
  introVideo: null,
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  address: "Springfield, Illinois, USA"
}
```

### 2. Skills Data
```javascript
// Frontend: skillsData in mock.js
{
  softSkills: [{id, name, icon}],
  hardSkills: [{id, name, icon}]
}
```

### 3. Experience Data
```javascript
// Frontend: experienceData in mock.js
[{
  id: 1,
  jobTitle: "Elementary Teacher",
  institution: "Riverside Elementary School", 
  duration: "Aug 2022 - Present",
  description: "..."
}]
```

### 4. Education Data
```javascript
// Frontend: educationData in mock.js
[{
  id: 1,
  school: "Springfield University",
  course: "Bachelor of Elementary Education",
  year: "2018 - 2022", 
  achievements: "Magna Cum Laude, Dean's List"
}]
```

### 5. Projects Data
```javascript
// Frontend: projectsData in mock.js
[{
  id: 1,
  title: "Interactive Math Games",
  shortDesc: "...",
  fullDesc: "...",
  thumbnail: "url",
  media: [{type: "image|video", url}],
  links: [{name, url}]
}]
```

### 6. Documents Data
```javascript
// Frontend: documentsData in mock.js
[{
  id: 1,
  fileName: "Resume_SarahJohnson.pdf",
  filePath: "/documents/resume.pdf",
  passwordProtected: true,
  description: "..."
}]
```

## Backend API Endpoints to Implement

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Profile Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/upload-image` - Upload profile image

### Skills Endpoints
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Experience Endpoints
- `GET /api/experience` - Get all experience entries
- `POST /api/experience` - Add new experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience

### Education Endpoints
- `GET /api/education` - Get all education entries
- `POST /api/education` - Add new education
- `PUT /api/education/:id` - Update education
- `DELETE /api/education/:id` - Delete education

### Projects Endpoints
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Add new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/media` - Upload project media

### Documents Endpoints
- `GET /api/documents` - Get all documents
- `POST /api/documents/upload` - Upload new document
- `GET /api/documents/:id/download` - Download document (with password check)
- `DELETE /api/documents/:id` - Delete document

### Contact Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact/messages` - Get all contact messages (admin)

### Analytics Endpoints
- `GET /api/analytics` - Get portfolio analytics
- `POST /api/analytics/visit` - Log portfolio visit

## MongoDB Schema Design

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String ("admin" | "user"),
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  title: String,
  bio: String,
  profileImage: String,
  introVideo: String,
  email: String,
  phone: String,
  address: String,
  socialLinks: [{platform: String, value: String, url: String}],
  createdAt: Date,
  updatedAt: Date
}
```

### Skills Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  category: String ("soft" | "hard"),
  icon: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Experience Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  jobTitle: String,
  institution: String,
  duration: String,
  description: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Education Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  school: String,
  course: String,
  year: String,
  achievements: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  shortDesc: String,
  fullDesc: String,
  thumbnail: String,
  media: [{type: String, url: String, caption: String}],
  links: [{name: String, url: String}],
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  fileName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  passwordProtected: Boolean,
  password: String (hashed),
  description: String,
  downloadCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Messages Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  ipAddress: String,
  userAgent: String,
  isRead: Boolean,
  createdAt: Date
}
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  eventType: String ("visit" | "download" | "contact"),
  eventData: Object,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

## Frontend Integration Points

### 1. Replace Mock API Calls
- Update all `mockApi.*` calls to use `axios` with real API endpoints
- Add error handling for network failures
- Add loading states during API calls

### 2. Authentication Integration
- Add login/logout functionality
- Implement protected routes for admin features
- Store JWT token in localStorage or cookies

### 3. File Upload Integration
- Replace mock file uploads with real multipart form uploads
- Add progress indicators for large files
- Implement file type validation

### 4. Real-time Updates
- Replace local state updates with API-driven updates
- Add optimistic updates for better UX
- Implement proper error rollback

## Security Considerations

### 1. Authentication & Authorization
- JWT token-based authentication
- Role-based access control (admin vs public)
- Password hashing using bcrypt

### 2. File Security
- File type validation
- File size limits
- Virus scanning for uploads
- Secure file storage paths

### 3. Data Validation
- Input sanitization for all user data
- SQL injection prevention (using MongoDB)
- XSS protection for user-generated content

### 4. Rate Limiting
- Contact form submission limits
- File upload limits
- API rate limiting

## Implementation Priority

### Phase 1: Core Backend
1. User authentication system
2. Basic CRUD operations for all collections
3. File upload functionality

### Phase 2: Frontend Integration
1. Replace mock API calls
2. Add authentication to frontend
3. Implement real file operations

### Phase 3: Admin Features
1. Admin dashboard
2. Content management interface
3. Analytics dashboard

### Phase 4: Security & Performance
1. Input validation
2. Rate limiting
3. Caching strategies
4. Error handling

## Notes for Implementation

1. **Database Initialization**: Seed database with Sarah Johnson's data from mock.js
2. **File Storage**: Use local filesystem for development, can be extended to cloud storage
3. **Password Protection**: Documents use separate password field, not user password
4. **Mock Integration**: Gradual replacement of mock calls, section by section
5. **Error Handling**: Comprehensive error responses with user-friendly messages
6. **Validation**: Server-side validation for all data inputs
7. **Logging**: Implement request logging for debugging and analytics

This contract ensures seamless integration between the existing frontend mock implementation and the new backend API system.
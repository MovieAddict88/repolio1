#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Teacher Portfolio Application
Tests all authentication and content management endpoints
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://teachfolio.preview.emergentagent.com/api"

class TeacherPortfolioTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.auth_token = None
        self.user_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Teacher Portfolio API" in data["message"]:
                    self.log_test("API Root Endpoint", True, f"API is accessible: {data['message']}")
                    return True
                else:
                    self.log_test("API Root Endpoint", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("API Root Endpoint", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Connection error: {str(e)}")
            return False

    def test_user_registration(self):
        """Test user registration"""
        try:
            user_data = {
                "username": "test_teacher_2024",
                "email": "test.teacher.2024@example.com",
                "password": "securepass123"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=user_data)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "username" in data and "email" in data:
                    self.user_id = data["id"]
                    self.log_test("User Registration", True, f"User registered successfully: {data['username']}")
                    return True
                else:
                    self.log_test("User Registration", False, "Invalid response format", data)
                    return False
            elif response.status_code == 400:
                # User might already exist, try with different email
                user_data["email"] = f"test.teacher.{datetime.now().timestamp()}@example.com"
                user_data["username"] = f"test_teacher_{int(datetime.now().timestamp())}"
                
                response = self.session.post(f"{self.base_url}/auth/register", json=user_data)
                if response.status_code == 200:
                    data = response.json()
                    self.user_id = data["id"]
                    self.log_test("User Registration", True, f"User registered successfully: {data['username']}")
                    return True
                else:
                    self.log_test("User Registration", False, f"HTTP {response.status_code}", response.text)
                    return False
            else:
                self.log_test("User Registration", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False

    def test_user_login(self):
        """Test user login with sample user"""
        try:
            # Test with sample user first
            login_data = {
                "email": "sarah.johnson@email.com",
                "password": "teacher123"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("User Login (Sample User)", True, f"Login successful for: {data['user']['email']}")
                    return True
                else:
                    self.log_test("User Login (Sample User)", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("User Login (Sample User)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("User Login (Sample User)", False, f"Error: {str(e)}")
            return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            login_data = {
                "email": "invalid@example.com",
                "password": "wrongpassword"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            
            if response.status_code == 401:
                self.log_test("Invalid Login Test", True, "Correctly rejected invalid credentials")
                return True
            else:
                self.log_test("Invalid Login Test", False, f"Expected 401, got {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Invalid Login Test", False, f"Error: {str(e)}")
            return False

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data and "username" in data:
                    self.log_test("Get Current User", True, f"Retrieved user info: {data['email']}")
                    return True
                else:
                    self.log_test("Get Current User", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Current User", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Current User", False, f"Error: {str(e)}")
            return False

    def test_get_profile(self):
        """Test getting user profile"""
        if not self.auth_token:
            self.log_test("Get Profile", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/profile")
            
            if response.status_code == 200:
                data = response.json()
                if "name" in data and "email" in data:
                    self.log_test("Get Profile", True, f"Retrieved profile: {data['name']}")
                    return True
                else:
                    self.log_test("Get Profile", False, "Invalid response format", data)
                    return False
            elif response.status_code == 404:
                self.log_test("Get Profile", True, "Profile not found (expected for new users)")
                return True
            else:
                self.log_test("Get Profile", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Profile", False, f"Error: {str(e)}")
            return False

    def test_update_profile(self):
        """Test updating user profile"""
        if not self.auth_token:
            self.log_test("Update Profile", False, "No auth token available")
            return False
            
        try:
            profile_data = {
                "name": "Test Teacher Updated",
                "title": "Senior Mathematics Teacher",
                "bio": "Experienced mathematics teacher with passion for innovative teaching methods.",
                "phone": "+1 (555) 987-6543",
                "address": "Test City, Test State, USA"
            }
            
            response = self.session.put(f"{self.base_url}/profile", json=profile_data)
            
            if response.status_code == 200:
                data = response.json()
                if "name" in data and data["name"] == profile_data["name"]:
                    self.log_test("Update Profile", True, f"Profile updated successfully: {data['name']}")
                    return True
                else:
                    self.log_test("Update Profile", False, "Profile not updated correctly", data)
                    return False
            else:
                self.log_test("Update Profile", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Update Profile", False, f"Error: {str(e)}")
            return False

    def test_get_skills(self):
        """Test getting user skills"""
        if not self.auth_token:
            self.log_test("Get Skills", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/skills")
            
            if response.status_code == 200:
                data = response.json()
                if "softSkills" in data and "hardSkills" in data:
                    self.log_test("Get Skills", True, f"Retrieved skills: {len(data['softSkills'])} soft, {len(data['hardSkills'])} hard")
                    return True
                else:
                    self.log_test("Get Skills", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Skills", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Skills", False, f"Error: {str(e)}")
            return False

    def test_create_skill(self):
        """Test creating a new skill"""
        if not self.auth_token:
            self.log_test("Create Skill", False, "No auth token available")
            return False
            
        try:
            skill_data = {
                "name": "Python Programming",
                "category": "hard",
                "icon": "Code",
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/skills", json=skill_data)
            
            if response.status_code == 200:
                data = response.json()
                if "name" in data and data["name"] == skill_data["name"]:
                    self.skill_id = data["_id"]
                    self.log_test("Create Skill", True, f"Skill created successfully: {data['name']}")
                    return True
                else:
                    self.log_test("Create Skill", False, "Skill not created correctly", data)
                    return False
            else:
                self.log_test("Create Skill", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Create Skill", False, f"Error: {str(e)}")
            return False

    def test_delete_skill(self):
        """Test deleting a skill"""
        if not self.auth_token:
            self.log_test("Delete Skill", False, "No auth token available")
            return False
            
        if not hasattr(self, 'skill_id'):
            self.log_test("Delete Skill", False, "No skill ID available")
            return False
            
        try:
            response = self.session.delete(f"{self.base_url}/skills/{self.skill_id}")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "deleted" in data["message"]:
                    self.log_test("Delete Skill", True, "Skill deleted successfully")
                    return True
                else:
                    self.log_test("Delete Skill", False, "Unexpected response", data)
                    return False
            else:
                self.log_test("Delete Skill", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Delete Skill", False, f"Error: {str(e)}")
            return False

    def test_get_experience(self):
        """Test getting user experience"""
        if not self.auth_token:
            self.log_test("Get Experience", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/experience")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Experience", True, f"Retrieved {len(data)} experience entries")
                    return True
                else:
                    self.log_test("Get Experience", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Experience", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Experience", False, f"Error: {str(e)}")
            return False

    def test_create_experience(self):
        """Test creating experience entry"""
        if not self.auth_token:
            self.log_test("Create Experience", False, "No auth token available")
            return False
            
        try:
            experience_data = {
                "jobTitle": "Mathematics Teacher",
                "institution": "Springfield Elementary School",
                "duration": "2020 - Present",
                "description": "Teaching mathematics to elementary students with innovative methods and personalized approach.",
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/experience", json=experience_data)
            
            if response.status_code == 200:
                data = response.json()
                if "jobTitle" in data and data["jobTitle"] == experience_data["jobTitle"]:
                    self.log_test("Create Experience", True, f"Experience created: {data['jobTitle']}")
                    return True
                else:
                    self.log_test("Create Experience", False, "Experience not created correctly", data)
                    return False
            else:
                self.log_test("Create Experience", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Create Experience", False, f"Error: {str(e)}")
            return False

    def test_get_education(self):
        """Test getting user education"""
        if not self.auth_token:
            self.log_test("Get Education", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/education")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Education", True, f"Retrieved {len(data)} education entries")
                    return True
                else:
                    self.log_test("Get Education", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Education", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Education", False, f"Error: {str(e)}")
            return False

    def test_create_education(self):
        """Test creating education entry"""
        if not self.auth_token:
            self.log_test("Create Education", False, "No auth token available")
            return False
            
        try:
            education_data = {
                "school": "University of Education",
                "course": "Bachelor of Education in Mathematics",
                "year": "2016 - 2020",
                "achievements": "Graduated Magna Cum Laude, Dean's List for 3 consecutive years",
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/education", json=education_data)
            
            if response.status_code == 200:
                data = response.json()
                if "school" in data and data["school"] == education_data["school"]:
                    self.log_test("Create Education", True, f"Education created: {data['course']} at {data['school']}")
                    return True
                else:
                    self.log_test("Create Education", False, "Education not created correctly", data)
                    return False
            else:
                self.log_test("Create Education", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Create Education", False, f"Error: {str(e)}")
            return False

    def test_get_projects(self):
        """Test getting user projects"""
        if not self.auth_token:
            self.log_test("Get Projects", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/projects")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Projects", True, f"Retrieved {len(data)} projects")
                    return True
                else:
                    self.log_test("Get Projects", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Projects", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Projects", False, f"Error: {str(e)}")
            return False

    def test_create_project(self):
        """Test creating a project"""
        if not self.auth_token:
            self.log_test("Create Project", False, "No auth token available")
            return False
            
        try:
            project_data = {
                "title": "Interactive Math Learning Platform",
                "shortDesc": "A web-based platform for interactive mathematics learning with gamification elements.",
                "fullDesc": "Developed a comprehensive web-based platform that makes mathematics learning engaging through interactive exercises, gamification elements, and personalized learning paths. The platform includes real-time progress tracking, adaptive difficulty levels, and collaborative features for peer learning.",
                "thumbnail": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
                "media": [
                    {
                        "type": "image",
                        "url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
                        "caption": "Main dashboard view"
                    }
                ],
                "links": [
                    {
                        "name": "Live Demo",
                        "url": "https://mathplatform.example.com"
                    }
                ],
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/projects", json=project_data)
            
            if response.status_code == 200:
                data = response.json()
                if "title" in data and data["title"] == project_data["title"]:
                    self.project_id = data["_id"]
                    self.log_test("Create Project", True, f"Project created: {data['title']}")
                    return True
                else:
                    self.log_test("Create Project", False, "Project not created correctly", data)
                    return False
            else:
                self.log_test("Create Project", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Create Project", False, f"Error: {str(e)}")
            return False

    def test_get_single_project(self):
        """Test getting a single project by ID"""
        if not self.auth_token:
            self.log_test("Get Single Project", False, "No auth token available")
            return False
            
        if not hasattr(self, 'project_id'):
            self.log_test("Get Single Project", False, "No project ID available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/projects/{self.project_id}")
            
            if response.status_code == 200:
                data = response.json()
                if "title" in data and "_id" in data:
                    self.log_test("Get Single Project", True, f"Retrieved project: {data['title']}")
                    return True
                else:
                    self.log_test("Get Single Project", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Single Project", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Single Project", False, f"Error: {str(e)}")
            return False

    def test_logout(self):
        """Test user logout"""
        if not self.auth_token:
            self.log_test("User Logout", False, "No auth token available")
            return False
            
        try:
            response = self.session.post(f"{self.base_url}/auth/logout")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "logged out" in data["message"].lower():
                    self.log_test("User Logout", True, "Logout successful")
                    return True
                else:
                    self.log_test("User Logout", False, "Unexpected response", data)
                    return False
            else:
                self.log_test("User Logout", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("User Logout", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 80)
        print("TEACHER PORTFOLIO BACKEND API TESTING")
        print("=" * 80)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Test sequence
        tests = [
            self.test_api_root,
            self.test_user_registration,
            self.test_user_login,
            self.test_invalid_login,
            self.test_get_current_user,
            self.test_get_profile,
            self.test_update_profile,
            self.test_get_skills,
            self.test_create_skill,
            self.test_delete_skill,
            self.test_get_experience,
            self.test_create_experience,
            self.test_get_education,
            self.test_create_education,
            self.test_get_projects,
            self.test_create_project,
            self.test_get_single_project,
            self.test_logout
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            if test():
                passed += 1
            else:
                failed += 1
        
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {passed + failed}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed / (passed + failed) * 100):.1f}%")
        
        if failed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"- {result['test']}: {result['message']}")
        
        return failed == 0

if __name__ == "__main__":
    tester = TeacherPortfolioTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
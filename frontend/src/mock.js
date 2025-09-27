// Mock data for Teacher Portfolio Website

export const profileData = {
  name: "Sarah Johnson",
  title: "Elementary Education Teacher",
  bio: "Passionate elementary education teacher with 3+ years of experience creating engaging learning environments. Dedicated to fostering creativity, critical thinking, and academic growth in young learners through innovative teaching methods and personalized instruction.",
  profileImage: "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=1000&auto=format&fit=crop",
  introVideo: null,
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  address: "Springfield, Illinois, USA"
};

export const skillsData = {
  softSkills: [
    { id: 1, name: "Communication", icon: "MessageCircle" },
    { id: 2, name: "Leadership", icon: "Users" },
    { id: 3, name: "Patience", icon: "Clock" },
    { id: 4, name: "Creativity", icon: "Palette" },
    { id: 5, name: "Problem Solving", icon: "Lightbulb" },
    { id: 6, name: "Teamwork", icon: "UserCheck" }
  ],
  hardSkills: [
    { id: 7, name: "Canva Design", icon: "PenTool" },
    { id: 8, name: "MS Office Suite", icon: "Monitor" },
    { id: 9, name: "Google Classroom", icon: "BookOpen" },
    { id: 10, name: "Zoom/Teams", icon: "Video" },
    { id: 11, name: "Assessment Tools", icon: "ClipboardCheck" },
    { id: 12, name: "Curriculum Planning", icon: "Calendar" }
  ]
};

export const experienceData = [
  {
    id: 1,
    jobTitle: "Elementary Teacher",
    institution: "Riverside Elementary School",
    duration: "Aug 2022 - Present",
    description: "Lead classroom teacher for 4th-grade students, developing and implementing engaging lesson plans across core subjects while maintaining positive classroom environment."
  },
  {
    id: 2,
    jobTitle: "Student Teacher",
    institution: "Meadowbrook Elementary",
    duration: "Jan 2022 - May 2022",
    description: "Completed student teaching practicum, assisting with lesson planning, classroom management, and student assessment under mentor teacher guidance."
  },
  {
    id: 3,
    jobTitle: "Teacher's Aide",
    institution: "Sunshine Kindergarten Center",
    duration: "Sep 2021 - Dec 2021",
    description: "Supported lead teacher with classroom activities, student supervision, and educational material preparation for kindergarten students."
  }
];

export const educationData = [
  {
    id: 1,
    school: "Springfield University",
    course: "Bachelor of Elementary Education",
    year: "2018 - 2022",
    achievements: "Magna Cum Laude, Dean's List (4 semesters)"
  },
  {
    id: 2,
    school: "Springfield High School",
    course: "High School Diploma",
    year: "2014 - 2018",
    achievements: "Valedictorian, Student Council President"
  }
];

export const projectsData = [
  {
    id: 1,
    title: "Interactive Math Games",
    shortDesc: "Created engaging digital math games to help students practice arithmetic skills through gamification.",
    fullDesc: "Developed a series of interactive math games using educational technology tools to make learning arithmetic fun and engaging. The games included addition, subtraction, multiplication, and division challenges with reward systems to motivate student participation. Resulted in 25% improvement in math test scores.",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" },
      { type: "image", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop" }
    ],
    links: [
      { name: "Lesson Plan PDF", url: "#" },
      { name: "Game Demo", url: "#" }
    ]
  },
  {
    id: 2,
    title: "Reading Corner Initiative",
    shortDesc: "Transformed classroom reading area into an immersive storytelling space to encourage reading habits.",
    fullDesc: "Redesigned the classroom reading corner with themed decorations, comfortable seating, and interactive storytelling elements. Created a reading reward system and organized weekly storytelling sessions. This initiative increased daily reading time by 40% and improved reading comprehension scores across the class.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
      { type: "image", url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop" }
    ],
    links: [
      { name: "Setup Guide PDF", url: "#" },
      { name: "Reading List", url: "#" }
    ]
  },
  {
    id: 3,
    title: "Science Discovery Lab",
    shortDesc: "Hands-on science experiments and activities to spark curiosity and scientific thinking in students.",
    fullDesc: "Developed and implemented a series of age-appropriate science experiments focusing on basic physics, chemistry, and biology concepts. Created experiment guides, safety protocols, and observation worksheets. Students showed increased interest in STEM subjects and improved scientific reasoning skills.",
    thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop" },
      { type: "image", url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop" }
    ],
    links: [
      { name: "Experiment Guide", url: "#" },
      { name: "Safety Checklist", url: "#" }
    ]
  }
];

export const documentsData = [
  {
    id: 1,
    fileName: "Resume_SarahJohnson.pdf",
    filePath: "/documents/resume.pdf",
    passwordProtected: true,
    description: "Complete professional resume with education and experience details"
  },
  {
    id: 2,
    fileName: "Teaching_Certificate.pdf",
    filePath: "/documents/certificate.pdf",
    passwordProtected: true,
    description: "Official teaching certification and credentials"
  },
  {
    id: 3,
    fileName: "Recommendation_Letters.pdf",
    filePath: "/documents/recommendations.pdf",
    passwordProtected: true,
    description: "Letters of recommendation from supervisors and mentors"
  },
  {
    id: 4,
    fileName: "Portfolio_Samples.pdf",
    filePath: "/documents/portfolio.pdf",
    passwordProtected: false,
    description: "Sample lesson plans and teaching materials"
  }
];

export const socialLinksData = [
  { platform: "Email", value: "sarah.johnson@email.com", icon: "Mail", url: "mailto:sarah.johnson@email.com" },
  { platform: "LinkedIn", value: "/in/sarahjohnson", icon: "Linkedin", url: "https://linkedin.com/in/sarahjohnson" },
  { platform: "Facebook", value: "/sarah.teacher", icon: "Facebook", url: "https://facebook.com/sarah.teacher" },
  { platform: "Instagram", value: "@sarahteaches", icon: "Instagram", url: "https://instagram.com/sarahteaches" }
];

export const testimonialsData = [
  {
    id: 1,
    name: "Dr. Maria Rodriguez",
    title: "Principal, Riverside Elementary",
    content: "Sarah brings exceptional creativity and dedication to her classroom. Her innovative teaching methods have consistently improved student engagement and academic performance.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Jennifer Chen",
    title: "Parent",
    content: "My daughter loves Ms. Johnson's class! She comes home excited about what she learned and always talks about the fun activities they do in class.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Robert Thompson",
    title: "Colleague Teacher",
    content: "Working with Sarah has been inspiring. She's always willing to share her innovative ideas and collaborate on new teaching strategies.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
  }
];

// Mock API functions
export const mockApi = {
  // Profile
  getProfile: () => Promise.resolve(profileData),
  updateProfile: (data) => {
    Object.assign(profileData, data);
    return Promise.resolve(profileData);
  },

  // Skills
  getSkills: () => Promise.resolve(skillsData),
  addSkill: (skill) => {
    const category = skill.category === 'soft' ? 'softSkills' : 'hardSkills';
    const newSkill = { ...skill, id: Date.now() };
    skillsData[category].push(newSkill);
    return Promise.resolve(newSkill);
  },
  deleteSkill: (id) => {
    skillsData.softSkills = skillsData.softSkills.filter(s => s.id !== id);
    skillsData.hardSkills = skillsData.hardSkills.filter(s => s.id !== id);
    return Promise.resolve();
  },

  // Experience
  getExperience: () => Promise.resolve(experienceData),
  addExperience: (exp) => {
    const newExp = { ...exp, id: Date.now() };
    experienceData.push(newExp);
    return Promise.resolve(newExp);
  },
  deleteExperience: (id) => {
    const index = experienceData.findIndex(e => e.id === id);
    if (index !== -1) experienceData.splice(index, 1);
    return Promise.resolve();
  },

  // Education
  getEducation: () => Promise.resolve(educationData),
  addEducation: (edu) => {
    const newEdu = { ...edu, id: Date.now() };
    educationData.push(newEdu);
    return Promise.resolve(newEdu);
  },

  // Projects
  getProjects: () => Promise.resolve(projectsData),
  getProject: (id) => Promise.resolve(projectsData.find(p => p.id === parseInt(id))),
  addProject: (project) => {
    const newProject = { ...project, id: Date.now() };
    projectsData.push(newProject);
    return Promise.resolve(newProject);
  },

  // Documents
  getDocuments: () => Promise.resolve(documentsData),
  downloadDocument: (id, password) => {
    const doc = documentsData.find(d => d.id === id);
    if (!doc) return Promise.reject('Document not found');
    if (doc.passwordProtected && password !== 'teacher123') {
      return Promise.reject('Invalid password');
    }
    return Promise.resolve({ success: true, downloadUrl: doc.filePath });
  },

  // Contact
  submitContact: (formData) => {
    console.log('Contact form submitted:', formData);
    return Promise.resolve({ success: true, message: 'Thank you for your message!' });
  },

  // Analytics (mock)
  getAnalytics: () => Promise.resolve({
    totalVisits: 1247,
    totalDownloads: 89,
    recentVisits: [
      { date: '2024-01-15', visits: 23 },
      { date: '2024-01-14', visits: 18 },
      { date: '2024-01-13', visits: 31 }
    ]
  })
};
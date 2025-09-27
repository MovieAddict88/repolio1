import React, { useState, useEffect } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import { Toaster } from './components/ui/toaster';

// Import other sections (will be created in next iteration)
const ExperienceSection = () => <div className="p-8 text-center text-gray-500">Experience section - Coming soon</div>;
const EducationSection = () => <div className="p-8 text-center text-gray-500">Education section - Coming soon</div>;
const ProjectsSection = () => <div className="p-8 text-center text-gray-500">Projects section - Coming soon</div>;
const DownloadsSection = () => <div className="p-8 text-center text-gray-500">Downloads section - Coming soon</div>;
const ContactSection = () => <div className="p-8 text-center text-gray-500">Contact section - Coming soon</div>;

const PortfolioHome = () => {
  const [currentSection, setCurrentSection] = useState('about');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle dark mode persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'about':
        return <AboutSection />;
      case 'skills':
        return <SkillsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <main className="p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
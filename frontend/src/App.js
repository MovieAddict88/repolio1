import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import EducationSection from './components/sections/EducationSection';
import ProjectsSection from './components/sections/ProjectsSection';
import DownloadsSection from './components/sections/DownloadsSection';
import ContactSection from './components/sections/ContactSection';
import { Toaster } from './components/ui/toaster';

const PortfolioHome = () => {
  const [currentSection, setCurrentSection] = useState('about');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch portfolio data from the new PHP backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // The URL assumes the PHP backend is served from the root of the same domain.
        // This might need adjustment based on the final deployment setup.
        const response = await axios.get('/php_backend/api/portfolio.php');
        setPortfolioData(response.data);
      } catch (err) {
        setError('Failed to load portfolio data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderSection = () => {
    if (loading) {
      return <div className="text-center">Loading...</div>;
    }
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }
    if (!portfolioData) {
      return <div className="text-center">No data available.</div>;
    }

    switch (currentSection) {
      case 'about':
        return <AboutSection content={portfolioData.about} />;
      case 'skills':
        return <SkillsSection skills={portfolioData.skills} />;
      case 'experience':
        return <ExperienceSection experience={portfolioData.experience} />;
      case 'education':
        return <EducationSection education={portfolioData.education} />;
      case 'projects':
        return <ProjectsSection projects={portfolioData.projects} />;
      case 'downloads':
        return <DownloadsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <AboutSection content={portfolioData.about} />;
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
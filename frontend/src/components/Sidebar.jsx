import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { 
  Menu, 
  User, 
  Award, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Download, 
  Mail,
  Sun,
  Moon,
  Home
} from 'lucide-react';

const Sidebar = ({ currentSection, onSectionChange, isDarkMode, onToggleDarkMode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'about', label: 'About Me', icon: User },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Sarah Johnson</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Teacher Portfolio</p>
          </div>
        </div>
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={onToggleDarkMode}
              className="data-[state=checked]:bg-gray-700"
            />
            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileOpen(false);
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2024 Sarah Johnson Portfolio
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Sarah Johnson</span>
            </div>
          </div>
          
          {/* Mobile Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={onToggleDarkMode}
              className="data-[state=checked]:bg-gray-700"
            />
            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
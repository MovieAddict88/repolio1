import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Building, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { mockApi } from '../../mock';

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const data = await mockApi.getExperience();
        setExperiences(data);
      } catch (error) {
        console.error('Error loading experience:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, []);

  const nextExperience = () => {
    setCurrentIndex((prev) => (prev + 1) % experiences.length);
  };

  const prevExperience = () => {
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  const TimelineView = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-blue-200 dark:bg-blue-800"></div>
      
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative flex items-start gap-6">
            {/* Timeline Dot */}
            <div className="relative z-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
            
            {/* Experience Card */}
            <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {exp.jobTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{exp.institution}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 w-fit">
                    <Calendar className="w-3 h-3 mr-1" />
                    {exp.duration}
                  </Badge>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {exp.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  const TableView = () => (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Current Experience Display */}
        <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Experience Details
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevExperience}
                disabled={experiences.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                {currentIndex + 1} of {experiences.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={nextExperience}
                disabled={experiences.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {experiences[currentIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {experiences[currentIndex].jobTitle}
                </h4>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{experiences[currentIndex].institution}</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  {experiences[currentIndex].duration}
                </Badge>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {experiences[currentIndex].description}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Table Navigation */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      {exp.jobTitle}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exp.institution}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {exp.duration}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Professional Experience
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          A journey through my teaching career, highlighting key roles and achievements 
          in elementary education and student development.
        </p>
        
        {/* View Toggle */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            onClick={() => setViewMode('timeline')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Timeline View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className="flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            Detail View
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timeline' ? <TimelineView /> : <TableView />}

      {/* Summary Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
        <CardContent className="p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                3+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Years of Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {experiences.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Positions Held</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                100+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Students Taught</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceSection;
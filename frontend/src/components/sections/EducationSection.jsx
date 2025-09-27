import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { GraduationCap, Award, Calendar, BookOpen, Star } from 'lucide-react';
import { mockApi } from '../../mock';

const EducationSection = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const data = await mockApi.getEducation();
        setEducation(data);
      } catch (error) {
        console.error('Error loading education:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, []);

  const getEducationIcon = (course) => {
    if (course.toLowerCase().includes('bachelor') || course.toLowerCase().includes('degree')) {
      return GraduationCap;
    } else if (course.toLowerCase().includes('high school')) {
      return BookOpen;
    }
    return Award;
  };

  const getEducationColor = (index) => {
    const colors = [
      'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800',
      'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800',
      'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
    ];
    return colors[index % colors.length];
  };

  const getIconColor = (index) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400',
      'bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400',
      'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400'
    ];
    return colors[index % colors.length];
  };

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
          Educational Background
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          My academic journey that has shaped my passion for education and equipped me 
          with the knowledge and skills to inspire young learners.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
        
        <div className="space-y-8">
          {education.map((edu, index) => {
            const IconComponent = getEducationIcon(edu.course);
            
            return (
              <div key={edu.id} className="relative flex items-start gap-6">
                {/* Timeline Dot - Hidden on mobile */}
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hidden md:flex ${getIconColor(index)}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                
                {/* Education Card */}
                <Card className={`flex-1 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${getEducationColor(index)}`}>
                  <CardContent className="p-6">
                    {/* Mobile Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 md:hidden ${getIconColor(index)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {edu.course}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium">{edu.school}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 w-fit mt-2 lg:mt-0"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {edu.year}
                      </Badge>
                    </div>
                    
                    {edu.achievements && (
                      <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          <span className="font-medium">Achievements:</span> {edu.achievements}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Academic Highlights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                Bachelor's
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Elementary Education</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                Magna Cum Laude
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Academic Honor</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                Dean's List
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">4 Semesters</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                Valedictorian
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High School</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Development */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Continuing Education & Certifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Teaching Certification
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Illinois State Board of Education • Valid through 2027
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Google for Education Certified
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level 1 & 2 Certification • 2023
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Differentiated Instruction Training
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  University of Illinois Extension • 2024
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Special Education Endorsement
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently pursuing • Expected 2025
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationSection;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import * as Icons from 'lucide-react';
import { mockApi } from '../../mock';

const SkillsSection = () => {
  const [skills, setSkills] = useState({ softSkills: [], hardSkills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await mockApi.getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  const renderSkillCard = (skill, category) => {
    const IconComponent = Icons[skill.icon] || Icons.Award;
    const isHardSkill = category === 'hard';
    
    return (
      <Card 
        key={skill.id}
        className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
          isHardSkill 
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800' 
            : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
        }`}
      >
        <CardContent className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isHardSkill 
              ? 'bg-blue-100 dark:bg-blue-800/50' 
              : 'bg-green-100 dark:bg-green-800/50'
          }`}>
            <IconComponent 
              className={`w-8 h-8 ${
                isHardSkill 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-green-600 dark:text-green-400'
              }`} 
            />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {skill.name}
          </h3>
          <Badge 
            variant="secondary"
            className={`${
              isHardSkill 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'
            }`}
          >
            {isHardSkill ? 'Technical Skill' : 'Soft Skill'}
          </Badge>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Skills & Expertise
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A comprehensive overview of my professional skills, combining both technical competencies 
          and essential soft skills that enable effective teaching and learning.
        </p>
      </div>

      {/* Soft Skills Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Icons.Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Soft Skills
          </h2>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {skills.softSkills.map((skill) => renderSkillCard(skill, 'soft'))}
        </div>
      </div>

      {/* Hard Skills Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Icons.Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Technical Skills
          </h2>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.hardSkills.map((skill) => renderSkillCard(skill, 'hard'))}
        </div>
      </div>

      {/* Skills Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {skills.softSkills.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Soft Skills</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {skills.hardSkills.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Technical Skills</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                3+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsSection;
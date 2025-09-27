import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

const SkillsSection = ({ skills }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Skills & Expertise
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Here is a summary of my professional skills and their proficiency levels.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Skillset</CardTitle>
        </CardHeader>
        <CardContent>
          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{skill.percentage}%</span>
                  </div>
                  <Progress value={parseInt(skill.percentage, 10)} className="w-full" />
                </div>
              ))}
            </div>
          ) : (
            <p>No skills listed. Please add some in the admin panel.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsSection;
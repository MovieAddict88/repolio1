import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, Calendar } from 'lucide-react';

const EducationSection = ({ education }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const options = { year: 'numeric', month: 'short' };
    const date = new Date(dateString);
    // Add a day to the date to avoid timezone issues where it might show the previous month
    date.setDate(date.getDate() + 1);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Educational Background
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A summary of my academic journey and qualifications.
        </p>
      </div>

      {education && education.length > 0 ? (
        <div className="relative border-l-2 border-purple-200 dark:border-purple-800 ml-4 pl-6 space-y-10">
          {education.map((edu, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[34px] top-1 w-4 h-4 bg-purple-600 rounded-full border-4 border-white dark:border-gray-900"></div>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {edu.degree}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 pt-1">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>{edu.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>
                        {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                {edu.description && (
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {edu.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p>No education history listed. Please add some in the admin panel.</p>
        </Card>
      )}
    </div>
  );
};

export default EducationSection;
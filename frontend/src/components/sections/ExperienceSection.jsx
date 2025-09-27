import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building, Calendar } from 'lucide-react';

const ExperienceSection = ({ experience }) => {
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
          Professional Experience
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A timeline of my key roles and responsibilities.
        </p>
      </div>

      {experience && experience.length > 0 ? (
        <div className="relative border-l-2 border-blue-200 dark:border-blue-800 ml-4 pl-6 space-y-10">
          {experience.map((exp, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[34px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900"></div>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {exp.job_title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 pt-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>
                        {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {exp.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p>No work experience listed. Please add some in the admin panel.</p>
        </Card>
      )}
    </div>
  );
};

export default ExperienceSection;
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';

const AboutSection = ({ content }) => {
  // A simple function to replace newline characters with <br> tags for HTML rendering.
  const formatContent = (text) => {
    return text.replace(/\n/g, '<br />');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content ? (
            <div
              className="prose prose-gray dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          ) : (
            <p>No content available. Please add content in the admin panel.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;
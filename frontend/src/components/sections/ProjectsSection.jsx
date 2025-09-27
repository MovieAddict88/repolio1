import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

const ProjectsSection = ({ projects }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          My Projects
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A selection of projects I've worked on.
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="flex flex-col border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {project.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Optional: Hide image on error or show a placeholder
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex flex-col flex-grow p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
                {project.link && (
                  <div className="mt-6">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p>No projects listed. Please add some in the admin panel.</p>
        </Card>
      )}
    </div>
  );
};

export default ProjectsSection;
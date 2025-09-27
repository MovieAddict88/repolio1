import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  ExternalLink, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  X,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import { mockApi } from '../../mock';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await mockApi.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    if (selectedProject?.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % selectedProject.media.length);
    }
  };

  const prevMedia = () => {
    if (selectedProject?.media) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + selectedProject.media.length) % selectedProject.media.length
      );
    }
  };

  const ProjectCard = ({ project }) => (
    <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Button
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            onClick={() => openProjectModal(project)}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.shortDesc}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Educational Project
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openProjectModal(project)}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectModal = () => {
    if (!selectedProject) return null;

    const currentMedia = selectedProject.media?.[currentMediaIndex];

    return (
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {selectedProject.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Media Gallery */}
            {selectedProject.media && selectedProject.media.length > 0 && (
              <div className="relative">
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {currentMedia?.type === 'image' && (
                    <img
                      src={currentMedia.url}
                      alt={selectedProject.title}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  )}
                  
                  {currentMedia?.type === 'video' && (
                    <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400">Video Content</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Media Navigation */}
                {selectedProject.media.length > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevMedia}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {selectedProject.media.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentMediaIndex
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextMedia}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Project Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Project Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedProject.fullDesc}
              </p>
            </div>
            
            {/* Project Links */}
            {selectedProject.links && selectedProject.links.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Resources & Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.links.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        console.log(`Opening link: ${link.name}`);
                        // In real implementation, this would open the actual link
                      }}
                    >
                      {link.name.toLowerCase().includes('pdf') ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      {link.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
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
          Educational Projects
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore my innovative teaching projects and classroom initiatives that have enhanced 
          student engagement and academic achievement.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Projects Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Project Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {projects.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Completed Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                300+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Students Impacted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                25%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Performance Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Modal */}
      <ProjectModal />
    </div>
  );
};

export default ProjectsSection;
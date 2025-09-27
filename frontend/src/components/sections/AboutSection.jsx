import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { mockApi } from '../../mock';

const AboutSection = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await mockApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-600">
                  <img
                    src={profile?.profileImage}
                    alt={profile?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                </div>
                <Badge 
                  className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1"
                >
                  Available
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {profile?.name}
                </h1>
                <h2 className="text-xl lg:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {profile?.title}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {profile?.bio}
                </p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    onClick={() => window.location.href = `mailto:${profile?.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-2"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{profile?.email}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Phone</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{profile?.phone}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Location</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{profile?.address}</p>
          </CardContent>
        </Card>
      </div>

      {/* Optional Intro Video Section */}
      {profile?.introVideo && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Introduction Video
            </h3>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Watch my introduction video to learn more about my teaching philosophy and approach.
              </p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => console.log('Play intro video')}
              >
                Play Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Statement */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Teaching Philosophy
          </h3>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
              I believe that every child has the potential to succeed and thrive in a supportive learning environment. 
              My approach to teaching focuses on creating engaging, hands-on experiences that make learning both fun and meaningful.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
              Through differentiated instruction and personalized attention, I strive to meet each student where they are 
              and help them reach their full potential. I'm passionate about fostering creativity, critical thinking, 
              and a lifelong love of learning in all my students.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Beyond academics, I focus on building character, empathy, and social skills that will serve my students 
              well throughout their lives. Education is not just about curriculum—it's about nurturing the whole child.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;
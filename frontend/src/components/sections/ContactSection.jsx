import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Linkedin, 
  Facebook, 
  Instagram,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { mockApi, socialLinksData, profileData } from '../../mock';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await mockApi.submitContact(formData);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'email':
        return Mail;
      case 'linkedin':
        return Linkedin;
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      default:
        return MessageCircle;
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: profileData.email,
      href: `mailto:${profileData.email}`,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      icon: Phone,
      title: "Phone",
      value: profileData.phone,
      href: `tel:${profileData.phone}`,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    },
    {
      icon: MapPin,
      title: "Location",
      value: profileData.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(profileData.address)}`,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Get In Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          I'd love to hear from you! Whether you have a question about my teaching experience, 
          want to discuss opportunities, or just want to connect, feel free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 gap-4">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              
              return (
                <Card 
                  key={index}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => window.open(method.href, '_blank')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {method.value}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Social Links */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <MessageCircle className="w-5 h-5" />
                Connect on Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {socialLinksData.map((social, index) => {
                  const IconComponent = getSocialIcon(social.platform);
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex items-center gap-3 p-4 h-auto justify-start hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        console.log(`Opening ${social.platform}: ${social.url}`);
                        window.open(social.url, '_blank');
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{social.platform}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {social.value}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                📅 Best Time to Reach Me
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span>Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Contact</span>
                  <span>Email</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Send className="w-5 h-5" />
              Send Me a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What's this about?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell me about your inquiry..."
                  className="mt-1 min-h-[120px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                * Required fields. I typically respond within 24 hours.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactSection;
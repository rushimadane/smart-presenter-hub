
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout, LayoutTemplate, FileText, FileImage, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePresentations } from '@/contexts/PresentationContext';
import { toast } from '@/components/ui/use-toast';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailSrc: string;
  slides: any[];
}

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addPresentation } = usePresentations();

  // Define template categories
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'business', name: 'Business' },
    { id: 'education', name: 'Education' },
    { id: 'creative', name: 'Creative' },
    { id: 'portfolio', name: 'Portfolio' }
  ];

  // Mock template data
  const templates: Template[] = [
    {
      id: 'business-pitch',
      title: 'Business Pitch Deck',
      description: 'Perfect template for startup pitches and business proposals',
      category: 'business',
      thumbnailSrc: '/placeholder.svg',
      slides: [
        { title: 'Business Pitch', content: 'Your compelling pitch goes here' },
        { title: 'Problem Statement', content: 'Describe the problem you\'re solving' },
        { title: 'Solution', content: 'Your innovative solution' },
        { title: 'Market Analysis', content: 'Market size and opportunity' },
        { title: 'Business Model', content: 'How you make money' }
      ]
    },
    {
      id: 'educational-presentation',
      title: 'Educational Presentation',
      description: 'Ideal for lectures, courses, and educational content',
      category: 'education',
      thumbnailSrc: '/placeholder.svg',
      slides: [
        { title: 'Course Introduction', content: 'Introduction to this educational content' },
        { title: 'Learning Objectives', content: 'What students will learn' },
        { title: 'Key Concepts', content: 'Important concepts to understand' },
        { title: 'Examples', content: 'Practical examples' },
        { title: 'Summary', content: 'Review of key points' }
      ]
    },
    {
      id: 'creative-portfolio',
      title: 'Creative Portfolio',
      description: 'Showcase your creative work with this stylish template',
      category: 'creative',
      thumbnailSrc: '/placeholder.svg',
      slides: [
        { title: 'About Me', content: 'Your creative background' },
        { title: 'Portfolio Highlights', content: 'Your best work' },
        { title: 'Process', content: 'Your creative process' },
        { title: 'Client Work', content: 'Projects for clients' },
        { title: 'Contact', content: 'How to reach you' }
      ]
    },
    {
      id: 'project-proposal',
      title: 'Project Proposal',
      description: 'Professional template for project proposals',
      category: 'business',
      thumbnailSrc: '/placeholder.svg',
      slides: [
        { title: 'Project Overview', content: 'Brief description of the project' },
        { title: 'Objectives', content: 'What this project aims to achieve' },
        { title: 'Timeline', content: 'Project milestones and deadlines' },
        { title: 'Budget', content: 'Financial details' },
        { title: 'Team', content: 'Who will be working on this' }
      ]
    },
    {
      id: 'personal-portfolio',
      title: 'Personal Portfolio',
      description: 'Showcase your skills and experience with this professional template',
      category: 'portfolio',
      thumbnailSrc: '/placeholder.svg',
      slides: [
        { title: 'Introduction', content: 'Brief personal introduction' },
        { title: 'Skills', content: 'Your key skills and competencies' },
        { title: 'Experience', content: 'Your work history' },
        { title: 'Projects', content: 'Notable projects you\'ve completed' },
        { title: 'Contact Information', content: 'How to get in touch with you' }
      ]
    },
    {
      id: 'course-syllabus',
      title: 'Course Syllabus',
      description: 'Structured template for course outlines and syllabi',
      category: 'education',
      thumbnailSrc: '/placeholder.svg',
      slides: [
        { title: 'Course Information', content: 'Basic course details' },
        { title: 'Weekly Schedule', content: 'Week-by-week course content' },
        { title: 'Required Materials', content: 'Books, software, etc.' },
        { title: 'Assessment Methods', content: 'How students will be graded' },
        { title: 'Course Policies', content: 'Attendance, late work, etc.' }
      ]
    }
  ];

  // Filter templates based on search query and selected category
  const filterTemplates = (category: string) => {
    let filtered = templates;
    
    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(template => template.category === category);
    }
    
    return filtered;
  };

  const handleUseTemplate = (template: Template) => {
    // Create a new presentation based on the template
    const newPresentation = {
      id: `template-${Date.now()}`,
      title: `${template.title} Copy`,
      slides: template.slides,
      dateCreated: new Date().toISOString()
    };
    
    // Add the new presentation to the context
    addPresentation(newPresentation);
    
    toast({
      title: "Template applied",
      description: `${template.title} has been applied to a new presentation.`
    });
    
    // Navigate to start-creating page
    navigate("/start-creating");
  };

  // Function to get the appropriate icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'education':
        return <FileImage className="h-5 w-5 text-green-500" />;
      case 'creative':
        return <Layout className="h-5 w-5 text-purple-500" />;
      case 'portfolio':
        return <FileCode className="h-5 w-5 text-orange-500" />;
      default:
        return <LayoutTemplate className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our <span className="gradient-text">Presentation Templates</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our professionally designed templates to create your next presentation quickly.
            </p>
          </div>
          
          <div className="mb-8">
            <Input
              type="search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex justify-center mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterTemplates(category.id).map((template) => (
                    <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={template.thumbnailSrc}
                          alt={template.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                          {getCategoryIcon(template.category)}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {template.slides.length} slides
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          className="w-full"
                        >
                          Use This Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {filterTemplates(category.id).length === 0 && (
                  <div className="text-center py-12">
                    <LayoutTemplate className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium">No templates found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or browse all templates
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;

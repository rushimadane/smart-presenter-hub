
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const StartCreating = () => {
  const [step, setStep] = useState<number>(1);
  const [presentationTitle, setPresentationTitle] = useState<string>('');
  const [presentationContent, setPresentationContent] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleStartCreating = () => {
    if (!presentationTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your presentation",
        variant: "destructive",
      });
      return;
    }

    if (!presentationContent.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your presentation",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
      toast({
        title: "Presentation created!",
        description: "Your AI-powered presentation has been generated successfully",
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Start Creating Your <span className="gradient-text">AI-Powered</span> Presentation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Just give us your content, and our AI will transform it into a stunning presentation in seconds.
            </p>
          </div>
          
          {step === 1 ? (
            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Create a New Presentation
                </CardTitle>
                <CardDescription>
                  Enter your presentation details and our AI will generate slides for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Presentation Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your presentation"
                    value={presentationTitle}
                    onChange={(e) => setPresentationTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Presentation Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Enter your presentation content. You can use bullet points, paragraphs, or any format you prefer."
                    value={presentationContent}
                    onChange={(e) => setPresentationContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full text-lg group" 
                  onClick={handleStartCreating}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                      Generating your presentation...
                    </>
                  ) : (
                    <>
                      Create Presentation
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Presentation is Ready!
                </CardTitle>
                <CardDescription>
                  Your AI-generated presentation has been created successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <LayoutGrid className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{presentationTitle}</h3>
                    <p className="text-gray-500">Preview your AI-generated presentation</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((slide) => (
                    <div 
                      key={slide} 
                      className="aspect-video bg-gray-50 rounded border border-gray-200 p-2 flex items-center justify-center"
                    >
                      <span className="text-sm text-gray-400">Slide {slide}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button className="flex-1">Edit Presentation</Button>
                <Button className="flex-1" variant="outline">Download</Button>
                <Button 
                  className="flex-1"
                  onClick={() => setStep(1)}
                  variant="outline" 
                >
                  Create New
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to explore more features?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Browse our library of professional templates for any occasion.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Explore Templates</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Invite team members to edit and view your presentations.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Start Collaborating</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Premium Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Unlock advanced features with our premium plans.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Plans</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartCreating;

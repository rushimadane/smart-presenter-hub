
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, ArrowRight, Key, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePresentation, PresentationRequest, savePresentation } from '@/services/presentationService';
import { usePresentations } from '@/contexts/PresentationContext';
import PresentationView from '@/components/PresentationView';

const apiKeySchema = z.object({
  apiKey: z.string().min(1, 'API Key is required')
});

type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

const StartCreating = () => {
  const [step, setStep] = useState<number>(1);
  const [presentationTitle, setPresentationTitle] = useState<string>('');
  const [presentationContent, setPresentationContent] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const { currentPresentation, addPresentation, setCurrentPresentation } = usePresentations();
  
  const apiKeyForm = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: '',
    },
  });

  const handleSaveApiKey = (values: ApiKeyFormValues) => {
    setApiKey(values.apiKey);
    localStorage.setItem('presentation_ai_key', values.apiKey);
    toast({
      title: "API Key saved",
      description: "Your API key has been saved successfully",
    });
    setSheetOpen(false);
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('presentation_ai_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleStartCreating = async () => {
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

    if (!apiKey) {
      toast({
        title: "API Key required",
        description: "Please add your API key to generate presentations",
        variant: "destructive",
      });
      setSheetOpen(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      const request: PresentationRequest = {
        title: presentationTitle,
        content: presentationContent,
        apiKey: apiKey
      };
      
      const generatedPresentation = await generatePresentation(request);
      addPresentation(generatedPresentation);
      
      setStep(2);
      toast({
        title: "Presentation created!",
        description: "Your AI-powered presentation has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast({
        title: "Error",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNew = () => {
    setPresentationTitle('');
    setPresentationContent('');
    setAgreeToTerms(false);
    setStep(1);
  };
  
  const handleSavePresentation = (updatedPresentation) => {
    savePresentation(updatedPresentation);
    setCurrentPresentation(updatedPresentation);
    toast({
      title: "Presentation updated",
      description: "Your presentation has been saved successfully",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Create Your <span className="gradient-text">AI-Powered</span> Presentation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your topic, and our AI will create a professional presentation with visuals in seconds.
            </p>
          </div>
          
          <div className="flex justify-end mb-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  {apiKey ? "Update API Key" : "Add API Key"}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>API Key Configuration</SheetTitle>
                  <SheetDescription>
                    Add your API key to enable AI-powered presentation generation.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <Form {...apiKeyForm}>
                    <form onSubmit={apiKeyForm.handleSubmit(handleSaveApiKey)} className="space-y-6">
                      <FormField
                        control={apiKeyForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Enter your API key" 
                                  type={showApiKey ? "text" : "password"} 
                                  {...field} 
                                  defaultValue={apiKey}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowApiKey(!showApiKey)}
                              >
                                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Save API Key</Button>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {step === 1 ? (
            <Card className="shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Tell Us About Your Presentation
                </CardTitle>
                <CardDescription>
                  Provide information about your topic, and our AI will generate a tailored presentation.
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
                    Tell us about your topic
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Share everything you know about your topic. Include key points, facts, important concepts, or anything else you want in your presentation."
                    value={presentationContent}
                    onChange={(e) => setPresentationContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The more information you provide, the better your presentation will be.
                  </p>
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
                      Creating your AI presentation...
                    </>
                  ) : (
                    <>
                      Generate Presentation
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            currentPresentation && (
              <PresentationView 
                presentation={currentPresentation}
                onCreateNew={handleCreateNew}
                onSave={handleSavePresentation}
              />
            )
          )}
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">How Our AI Builds Your Presentation</h2>
            <p className="text-gray-600 mb-8">
              We analyze your topic information, extract key concepts, add relevant images, 
              and create visually appealing slides with perfect formatting.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Our AI analyzes your content to identify key points and concepts, creating a logical presentation structure.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Visual Enhancement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Automatically adds relevant images and visual elements to make your presentation more engaging.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Professional Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Applies professional design principles and formatting to create a polished, cohesive presentation.</p>
                </CardContent>
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

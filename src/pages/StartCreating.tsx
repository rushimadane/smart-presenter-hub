
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
import { generatePresentation, PresentationRequest } from '@/services/presentationService';
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

  const { currentPresentation, addPresentation } = usePresentations();
  
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

  // Check for saved API key on component mount
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
            currentPresentation && (
              <PresentationView 
                presentation={currentPresentation}
                onCreateNew={handleCreateNew}
              />
            )
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

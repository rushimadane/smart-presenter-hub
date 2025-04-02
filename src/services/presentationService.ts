
import { toast } from "@/components/ui/use-toast";

export interface PresentationRequest {
  title: string;
  content: string;
  apiKey: string;
}

export interface SlideContent {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface Presentation {
  id: string;
  title: string;
  createdAt: string;
  slides: SlideContent[];
}

// Simulate API call to generate presentation
export const generatePresentation = async (request: PresentationRequest): Promise<Presentation> => {
  console.log("Generating presentation with API key:", `${request.apiKey.substring(0, 4)}...${request.apiKey.substring(request.apiKey.length - 4)}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would be an actual API call
  // return fetch('https://api.example.com/presentations', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${request.apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     title: request.title,
  //     content: request.content,
  //   }),
  // }).then(response => {
  //   if (!response.ok) {
  //     throw new Error('Failed to generate presentation');
  //   }
  //   return response.json();
  // });

  // For now, we'll return a mock presentation
  const mockSlides: SlideContent[] = [
    {
      title: "Introduction",
      content: "Key points about " + request.title,
    },
    {
      title: "Main Content",
      content: "Important details extracted from your content",
    },
    {
      title: "Conclusion",
      content: "Summary and next steps",
    }
  ];

  return {
    id: generateRandomId(),
    title: request.title,
    createdAt: new Date().toISOString(),
    slides: mockSlides,
  };
};

// Function to get saved presentations from local storage
export const getSavedPresentations = (): Presentation[] => {
  try {
    const savedPresentations = localStorage.getItem('saved_presentations');
    return savedPresentations ? JSON.parse(savedPresentations) : [];
  } catch (error) {
    console.error("Error retrieving saved presentations:", error);
    return [];
  }
};

// Function to save a presentation to local storage
export const savePresentation = (presentation: Presentation): void => {
  try {
    const presentations = getSavedPresentations();
    presentations.push(presentation);
    localStorage.setItem('saved_presentations', JSON.stringify(presentations));
  } catch (error) {
    console.error("Error saving presentation:", error);
    toast({
      title: "Error",
      description: "Failed to save presentation",
      variant: "destructive",
    });
  }
};

// Generate a random ID for presentations
const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

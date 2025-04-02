
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
  style?: {
    backgroundColor?: string;
    gradient?: string;
    textColor?: string;
    fontSize?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface Presentation {
  id: string;
  title: string;
  createdAt: string;
  slides: SlideContent[];
}

// Sample image URLs for various presentation topics
const topicImages = {
  business: [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573164574001-518958d9baa2?auto=format&fit=crop&w=800&q=80",
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=800&q=80",
  ],
  education: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80",
  ],
  marketing: [
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80",
  ],
  nature: [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  ],
  health: [
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
  ],
  general: [
    "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=800&q=80",
  ],
};

// Predefined visual styles for slides
const slideStyles = [
  {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontSize: "normal",
    alignment: "left"
  },
  {
    gradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    textColor: "#2d3748",
    fontSize: "large",
    alignment: "center"
  },
  {
    gradient: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
    textColor: "#ffffff",
    fontSize: "normal",
    alignment: "left"
  },
  {
    backgroundColor: "#2d3748",
    textColor: "#f7fafc",
    fontSize: "normal",
    alignment: "center"
  },
  {
    gradient: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
    textColor: "#4a5568",
    fontSize: "large",
    alignment: "left"
  },
  {
    gradient: "linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)",
    textColor: "#2d3748",
    fontSize: "normal",
    alignment: "center"
  },
];

// Function to determine slide topic based on content
const determineTopicFromContent = (content: string): string => {
  content = content.toLowerCase();
  
  if (content.includes("business") || content.includes("company") || content.includes("profit") || content.includes("market")) {
    return "business";
  } else if (content.includes("tech") || content.includes("code") || content.includes("software") || content.includes("digital")) {
    return "technology";
  } else if (content.includes("school") || content.includes("learn") || content.includes("student") || content.includes("teach")) {
    return "education";
  } else if (content.includes("market") || content.includes("brand") || content.includes("advertis") || content.includes("campaign")) {
    return "marketing";
  } else if (content.includes("nature") || content.includes("environment") || content.includes("planet") || content.includes("green")) {
    return "nature";
  } else if (content.includes("health") || content.includes("medical") || content.includes("wellness") || content.includes("fitness")) {
    return "health";
  } else {
    return "general";
  }
};

// Gets an image URL based on the slide content and position in the presentation
const getRelevantImageUrl = (slideContent: string, slideIndex: number, topic: string): string => {
  const topicImagesArray = topicImages[topic] || topicImages.general;
  const imageIndex = slideIndex % topicImagesArray.length;
  return topicImagesArray[imageIndex];
};

// Simulate API call to generate presentation
export const generatePresentation = async (request: PresentationRequest): Promise<Presentation> => {
  console.log("Generating presentation with API key:", `${request.apiKey.substring(0, 4)}...${request.apiKey.substring(request.apiKey.length - 4)}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would be an actual API call to a service like OpenAI
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

  // For demo purposes, extract keywords from content
  const contentLines = request.content
    .split(/[.\n]/)
    .filter(line => line.trim().length > 0)
    .map(line => line.trim());
  
  // Determine the overall topic for consistent image theming
  const topic = determineTopicFromContent(request.content);
  
  // Generate slides based on content
  const mockSlides: SlideContent[] = [];
  
  // Title slide
  mockSlides.push({
    title: request.title,
    content: "Created with AI",
    imageUrl: getRelevantImageUrl(request.title, 0, topic),
    style: slideStyles[0]
  });
  
  // Content slides
  const maxSlides = Math.min(contentLines.length, 6);
  for (let i = 0; i < maxSlides; i++) {
    const line = contentLines[i];
    const words = line.split(' ');
    
    // Extract key terms for the title (first 3-5 words if available)
    const titleWordCount = Math.min(words.length, words.length < 8 ? 3 : 5);
    const slideTitle = words.slice(0, titleWordCount).join(' ');
    
    // Use the full line as content or generate bullet points
    let slideContent = line;
    if (line.length > 50) {
      // Create bullet points from longer content
      slideContent = line
        .split(/[,;]/)
        .filter(point => point.trim().length > 0)
        .map(point => `• ${point.trim()}`)
        .join('\n');
    }
    
    mockSlides.push({
      title: slideTitle,
      content: slideContent,
      imageUrl: getRelevantImageUrl(line, i + 1, topic),
      style: slideStyles[(i + 1) % slideStyles.length]
    });
  }
  
  // Conclusion slide
  mockSlides.push({
    title: "Thank You",
    content: `Key takeaways from ${request.title}`,
    imageUrl: getRelevantImageUrl("conclusion", mockSlides.length, topic),
    style: slideStyles[mockSlides.length % slideStyles.length]
  });

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

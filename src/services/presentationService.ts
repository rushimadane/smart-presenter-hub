import { toast } from "@/components/ui/use-toast";
import { extractKeywords } from "@/utils/textUtils";

export interface PresentationRequest {
  title: string;
  content: string;
  apiKey: string;
  slideBySlide?: boolean;
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
    alignment: 'left' as const
  },
  {
    gradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    textColor: "#2d3748",
    fontSize: "large",
    alignment: 'center' as const
  },
  {
    gradient: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
    textColor: "#ffffff",
    fontSize: "normal",
    alignment: 'left' as const
  },
  {
    backgroundColor: "#2d3748",
    textColor: "#f7fafc",
    fontSize: "normal",
    alignment: 'center' as const
  },
  {
    gradient: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
    textColor: "#4a5568",
    fontSize: "large",
    alignment: 'left' as const
  },
  {
    gradient: "linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)",
    textColor: "#2d3748",
    fontSize: "normal",
    alignment: 'center' as const
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

// Function to convert paragraphs to bullet points
const formatContentAsBulletPoints = (content: string): string => {
  if (!content.includes('\n') && content.length > 60) {
    // If it's a long paragraph, break it into bullet points
    return content
      .split(/[.!?]/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => `• ${sentence.trim()}`)
      .join('\n');
  }
  
  // If it already has line breaks, add bullets to each line
  if (content.includes('\n')) {
    return content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.startsWith('•') ? line : `• ${line.trim()}`)
      .join('\n');
  }
  
  return content;
};

// Parse slide-by-slide content from user input
const parseSlideBySlideContent = (content: string): SlideContent[] => {
  const slideRegex = /Slide\s+(\d+):\s+(.+?)(?:\n|$)([\s\S]*?)(?=Slide\s+\d+:|$)/gi;
  const slides: SlideContent[] = [];
  let match;

  while ((match = slideRegex.exec(content)) !== null) {
    const slideNumber = parseInt(match[1]);
    const slideTitle = match[2].trim();
    let slideContent = match[3].trim();
    
    // Format the content as bullet points if needed
    if (slideContent.includes('•') || slideContent.includes('-')) {
      // Already has bullets, just clean up
      slideContent = slideContent.replace(/^[-•]\s*/gm, '• ');
    } else {
      // Convert lines to bullet points
      slideContent = slideContent
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => `• ${line.trim()}`)
        .join('\n');
    }
    
    slides.push({
      title: slideTitle,
      content: slideContent
    });
  }
  
  return slides;
};

// Enhance slide content with AI
const enhanceSlideContent = (slide: SlideContent, topic: string, slideIndex: number): SlideContent => {
  // Enrich the slide content with more details
  const keywords = extractKeywords(slide.content, 5);
  
  // Add relevant image
  const imageUrl = getRelevantImageUrl(slide.title + " " + keywords.join(" "), slideIndex, topic);
  
  // Apply a style based on the slide position
  const style = slideStyles[slideIndex % slideStyles.length];
  
  return {
    ...slide,
    imageUrl,
    style
  };
};

// Simulate API call to generate presentation
export const generatePresentation = async (request: PresentationRequest): Promise<Presentation> => {
  console.log("Generating presentation with API key:", `${request.apiKey.substring(0, 4)}...${request.apiKey.substring(request.apiKey.length - 4)}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let slides: SlideContent[] = [];
  const topic = determineTopicFromContent(request.content);
  
  if (request.slideBySlide) {
    // Parse slide-by-slide content
    const parsedSlides = parseSlideBySlideContent(request.content);
    
    // Enhance each slide with AI-generated content and images
    slides = parsedSlides.map((slide, index) => enhanceSlideContent(slide, topic, index));
  } else {
    // Extract keywords and key phrases from the content for regular content generation
    const keywords = extractKeywords(request.content, 20);
    
    // For demo purposes, extract detailed content from input
    const contentLines = request.content
      .split(/[.\n]/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());
    
    // Generate slides based on content
    // ... keep existing code (mockSlides generation for regular presentations)
    
    // Title slide
    slides.push({
      title: request.title,
      content: "AI-Powered Presentation",
      imageUrl: getRelevantImageUrl(request.title, 0, topic),
      style: slideStyles[0]
    });
    
    // Introduction slide
    if (contentLines.length > 0) {
      slides.push({
        title: "Overview",
        content: formatContentAsBulletPoints(keywords.slice(0, 5).join('\n')),
        imageUrl: getRelevantImageUrl("introduction " + topic, 1, topic),
        style: slideStyles[1]
      });
    }
    
    // Content slides - Create more focused slides based on the content
    const keyGroups = [];
    for (let i = 0; i < keywords.length; i += 3) {
      keyGroups.push(keywords.slice(i, i + 3));
    }
    
    // Create slides from keyword groups
    keyGroups.slice(0, 4).forEach((group, index) => {
      if (group.length === 0) return;
      
      // Create a title from the first keyword or key phrase
      const slideTitle = group[0].charAt(0).toUpperCase() + group[0].slice(1);
      
      // Create content from the related content lines or keywords
      let slideContent = group.join('\n');
      
      // Find relevant content from the original text
      const relevantContentLines = contentLines.filter(line => 
        group.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      if (relevantContentLines.length > 0) {
        slideContent = formatContentAsBulletPoints(relevantContentLines.join('\n'));
      } else {
        slideContent = formatContentAsBulletPoints(slideContent);
      }
      
      slides.push({
        title: slideTitle,
        content: slideContent,
        imageUrl: getRelevantImageUrl(slideTitle, index + 2, topic),
        style: slideStyles[(index + 2) % slideStyles.length]
      });
    });
    
    // Conclusion slide
    slides.push({
      title: "Key Takeaways",
      content: formatContentAsBulletPoints(keywords.slice(0, 4).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join('\n')),
      imageUrl: getRelevantImageUrl("conclusion " + topic, slides.length, topic),
      style: slideStyles[slides.length % slideStyles.length]
    });
  }

  return {
    id: generateRandomId(),
    title: request.title,
    createdAt: new Date().toISOString(),
    slides: slides,
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
    // If the presentation already exists, update it
    const existingIndex = presentations.findIndex(p => p.id === presentation.id);
    
    if (existingIndex >= 0) {
      presentations[existingIndex] = presentation;
    } else {
      presentations.push(presentation);
    }
    
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

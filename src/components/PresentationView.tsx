
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Edit, Plus, Image } from 'lucide-react';
import { Presentation } from '@/services/presentationService';

interface PresentationViewProps {
  presentation: Presentation;
  onEdit?: () => void;
  onCreateNew?: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({
  presentation,
  onEdit,
  onCreateNew
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = presentation.slides[currentSlideIndex];
  
  const goToPreviousSlide = () => {
    setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : prev));
  };
  
  const goToNextSlide = () => {
    setCurrentSlideIndex(prev => (prev < presentation.slides.length - 1 ? prev + 1 : prev));
  };

  const handleDownload = () => {
    // In a real app, this would generate a downloadable file
    // For now, we'll just create a JSON representation
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presentation));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${presentation.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Create inline style based on slide styling
  const getSlideStyles = () => {
    const style = currentSlide.style || {};
    
    const inlineStyle: React.CSSProperties = {
      textAlign: style.alignment as any || 'left',
      color: style.textColor || '#333333',
    };
    
    if (style.gradient) {
      inlineStyle.background = style.gradient;
    } else if (style.backgroundColor) {
      inlineStyle.backgroundColor = style.backgroundColor;
    }
    
    if (style.fontSize === 'large') {
      inlineStyle.fontSize = '1.125rem';
    }
    
    return inlineStyle;
  };
  
  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{presentation.title}</span>
          <div className="text-sm text-gray-500">
            {currentSlideIndex + 1} / {presentation.slides.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className="aspect-video rounded-lg border border-gray-200 flex flex-col items-center justify-center p-8 relative overflow-hidden"
          style={getSlideStyles()}
        >
          {currentSlide.imageUrl && (
            <div className="absolute inset-0 z-0">
              <img 
                src={currentSlide.imageUrl} 
                alt={currentSlide.title} 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
          )}
          
          <div className="relative z-10 text-center w-full">
            <h3 className="text-2xl font-bold mb-4 px-4">{currentSlide.title}</h3>
            <div className="whitespace-pre-line">
              {currentSlide.content.split('\n').map((line, i) => (
                <p key={i} className="my-2">{line}</p>
              ))}
            </div>
            {currentSlide.imageUrl && currentSlideIndex === 0 && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" size="sm" className="flex items-center gap-1 opacity-70">
                  <Image className="h-3.5 w-3.5" />
                  AI-generated visuals
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-1">
            {presentation.slides.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`w-2 h-2 p-0 rounded-full ${index === currentSlideIndex ? 'bg-primary' : 'bg-gray-200'}`}
                onClick={() => setCurrentSlideIndex(index)}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === presentation.slides.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        {onEdit && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        <Button
          className="flex-1"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        {onCreateNew && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCreateNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PresentationView;

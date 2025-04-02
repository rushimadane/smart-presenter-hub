
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Edit, Plus } from 'lucide-react';
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
        <div className="aspect-video bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-8">
          <h3 className="text-2xl font-bold mb-4">{currentSlide.title}</h3>
          <p className="text-center">{currentSlide.content}</p>
          {currentSlide.imageUrl && (
            <img 
              src={currentSlide.imageUrl} 
              alt={currentSlide.title} 
              className="mt-4 max-h-40 object-contain"
            />
          )}
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

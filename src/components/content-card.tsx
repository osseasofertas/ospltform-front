import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Play, Star } from "lucide-react";
import { AppContent } from "@/types";

interface ContentCardProps {
  content: AppContent;
  onSelect: () => void;
}

export default function ContentCard({ content, onSelect }: ContentCardProps) {
  return (
    <Card className="border border-neutral-200 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Content preview */}
        <div className="relative aspect-square w-full">
          {content.type === "photo" ? (
            <img 
              src={content.url} 
              alt={content.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-black rounded-t-lg flex items-center justify-center relative">
              <Play className="h-12 w-12 text-white" />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                VIDEO
              </div>
            </div>
          )}
        </div>
        
        {/* Content details and button */}
        <div className="p-3 space-y-3">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Single evaluation</p>
            <div className="flex items-center justify-center gap-1 text-primary">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-sm font-semibold">
                ${content.minEarning} - ${content.maxEarning}
              </span>
            </div>
          </div>
          
          <Button
            onClick={onSelect}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              <span>{content.type === "photo" ? "Rate Photo" : "Watch & Rate"}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
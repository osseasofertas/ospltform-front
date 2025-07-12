import { useState } from "react";
import { Star } from "lucide-react";
import { AppQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionStarRatingProps {
  question: AppQuestion;
  value: number;
  onChange: (value: number) => void;
}

export default function QuestionStarRating({ question, value, onChange }: QuestionStarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const metadata = question.metadata || {};

  return (
    <div className="flex items-center justify-center space-x-2">
      <span className="text-sm text-neutral-600">{metadata.minLabel || "Poco importante"}</span>
      <div className="flex space-x-1 mx-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-8 w-8 cursor-pointer transition-all hover:scale-110",
              star <= (hoveredStar || value) 
                ? "text-accent fill-accent" 
                : "text-neutral-300"
            )}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
          />
        ))}
      </div>
      <span className="text-sm text-neutral-600">{metadata.maxLabel || "Muy importante"}</span>
    </div>
  );
}

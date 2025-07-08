import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AppQuestion } from "@/types";

interface QuestionMultipleChoiceProps {
  question: AppQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionMultipleChoice({ question, value, onChange }: QuestionMultipleChoiceProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`option-${index}`} />
          <Label 
            htmlFor={`option-${index}`} 
            className="flex-1 p-3 rounded-lg border border-neutral-200 hover:border-primary cursor-pointer"
          >
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

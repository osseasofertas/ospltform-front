import { Textarea } from "@/components/ui/textarea";
import { AppQuestion } from "@/types";

interface QuestionFreeTextProps {
  question: AppQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionFreeText({ question, value, onChange }: QuestionFreeTextProps) {
  return (
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      placeholder="Comparte tus ideas y sugerencias..."
    />
  );
}

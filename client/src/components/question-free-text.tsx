import { Textarea } from "@/components/ui/textarea";
import { AppQuestion } from "@/types";

interface QuestionFreeTextProps {
  question: AppQuestion;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionFreeText({ question, value, onChange }: QuestionFreeTextProps) {
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleCut = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onPaste={handlePaste}
      onCopy={handleCopy}
      onCut={handleCut}
      rows={4}
      className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      placeholder="Escribe tu respuesta..."
    />
  );
}

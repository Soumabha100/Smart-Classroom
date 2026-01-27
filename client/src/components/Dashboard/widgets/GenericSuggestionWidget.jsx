import React from "react";
// ✅ CHANGED: Use Lucide icons instead of react-icons
import { Star, BookOpen, MessageCircle } from "lucide-react";

const iconMap = {
  careerSuggestion: <Star className="text-yellow-400 w-6 h-6" />,
  learningSuggestion: <BookOpen className="text-blue-400 w-6 h-6" />,
  motivationalQuote: <MessageCircle className="text-green-400 w-6 h-6" />,
};

const GenericSuggestionWidget = ({ data, type }) => {
  const content =
    type === "motivationalQuote"
      ? `"${data.quote}" - ${data.author}`
      : data.suggestion;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
        {iconMap[type] || <Star className="w-6 h-6" />}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          {data.title}
        </h3>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{content}</p>
      </div>
    </div>
  );
};

export default GenericSuggestionWidget;

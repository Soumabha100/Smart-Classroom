import React from "react";
import HeaderWidget from "./widgets/HeaderWidget";
import TodoListWidget from "./widgets/TodoListWidget";
import QuickStatsWidget from "./widgets/QuickStatsWidget";
import GenericSuggestionWidget from "./widgets/GenericSuggestionWidget";

const WidgetRenderer = ({ widget }) => {
  const { type, data } = widget;

  switch (type) {
    case "header":
      return <HeaderWidget data={data} />;
    case "todoList":
      return <TodoListWidget data={data} />;
    case "quickStats":
      return <QuickStatsWidget data={data} />;
    case "careerSuggestion":
    case "learningSuggestion":
    case "motivationalQuote":
      return <GenericSuggestionWidget data={data} type={type} />;
    default:
      console.warn(`Unknown widget type: ${type}`);
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">Unknown widget type: "{type}"</span>
        </div>
      );
  }
};

export default WidgetRenderer;

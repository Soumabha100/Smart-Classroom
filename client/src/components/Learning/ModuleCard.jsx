import React from "react";
import {
  Video,
  Puzzle,
  ClipboardCheck,
  Award,
  Lock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const ModuleCard = ({ module, onStart, isLocked, isCurrent }) => {
  const getIcon = () => {
    const commonProps = { size: 24, className: "text-white" };
    switch (module.type) {
      case "lesson":
        return <Video {...commonProps} />;
      case "quiz":
        return <ClipboardCheck {...commonProps} />;
      case "puzzle":
        return <Puzzle {...commonProps} />;
      case "challenge":
        return <Award {...commonProps} />;
      default:
        return <Award {...commonProps} />;
    }
  };

  const getIconBgColor = () => {
    if (module.done) return "bg-green-500";
    if (isCurrent) return "bg-blue-600";
    if (isLocked) return "bg-slate-400 dark:bg-slate-600";
    return "bg-slate-400 dark:bg-slate-600";
  };

  const cardStateClasses = {
    locked: "bg-slate-100 dark:bg-slate-800/50 opacity-60 cursor-not-allowed",
    done: "bg-green-50 dark:bg-green-900/20 border-green-500/50",
    current:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-500/50 ring-2 ring-blue-500/50",
    default: "bg-white dark:bg-slate-800/60 hover:border-blue-500/50",
  };

  let state = "default";
  if (isLocked) state = "locked";
  if (module.done) state = "done";
  if (isCurrent) state = "current";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ${cardStateClasses[state]}`}
    >
      <div className={`p-3 rounded-lg ${getIconBgColor()}`}>{getIcon()}</div>
      <div className="flex-grow">
        <h3 className="font-bold text-slate-800 dark:text-white">
          {module.title}
        </h3>
        <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
          {module.type}
        </p>
      </div>

      {module.done ? (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle size={20} />
          <span className="font-semibold text-sm">Completed</span>
        </div>
      ) : isLocked ? (
        <Lock size={20} className="text-slate-400 dark:text-slate-500" />
      ) : (
        <button
          onClick={() => onStart(module)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          Start <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

export default ModuleCard;

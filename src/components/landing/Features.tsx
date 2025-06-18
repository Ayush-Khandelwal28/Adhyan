import { FileText, BookOpen, Zap, Brain, LucideIcon } from 'lucide-react';

export function FeatureIcons() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
      <FeatureIcon icon={FileText} color="blue" label="Smart Notes" />
      <FeatureIcon icon={BookOpen} color="indigo" label="Flashcards" />
      <FeatureIcon icon={Zap} color="purple" label="Quizzes" />
      <FeatureIcon icon={Brain} color="green" label="Mind Maps" />
    </div>
  );
}

function FeatureIcon({ icon: Icon, color, label }: { icon: LucideIcon; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
      <Icon className={`h-8 w-8 text-${color}-600 dark:text-${color}-400 mb-2`} />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}
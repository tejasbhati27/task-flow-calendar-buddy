
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  const [isChecked, setIsChecked] = useState(task.completed);
  
  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggleComplete(task.id, checked);
  };
  
  const getCategoryColor = () => {
    const category = task.category?.toLowerCase() || 'other';
    const colorClasses: Record<string, string> = {
      math: 'bg-category-math',
      science: 'bg-category-science',
      english: 'bg-category-english',
      history: 'bg-category-history',
      languages: 'bg-category-languages',
      cs: 'bg-category-cs',
      other: 'bg-category-other',
    };
    
    return colorClasses[category] || colorClasses.other;
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Checkbox 
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="h-5 w-5"
      />
      <div className="flex flex-col flex-1">
        <span className={cn("font-medium transition-all", isChecked && "completed-task text-muted-foreground")}>
          {task.title}
        </span>
        <span className="text-xs text-muted-foreground">
          Due: {format(task.dueDate, 'MMM dd, yyyy')}
        </span>
      </div>
      {task.category && (
        <div className={cn("h-2 w-2 rounded-full", getCategoryColor())} title={task.category} />
      )}
    </div>
  );
};

export default TaskItem;

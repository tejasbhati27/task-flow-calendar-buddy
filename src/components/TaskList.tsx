
import React from 'react';
import { Task } from '@/types';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddClick: () => void;
  showAddButton?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  title, 
  tasks, 
  onToggleComplete, 
  onAddClick,
  showAddButton = true
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showAddButton && (
          <Button variant="outline" size="sm" onClick={onAddClick} className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        )}
      </div>
      <div className="border rounded-lg divide-y">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggleComplete={onToggleComplete}
            />
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No tasks to display
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

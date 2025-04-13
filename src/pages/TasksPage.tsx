
import React, { useState } from 'react';
import { Task } from '@/types';
import TaskList from '@/components/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TasksPageProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddTask: () => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, onToggleComplete, onAddTask }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter('all')}>
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setFilter('active')}>
              Active ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter('completed')}>
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <TaskList
            title="All Tasks"
            tasks={filteredTasks}
            onToggleComplete={onToggleComplete}
            onAddClick={onAddTask}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <TaskList
            title="Active Tasks"
            tasks={filteredTasks}
            onToggleComplete={onToggleComplete}
            onAddClick={onAddTask}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <TaskList
            title="Completed Tasks"
            tasks={filteredTasks}
            onToggleComplete={onToggleComplete}
            onAddClick={onAddTask}
            showAddButton={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;

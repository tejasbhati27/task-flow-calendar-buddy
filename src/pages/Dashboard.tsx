
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskList from '@/components/TaskList';
import { Task } from '@/types';
import { format, isToday } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddTask: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onToggleComplete, onAddTask }) => {
  // Filter today's tasks
  const todayTasks = tasks.filter(task => isToday(new Date(task.dueDate)));
  
  // Get upcoming tasks (not today, not completed)
  const upcomingTasks = tasks.filter(task => 
    !isToday(new Date(task.dueDate)) && 
    !task.completed && 
    new Date(task.dueDate) > new Date()
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()).slice(0, 5);
  
  // Calculate completion stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {tasks.length} total tasks
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <div>
          <TaskList 
            title="Today's Tasks" 
            tasks={todayTasks}
            onToggleComplete={onToggleComplete}
            onAddClick={onAddTask}
          />
          
          <div className="mt-4 flex justify-end">
            <Link to="/tasks" className="flex items-center text-sm text-primary hover:underline">
              <ListTodo className="h-4 w-4 mr-1" />
              View all tasks
            </Link>
          </div>
        </div>
        
        {/* Upcoming Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming</h2>
            <Link to="/calendar" className="flex items-center text-sm text-primary hover:underline">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Calendar view
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {upcomingTasks.length > 0 ? (
                <div className="divide-y">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="p-4 flex items-start">
                      <div className="mr-4 p-2 bg-accent rounded-md">
                        <span className="text-accent-foreground font-medium">
                          {format(new Date(task.dueDate), 'd')}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(task.dueDate), 'MMM')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {task.category || 'No category'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-muted" />
                  No upcoming tasks
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

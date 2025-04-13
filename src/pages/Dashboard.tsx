
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskList from '@/components/TaskList';
import { Task } from '@/types';
import { format, isToday } from 'date-fns';
import { Calendar as CalendarIcon, ListTodo, BarChart3, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddTask: () => void;
  onAddUpcomingTask: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  tasks, 
  onToggleComplete, 
  onAddTask,
  onAddUpcomingTask
}) => {
  // Filter today's tasks
  const todayTasks = tasks.filter(task => isToday(new Date(task.dueDate)));
  const todayTasksLimited = todayTasks.slice(0, 10);
  const hasMoreTodayTasks = todayTasks.length > 10;
  
  // Get upcoming tasks (not today, not completed)
  const upcomingTasks = tasks.filter(task => 
    !isToday(new Date(task.dueDate)) && 
    !task.completed && 
    new Date(task.dueDate) > new Date()
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const upcomingTasksLimited = upcomingTasks.slice(0, 10);
  const hasMoreUpcomingTasks = upcomingTasks.length > 10;
  
  // Calculate completion stats for today's tasks only
  const todayCompletedTasks = todayTasks.filter(task => task.completed).length;
  const todayCompletionRate = todayTasks.length > 0 
    ? Math.round((todayCompletedTasks / todayTasks.length) * 100) 
    : 0;
  
  const todayRemainingTasks = todayTasks.length - todayCompletedTasks;

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayCompletionRate}%</div>
            <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${todayCompletionRate}%` }} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayRemainingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayCompletedTasks} of {todayTasks.length} completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <div>
          <TaskList 
            title="Today's Tasks" 
            tasks={todayTasksLimited}
            onToggleComplete={onToggleComplete}
            onAddClick={onAddTask}
          />
          
          <div className="mt-4 flex justify-end gap-2">
            {hasMoreTodayTasks && (
              <Link to="/tasks">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ListTodo className="h-4 w-4" />
                  View all today's tasks
                </Button>
              </Link>
            )}
            <Link to="/analysis" className="ml-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Upcoming Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Goals & Targets</h2>
            <div className="flex items-center gap-2">
              <Button 
                onClick={onAddUpcomingTask} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Target
              </Button>
              <Link to="/calendar" className="flex items-center text-sm text-primary hover:underline">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Calendar view
              </Link>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {upcomingTasksLimited.length > 0 ? (
                <div className="divide-y">
                  {upcomingTasksLimited.map(task => (
                    <div key={task.id} className="p-4 flex items-start hover:bg-accent/10 transition-colors">
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
                  {hasMoreUpcomingTasks && (
                    <div className="p-3 text-center">
                      <Link to="/tasks">
                        <Button variant="ghost" size="sm">View all upcoming tasks</Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <CalendarIcon className="h-6 w-6 mx-auto mb-2 text-muted" />
                  No upcoming targets
                  <div className="mt-2">
                    <Button 
                      onClick={onAddUpcomingTask} 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add Target
                    </Button>
                  </div>
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

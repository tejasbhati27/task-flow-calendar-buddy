
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, isSameDay, parseISO, startOfMonth, endOfMonth, getDaysInMonth, addDays, subDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AnalysisPageProps {
  tasks: Task[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const TIME_BLOCKS = ['Morning (6AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)', 'Night (9PM-6AM)'];

const AnalysisPage: React.FC<AnalysisPageProps> = ({ tasks }) => {
  const today = new Date();
  
  // Weekly data
  const weeklyData = useMemo(() => {
    const startDate = startOfWeek(today);
    const endDate = endOfWeek(today);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const dayTasks = tasks.filter(task => 
        isSameDay(new Date(task.dueDate), day)
      );
      
      const completed = dayTasks.filter(task => task.completed).length;
      const total = dayTasks.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        name: format(day, 'EEE'),
        date: format(day, 'MMM dd'),
        total,
        completed,
        completionRate,
      };
    });
  }, [tasks]);

  // Monthly data
  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = getDaysInMonth(today);
    const daysPerGroup = Math.ceil(daysInMonth / 7); // Group into approximately weeks
    
    const groups: { [key: string]: { total: number; completed: number } } = {};
    
    for (let i = 0; i < daysInMonth; i++) {
      const currentDay = addDays(monthStart, i);
      const groupIndex = Math.floor(i / daysPerGroup);
      const groupName = `Week ${groupIndex + 1}`;
      
      const dayTasks = tasks.filter(task => 
        isSameDay(new Date(task.dueDate), currentDay)
      );
      
      if (!groups[groupName]) {
        groups[groupName] = { total: 0, completed: 0 };
      }
      
      groups[groupName].total += dayTasks.length;
      groups[groupName].completed += dayTasks.filter(task => task.completed).length;
    }
    
    return Object.entries(groups).map(([name, data]) => ({
      name,
      total: data.total,
      completed: data.completed,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  }, [tasks]);

  // Category distribution
  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tasks]);

  // Time of day productivity
  const timeOfDayData = useMemo(() => {
    const timeBlocks = [
      { name: 'Morning', range: [6, 11], completed: 0, total: 0 },
      { name: 'Afternoon', range: [12, 16], completed: 0, total: 0 },
      { name: 'Evening', range: [17, 20], completed: 0, total: 0 },
      { name: 'Night', range: [21, 5], completed: 0, total: 0 },
    ];
    
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i));
    
    const completedTasks = tasks.filter(task => task.completed);
    
    completedTasks.forEach(task => {
      const taskDate = new Date(task.dueDate);
      const isRecent = last30Days.some(day => isSameDay(day, taskDate));
      
      if (!isRecent) return;
      
      const hour = taskDate.getHours();
      
      for (const block of timeBlocks) {
        const [start, end] = block.range;
        
        // Handle the special case for night which crosses midnight
        if (block.name === 'Night') {
          if (hour >= start || hour <= end) {
            block.completed += 1;
          }
        } else if (hour >= start && hour <= end) {
          block.completed += 1;
        }
      }
    });
    
    // Calculate percentage
    const totalCompleted = timeBlocks.reduce((sum, block) => sum + block.completed, 0);
    
    return timeBlocks.map(block => ({
      name: block.name,
      completed: block.completed,
      percentage: totalCompleted > 0 ? Math.round((block.completed / totalCompleted) * 100) : 0,
    }));
  }, [tasks]);

  // Most productive day
  const mostProductiveDay = useMemo(() => {
    const dayProductivity: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0,
      'Thursday': 0, 'Friday': 0, 'Saturday': 0
    };
    
    tasks.filter(task => task.completed).forEach(task => {
      const day = format(new Date(task.dueDate), 'EEEE');
      dayProductivity[day] += 1;
    });
    
    let maxDay = 'Sunday';
    let maxCompleted = 0;
    
    Object.entries(dayProductivity).forEach(([day, completed]) => {
      if (completed > maxCompleted) {
        maxDay = day;
        maxCompleted = completed;
      }
    });
    
    return maxDay;
  }, [tasks]);

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Task Analysis</h1>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="productivity">Productivity Analysis</TabsTrigger>
        </TabsList>

        {/* Weekly Analysis */}
        <TabsContent value="weekly" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion (This Week)</CardTitle>
                <CardDescription>
                  View your task completion rate per day this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      total: { theme: { light: "#0088FE", dark: "#0088FE" } },
                      completed: { theme: { light: "#00C49F", dark: "#00C49F" } },
                    }}
                  >
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" name="Total Tasks" fill="#0088FE" />
                      <Bar dataKey="completed" name="Completed Tasks" fill="#00C49F" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
                <CardDescription>
                  Daily task completion percentage this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      completionRate: { theme: { light: "#8884d8", dark: "#8884d8" } },
                    }}
                  >
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="completionRate" 
                        name="Completion Rate %" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monthly Analysis */}
        <TabsContent value="monthly" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Task Breakdown</CardTitle>
                <CardDescription>
                  Task completion by week this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      total: { theme: { light: "#0088FE", dark: "#0088FE" } },
                      completed: { theme: { light: "#00C49F", dark: "#00C49F" } },
                    }}
                  >
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" name="Total Tasks" fill="#0088FE" />
                      <Bar dataKey="completed" name="Completed Tasks" fill="#00C49F" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>
                  Tasks by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={{}}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Productivity Analysis */}
        <TabsContent value="productivity" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time of Day Productivity</CardTitle>
                <CardDescription>
                  When you complete tasks most often (last 30 days)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      percentage: { theme: { light: "#FF8042", dark: "#FF8042" } },
                    }}
                  >
                    <BarChart data={timeOfDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="percentage" 
                        name="Completion %" 
                        fill="#FF8042" 
                        background={{ fill: '#eee' }}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
                <CardDescription>
                  Key statistics about your task completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/20 rounded-md">
                    <h3 className="font-medium mb-1">Most Productive Day</h3>
                    <p className="text-xl font-bold">{mostProductiveDay}</p>
                    <p className="text-sm text-muted-foreground">
                      You complete more tasks on this day than any other
                    </p>
                  </div>
                  
                  <div className="p-4 bg-accent/20 rounded-md">
                    <h3 className="font-medium mb-1">Most Productive Time</h3>
                    <p className="text-xl font-bold">
                      {timeOfDayData.sort((a, b) => b.percentage - a.percentage)[0]?.name || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This is when you tend to complete most of your tasks
                    </p>
                  </div>

                  <div className="p-4 bg-accent/20 rounded-md">
                    <h3 className="font-medium mb-1">Most Common Task Category</h3>
                    <p className="text-xl font-bold">
                      {categoryData.sort((a, b) => b.value - a.value)[0]?.name || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You have more tasks in this category than any other
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisPage;

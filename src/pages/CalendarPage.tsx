
import React, { useState, useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { Task } from '@/types';
import CalendarView from '@/components/Calendar/CalendarView';
import TaskList from '@/components/TaskList';
import { Progress } from '@/components/ui/progress';

interface CalendarPageProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onDateClick: (date: Date) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ tasks, onToggleComplete, onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Filter tasks for the selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), selectedDate));
  }, [tasks, selectedDate]);
  
  // Calculate completion rate for the selected date
  const completionRate = useMemo(() => {
    if (selectedDateTasks.length === 0) return 0;
    
    const completedTasks = selectedDateTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / selectedDateTasks.length) * 100);
  }, [selectedDateTasks]);
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick(date); // This will open the modal for adding a task
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CalendarView 
            tasks={tasks} 
            onDateClick={handleDateClick} 
            selectedDate={selectedDate}
          />
        </div>
        <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Completion Rate</h3>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          <TaskList 
            title={`Tasks for ${selectedDate.toLocaleDateString()}`} 
            tasks={selectedDateTasks} 
            onToggleComplete={onToggleComplete} 
            onAddClick={() => onDateClick(selectedDate)}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

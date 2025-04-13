
import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  tasks: Task[];
  onDateClick: (date: Date) => void;
  selectedDate?: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDateClick, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);
  
  // Get the start day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = startOfMonth(currentMonth).getDay();
  
  // Create blank days to fill the start of the calendar
  const blankDays = Array(startDay).fill(null);
  
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Check if a day has tasks
  const dayHasTasks = (day: Date): boolean => {
    return tasks.some(task => isSameDay(new Date(task.dueDate), day));
  };
  
  // Get the count of tasks for a specific day
  const getTaskCountForDay = (day: Date): number => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), day)).length;
  };

  const handleDateClick = (day: Date) => {
    onDateClick(day);
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date())}>
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Blank days */}
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`} className="h-12 sm:h-24 border rounded-lg bg-muted/20"></div>
        ))}
        
        {/* Days of month */}
        {daysInMonth.map((day) => {
          const hasTask = dayHasTasks(day);
          const taskCount = hasTask ? getTaskCountForDay(day) : 0;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={cn(
                "h-12 sm:h-24 border rounded-lg p-1 cursor-pointer select-none transition-colors",
                isToday(day) && "border-primary border-2",
                isSelected && "bg-primary/10 border-primary",
                !isSameMonth(day, currentMonth) && "text-muted-foreground",
                hasTask && !isSelected && "calendar-day-with-task",
                "hover:bg-accent"
              )}
            >
              <div className="flex justify-between items-start">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-sm",
                  isSelected && "bg-primary text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </div>
                {taskCount > 0 && (
                  <div className="bg-primary/80 text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {taskCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;

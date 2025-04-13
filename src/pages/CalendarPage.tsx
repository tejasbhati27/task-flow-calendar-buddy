
import React from 'react';
import { Task } from '@/types';
import CalendarView from '@/components/Calendar/CalendarView';

interface CalendarPageProps {
  tasks: Task[];
  onDateClick: (date: Date) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ tasks, onDateClick }) => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <div className="border rounded-lg p-6 bg-white">
        <CalendarView tasks={tasks} onDateClick={onDateClick} />
      </div>
    </div>
  );
};

export default CalendarPage;


import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Task } from '@/types';
import Navbar from '@/components/Navbar';
import Dashboard from './Dashboard';
import CalendarPage from './CalendarPage';
import TasksPage from './TasksPage';
import TaskModal from '@/components/TaskModal';

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Read Chapter 3 of Textbook',
    dueDate: new Date(),
    completed: false,
    category: 'english'
  },
  {
    id: '2',
    title: 'Complete Math Assignment',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    completed: false,
    category: 'math'
  },
  {
    id: '3',
    title: 'Study for History Quiz',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    completed: false,
    category: 'history'
  },
  {
    id: '4',
    title: 'Submit Science Lab Report',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    completed: true,
    category: 'science'
  }
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('studentTasks');
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        setTasks(initialTasks);
      }
    } else {
      // Use initialTasks if nothing in localStorage
      setTasks(initialTasks);
    }
  }, []);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('studentTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed } : task
      )
    );
    
    const taskTitle = tasks.find(task => task.id === id)?.title;
    
    toast({
      title: completed ? "Task completed" : "Task marked incomplete",
      description: taskTitle,
    });
  };
  
  const handleAddTask = (values: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: values.title,
      dueDate: values.dueDate,
      completed: false,
      category: values.category
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task added",
      description: values.title,
    });
  };
  
  const openAddTaskModal = (date?: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onAddTask={() => openAddTaskModal()}
            />
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <CalendarPage 
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDateClick={(date) => openAddTaskModal(date)}
            />
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <TasksPage 
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onAddTask={() => openAddTaskModal()}
            />
          } 
        />
      </Routes>
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default Index;

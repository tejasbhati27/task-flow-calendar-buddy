
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span>StudyTrack</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/calendar" className="text-sm font-medium hover:text-primary transition-colors">
            Calendar
          </Link>
          <Link to="/tasks" className="text-sm font-medium hover:text-primary transition-colors">
            Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

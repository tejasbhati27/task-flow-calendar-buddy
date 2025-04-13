
export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  category?: string;
}

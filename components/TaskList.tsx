'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed } : task
      ));

      toast({
        title: 'Success',
        description: `Task marked as ${completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(tasks.filter(task => task._id !== taskId));
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (taskId: string, updatedData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, ...updatedTask } : task
      ));

      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });

      setEditingTask(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500">No tasks found</div>
      ) : (
        tasks.map((task) => (
          <Card key={task._id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => handleComplete(task._id, checked as boolean)}
                />
                <div>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <p className="text-xs text-gray-400">
                    Due: {format(new Date(task.dueDate), 'PPP')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTask(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Input
                          defaultValue={task.title}
                          onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                          placeholder="Task title"
                        />
                      </div>
                      <div>
                        <Textarea
                          defaultValue={task.description}
                          onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                          placeholder="Task description"
                        />
                      </div>
                      <Button
                        onClick={() => editingTask && handleUpdate(task._id, editingTask)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(task._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
});

export default function TaskForm() {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      reset();
      setDate(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          {...register('title')}
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Task description"
          {...register('description')}
          className="w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message as string}
          </p>
        )}
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.dueDate.message as string}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  );
}
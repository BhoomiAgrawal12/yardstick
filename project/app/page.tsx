import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Task Management
        </h1>
        <div className="space-y-8">
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </div>
  );
}
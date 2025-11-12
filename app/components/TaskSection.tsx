"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Target, TrendingUp, Clock } from 'lucide-react';
import { ProgressLog } from './Dashboard';
import { toast } from 'sonner';

interface TaskSectionProps {
  onAddLog: (log: Omit<ProgressLog, 'id'>) => void;
  logs: ProgressLog[];
}

type NewLogData = Omit<ProgressLog, 'id' | 'timestamp' | 'progressPercentage' | 'subtasks'>;

const initialFormData: NewLogData = {
  taskName: '',
  description: '',
  status: 'in-progress',
};

export default function TaskSection({ onAddLog, logs }: TaskSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<NewLogData>(initialFormData);
  const { taskName, description, status } = formData;

  // Calculate real counts from logs
  const activeTasks = logs.filter(log => log.status === 'in-progress').length || 0;
  const completedTasks = logs.filter(log => log.status === 'completed').length || 0;
  const pendingTasks = logs.filter(log => log.status === 'pending').length || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName && description) {
      onAddLog({
        ...formData,
        timestamp: new Date(),
        progressPercentage: 0,
        subtasks: []
      });
      setIsAdding(false);
      setFormData(initialFormData);
      toast.success('Progress log added successfully!');
    }
  };

  return (
    <section aria-labelledby="tasks-heading">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 id="tasks-heading">Your Tasks</h2>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          aria-expanded={isAdding}
          aria-controls="add-task-form"
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-4 sm:mb-6" id="add-task-form">
          <CardHeader>
            <CardTitle>New Progress Log</CardTitle>
            <CardDescription className="text-sm">
              Record your progress on any task or mission
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  placeholder="e.g., Complete landing page design"
                  value={taskName}
                  onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you've accomplished or what you're working on..."
                  value={description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  aria-required="true"
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status} 
                  onValueChange={(value: NewLogData['status']) => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status" aria-label="Select task status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="flex-1 sm:flex-none">Save Log</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base">Active Tasks</CardTitle>
            <Target className="size-4 text-muted-foreground group-hover:text-blue-600 transition-colors" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div aria-live="polite" aria-atomic="true">
              <div>{activeTasks}</div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Tasks in progress
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base">Completed</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground group-hover:text-green-600 transition-colors" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div aria-live="polite" aria-atomic="true">
              <div>{completedTasks}</div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Total completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base">Pending</CardTitle>
            <Clock className="size-4 text-muted-foreground group-hover:text-orange-600 transition-colors" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div aria-live="polite" aria-atomic="true">
              <div>{pendingTasks}</div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Awaiting start
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

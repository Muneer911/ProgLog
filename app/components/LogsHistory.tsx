"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Calendar, CheckCircle2, Clock, Circle, Edit2, Trash2, Save, X, ListChecks } from 'lucide-react';
import { ProgressLog } from './Dashboard';
import { toast } from 'sonner';

interface LogsHistoryProps {
  logs: ProgressLog[];
  onUpdateLog: (id: string, log: Omit<ProgressLog, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  onOpenLog: (id: string) => void;
}

const statusConfig = {
  completed: {
    label: 'Completed',
    variant: 'default' as const,
    icon: CheckCircle2,
    color: 'text-green-600'
  },
  'in-progress': {
    label: 'In Progress',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-blue-600'
  },
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    icon: Circle,
    color: 'text-gray-600'
  }
};

export default function LogsHistory({ logs, onUpdateLog, onDeleteLog, onOpenLog }: LogsHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<ProgressLog, 'id'> | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const handleEdit = (log: ProgressLog) => {
    setEditingId(log.id);
    setEditForm({
      taskName: log.taskName,
      description: log.description,
      timestamp: log.timestamp,
      status: log.status,
      progressPercentage: log.progressPercentage,
      whiteboardData: log.whiteboardData,
      brainstormNotes: log.brainstormNotes,
      logicMapNodes: log.logicMapNodes
    });
  };

  const handleSave = () => {
    if (editingId && editForm) {
      onUpdateLog(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this log?')) {
      onDeleteLog(id);
      toast.success('Log deleted successfully');
    }
  };

  const handleQuickStatusChange = (log: ProgressLog, newStatus: 'completed' | 'in-progress' | 'pending') => {
    onUpdateLog(log.id, {
      ...log,
      status: newStatus
    });
    const statusLabels = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      pending: 'Pending'
    };
    toast.success(`Status changed to ${statusLabels[newStatus]}`);
  };

  return (
    <section aria-labelledby="logs-heading">
      <Card>
        <CardHeader>
          <CardTitle id="logs-heading">Progress History</CardTitle>
          <CardDescription>
            A timeline of all your logged progress and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {logs.length === 0 ? (
              <div 
                className="flex flex-col items-center justify-center py-12 text-center"
                role="status"
                aria-live="polite"
              >
                <Calendar className="size-12 text-muted-foreground mb-4" aria-hidden="true" />
                <p className="text-muted-foreground">
                  No progress logs yet. Start tracking your journey!
                </p>
              </div>
            ) : (
              <ul className="space-y-4" role="list" aria-label="Progress logs">
                {logs.map((log) => {
                  const config = statusConfig[log.status];
                  const Icon = config.icon;
                  const isEditing = editingId === log.id;
                  
                  return (
                    <li key={log.id}>
                      <Card>
                        <CardContent className="pt-6">
                          {isEditing && editForm ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-task-${log.id}`}>Task Name</Label>
                                <Input
                                  id={`edit-task-${log.id}`}
                                  value={editForm.taskName}
                                  onChange={(e) => setEditForm({ ...editForm, taskName: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-desc-${log.id}`}>Description</Label>
                                <Textarea
                                  id={`edit-desc-${log.id}`}
                                  value={editForm.description}
                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-status-${log.id}`}>Status</Label>
                                <Select 
                                  value={editForm.status} 
                                  onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                                >
                                  <SelectTrigger id={`edit-status-${log.id}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleSave} size="sm">
                                  <Save className="mr-2 size-4" aria-hidden="true" />
                                  Save
                                </Button>
                                <Button onClick={handleCancel} variant="outline" size="sm">
                                  <X className="mr-2 size-4" aria-hidden="true" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => onOpenLog(log.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  onOpenLog(log.id);
                                }
                              }}
                              aria-label={`Open details for ${log.taskName}`}
                            >
                              <div className={`mt-1 shrink-0 ${config.color}`} aria-hidden="true">
                                <Icon className="size-5" />
                              </div>
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 w-full">
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="break-words">{log.taskName}</h3>
                                    <p className="text-muted-foreground text-sm break-words">
                                      {log.description}
                                    </p>
                                    {log.subtasks && log.subtasks.length > 0 && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <ListChecks className="size-4 text-muted-foreground" aria-hidden="true" />
                                        <span className="text-muted-foreground text-xs sm:text-sm">
                                          {log.subtasks.filter(st => st.completed).length} / {log.subtasks.length} subtasks completed
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button 
                                          className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                                          aria-label="Change status"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Badge 
                                            variant={config.variant}
                                            className="cursor-pointer"
                                          >
                                            {config.label}
                                          </Badge>
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuickStatusChange(log, 'completed');
                                          }}
                                          className="cursor-pointer"
                                        >
                                          <CheckCircle2 className="mr-2 size-4 text-green-600" aria-hidden="true" />
                                          Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuickStatusChange(log, 'in-progress');
                                          }}
                                          className="cursor-pointer"
                                        >
                                          <Clock className="mr-2 size-4 text-blue-600" aria-hidden="true" />
                                          In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuickStatusChange(log, 'pending');
                                          }}
                                          className="cursor-pointer"
                                        >
                                          <Circle className="mr-2 size-4 text-gray-600" aria-hidden="true" />
                                          Pending
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 w-full">
                                  <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                                    <Calendar className="size-4" aria-hidden="true" />
                                    <time dateTime={log.timestamp.toISOString()}>
                                      {formatDate(log.timestamp)}
                                    </time>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(log);
                                      }}
                                      aria-label="Edit log"
                                      className="hover:bg-accent transition-colors size-8 p-0 sm:size-auto sm:p-2"
                                    >
                                      <Edit2 className="size-4" aria-hidden="true" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(log.id);
                                      }}
                                      aria-label="Delete log"
                                      className="hover:bg-destructive/10 transition-colors size-8 p-0 sm:size-auto sm:p-2"
                                    >
                                      <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
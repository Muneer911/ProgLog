"use client";

import { useState } from 'react';
import Navbar from './Navbar';
import TaskSection from './TaskSection';
import LogsHistory from './LogsHistory';
import ProgressDetail from './ProgressDetail';

interface DashboardProps {
  userEmail: string;
  onSignOut: () => void;
}

export interface ProgressLog {
  id: string;
  taskName: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'in-progress' | 'pending';
  progressPercentage?: number;
  whiteboardData?: string;
  brainstormNotes?: BrainstormNote[];
  logicMapNodes?: LogicNode[];
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface BrainstormNote {
  id: string;
  content: string;
  timestamp: Date;
}

export interface LogicNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
}

export default function Dashboard({ userEmail, onSignOut }: DashboardProps) {
  const [logs, setLogs] = useState<ProgressLog[]>([
    {
      id: '1',
      taskName: 'Project Setup',
      description: 'Initialized repository and configured development environment',
      timestamp: new Date('2025-11-07T10:30:00'),
      status: 'completed',
      progressPercentage: 100,
      brainstormNotes: [],
      subtasks: [
        { id: 's1', title: 'Initialize Git repository', completed: true, createdAt: new Date('2025-11-07T10:00:00') },
        { id: 's2', title: 'Setup package.json', completed: true, createdAt: new Date('2025-11-07T10:15:00') },
        { id: 's3', title: 'Configure development environment', completed: true, createdAt: new Date('2025-11-07T10:30:00') }
      ]
    },
    {
      id: '2',
      taskName: 'API Integration',
      description: 'Working on integrating third-party APIs',
      timestamp: new Date('2025-11-08T09:15:00'),
      status: 'in-progress',
      progressPercentage: 60,
      brainstormNotes: [],
      subtasks: [
        { id: 's4', title: 'Research API endpoints', completed: true, createdAt: new Date('2025-11-08T08:00:00') },
        { id: 's5', title: 'Set up API authentication', completed: true, createdAt: new Date('2025-11-08T08:30:00') },
        { id: 's6', title: 'Implement data fetching', completed: true, createdAt: new Date('2025-11-08T09:00:00') },
        { id: 's7', title: 'Add error handling', completed: false, createdAt: new Date('2025-11-08T09:15:00') },
        { id: 's8', title: 'Write unit tests', completed: false, createdAt: new Date('2025-11-08T09:15:00') }
      ]
    },
    {
      id: '3',
      taskName: 'UI Design',
      description: 'Scheduled to review mockups with design team',
      timestamp: new Date('2025-11-08T14:00:00'),
      status: 'pending',
      progressPercentage: 0,
      brainstormNotes: [],
      subtasks: [
        { id: 's9', title: 'Create wireframes', completed: false, createdAt: new Date('2025-11-08T14:00:00') },
        { id: 's10', title: 'Design mockups', completed: false, createdAt: new Date('2025-11-08T14:00:00') },
        { id: 's11', title: 'Review with team', completed: false, createdAt: new Date('2025-11-08T14:00:00') }
      ]
    }
  ]);

  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const handleAddLog = (log: Omit<ProgressLog, 'id'>) => {
    const newLog: ProgressLog = {
      ...log,
      id: Date.now().toString()
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateLog = (id: string, updatedLog: Omit<ProgressLog, 'id'>) => {
    setLogs(logs.map(log => 
      log.id === id ? { ...updatedLog, id } : log
    ));
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const selectedLog = logs.find(log => log.id === selectedLogId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={userEmail} onSignOut={onSignOut} />
      {selectedLog ? (
        <ProgressDetail 
          log={selectedLog}
          onBack={() => setSelectedLogId(null)}
          onUpdate={(updatedLog) => handleUpdateLog(selectedLog.id, updatedLog)}
        />
      ) : (
        <main 
          className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl"
          role="main"
          aria-label="Dashboard content"
        >
          <div className="space-y-6 sm:space-y-8">
            <section aria-labelledby="welcome-heading">
              <h1 id="welcome-heading" className="mb-2">
                Welcome to Proglog
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Track your progress and stay on top of your goals
              </p>
            </section>

            <TaskSection onAddLog={handleAddLog} logs={logs} />
            <LogsHistory 
              logs={logs} 
              onUpdateLog={handleUpdateLog}
              onDeleteLog={handleDeleteLog}
              onOpenLog={(id) => setSelectedLogId(id)}
            />
          </div>
        </main>
      )}
    </div>
  );
}
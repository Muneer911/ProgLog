"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Pencil, 
  Eraser, 
  Download, 
  Trash2, 
  Plus,
  Lightbulb,
  Network,
  TrendingUp,
  ListChecks,
  Check,
  Play,
  Pause,
  RotateCcw,
  Link2Off
} from 'lucide-react';
import { ProgressLog, BrainstormNote, LogicNode, SubTask } from './Dashboard';
import { toast } from 'sonner';

interface ProgressDetailProps {
  log: ProgressLog;
  onBack: () => void;
  onUpdate: (log: Omit<ProgressLog, 'id'>) => void;
}

export default function ProgressDetail({ log, onBack, onUpdate }: ProgressDetailProps) {
  const [progressPercentage, setProgressPercentage] = useState(log.progressPercentage || 0);
  const [brainstormNotes, setBrainstormNotes] = useState<BrainstormNote[]>(log.brainstormNotes || []);
  const [newNote, setNewNote] = useState('');
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>(log.logicMapNodes || []);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>(log.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<'draw' | 'erase'>('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && log.whiteboardData) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = log.whiteboardData;
    }
  }, [log.whiteboardData]);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      const rect = canvas!.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      const rect = canvas!.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = drawMode === 'draw' ? '#000000' : '#ffffff';
      ctx.lineWidth = drawMode === 'draw' ? 2 : 20;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveWhiteboard();
  };

  const saveWhiteboard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const whiteboardData = canvas.toDataURL();
      onUpdate({ ...log, whiteboardData });
    }
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveWhiteboard();
      toast.success('Whiteboard cleared');
    }
  };

  const downloadWhiteboard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${log.taskName}-whiteboard.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Whiteboard downloaded');
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgressPercentage(newProgress);
    onUpdate({ ...log, progressPercentage: newProgress });
    toast.success(`Progress updated to ${newProgress}%`);
  };

  const calculateProgress = (tasks: SubTask[]) => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(t => t.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: SubTask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false,
        createdAt: new Date()
      };
      const updatedSubtasks = [...subtasks, newSubtask];
      setSubtasks(updatedSubtasks);
      const newProgress = calculateProgress(updatedSubtasks);
      setProgressPercentage(newProgress);
      onUpdate({ ...log, subtasks: updatedSubtasks, progressPercentage: newProgress });
      setNewSubtaskTitle('');
      toast.success('Subtask added');
    }
  };

  const toggleSubtask = (id: string) => {
    const updatedSubtasks = subtasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setSubtasks(updatedSubtasks);
    const newProgress = calculateProgress(updatedSubtasks);
    setProgressPercentage(newProgress);
    onUpdate({ ...log, subtasks: updatedSubtasks, progressPercentage: newProgress });
    const task = updatedSubtasks.find(t => t.id === id);
    toast.success(task?.completed ? 'Subtask completed!' : 'Subtask reopened');
  };

  const deleteSubtask = (id: string) => {
    const updatedSubtasks = subtasks.filter(task => task.id !== id);
    setSubtasks(updatedSubtasks);
    const newProgress = calculateProgress(updatedSubtasks);
    setProgressPercentage(newProgress);
    onUpdate({ ...log, subtasks: updatedSubtasks, progressPercentage: newProgress });
    toast.success('Subtask deleted');
  };

  const addBrainstormNote = () => {
    if (newNote.trim()) {
      const note: BrainstormNote = {
        id: Date.now().toString(),
        content: newNote,
        timestamp: new Date()
      };
      const updatedNotes = [...brainstormNotes, note];
      setBrainstormNotes(updatedNotes);
      onUpdate({ ...log, brainstormNotes: updatedNotes });
      setNewNote('');
      toast.success('Note added');
    }
  };

  const deleteBrainstormNote = (id: string) => {
    const updatedNotes = brainstormNotes.filter(note => note.id !== id);
    setBrainstormNotes(updatedNotes);
    onUpdate({ ...log, brainstormNotes: updatedNotes });
    toast.success('Note deleted');
  };

  const addLogicNode = () => {
    if (newNodeLabel.trim()) {
      const node: LogicNode = {
        id: Date.now().toString(),
        label: newNodeLabel,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        connections: []
      };
      const updatedNodes = [...logicNodes, node];
      setLogicNodes(updatedNodes);
      onUpdate({ ...log, logicMapNodes: updatedNodes });
      setNewNodeLabel('');
      toast.success('Node added');
    }
  };

  const deleteLogicNode = (id: string) => {
    const updatedNodes = logicNodes.filter(node => node.id !== id);
    setLogicNodes(updatedNodes);
    onUpdate({ ...log, logicMapNodes: updatedNodes });
    toast.success('Node deleted');
  };

  const connectNodes = (nodeId: string) => {
    if (selectedNodeId && selectedNodeId !== nodeId) {
      const updatedNodes = logicNodes.map(node => {
        if (node.id === selectedNodeId && !node.connections.includes(nodeId)) {
          return { ...node, connections: [...node.connections, nodeId] };
        }
        return node;
      });
      setLogicNodes(updatedNodes);
      onUpdate({ ...log, logicMapNodes: updatedNodes });
      setSelectedNodeId(null);
      toast.success('Nodes connected');
    } else {
      setSelectedNodeId(nodeId);
    }
  };

  const disconnectNode = (fromNodeId: string, toNodeId: string) => {
    const updatedNodes = logicNodes.map(node => {
      if (node.id === fromNodeId) {
        return { ...node, connections: node.connections.filter(id => id !== toNodeId) };
      }
      return node;
    });
    setLogicNodes(updatedNodes);
    onUpdate({ ...log, logicMapNodes: updatedNodes });
    toast.success('Nodes disconnected');
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button === 0) { // Left click only
      const node = logicNodes.find(n => n.id === nodeId);
      if (node) {
        setDraggedNodeId(nodeId);
        setDragOffset({
          x: e.clientX - node.x,
          y: e.clientY - node.y
        });
      }
    }
  };

  const handleNodeMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      const newX = Math.max(0, Math.min(e.clientX - containerRect.left - dragOffset.x, containerRect.width - 150));
      const newY = Math.max(0, Math.min(e.clientY - containerRect.top - dragOffset.y, containerRect.height - 60));
      
      const updatedNodes = logicNodes.map(node =>
        node.id === draggedNodeId ? { ...node, x: newX, y: newY } : node
      );
      setLogicNodes(updatedNodes);
    }
  };

  const handleNodeMouseUp = () => {
    if (draggedNodeId) {
      onUpdate({ ...log, logicMapNodes: logicNodes });
      setDraggedNodeId(null);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <div className="mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-3 sm:mb-4"
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="mb-2">{log.taskName}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">{log.description}</p>
          </div>
          <Badge variant={log.status === 'completed' ? 'default' : log.status === 'in-progress' ? 'secondary' : 'outline'} className="shrink-0">
            {log.status === 'completed' ? 'Completed' : log.status === 'in-progress' ? 'In Progress' : 'Pending'}
          </Badge>
        </div>
      </div>

      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" aria-hidden="true" />
            Progress Tracker
          </CardTitle>
          <CardDescription>Track how far youve come with this task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Progress value={progressPercentage} className="flex-1" />
            <span className="text-muted-foreground min-w-[3rem]">{progressPercentage}%</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress-slider">Adjust Progress</Label>
            <input
              id="progress-slider"
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={(e) => handleProgressChange([parseInt(e.target.value)])}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Progress percentage"
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="flex items-center gap-2">
                <ListChecks className="size-4" aria-hidden="true" />
                Mini Tasks ({subtasks.filter(t => t.completed).length}/{subtasks.length})
              </Label>
            </div>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a mini task..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSubtask();
                  }
                }}
              />
              <Button onClick={addSubtask} size="sm">
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Add
              </Button>
            </div>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {subtasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No mini tasks yet. Add some to track your progress!
                  </p>
                ) : (
                  subtasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleSubtask(task.id)}
                        className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground hover:border-primary'
                        }`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed && <Check className="size-3 text-primary-foreground" />}
                      </button>
                      <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSubtask(task.id)}
                        className="size-8 p-0"
                        aria-label="Delete subtask"
                      >
                        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="whiteboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whiteboard" className="text-xs sm:text-sm">
            <Pencil className="mr-1 sm:mr-2 size-3 sm:size-4" aria-hidden="true" />
            Whiteboard
          </TabsTrigger>
          <TabsTrigger value="brainstorm" className="text-xs sm:text-sm">
            <Lightbulb className="mr-1 sm:mr-2 size-3 sm:size-4" aria-hidden="true" />
            Brainstorm
          </TabsTrigger>
          <TabsTrigger value="logic" className="text-xs sm:text-sm">
            <Network className="mr-1 sm:mr-2 size-3 sm:size-4" aria-hidden="true" />
            Logic Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboard">
          <Card>
            <CardHeader>
              <CardTitle>Whiteboard</CardTitle>
              <CardDescription>Sketch ideas, diagrams, and notes visually</CardDescription>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant={drawMode === 'draw' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDrawMode('draw')}
                >
                  <Pencil className="mr-1 sm:mr-2 size-4" aria-hidden="true" />
                  Draw
                </Button>
                <Button
                  variant={drawMode === 'erase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDrawMode('erase')}
                >
                  <Eraser className="mr-1 sm:mr-2 size-4" aria-hidden="true" />
                  Erase
                </Button>
                <Button variant="outline" size="sm" onClick={clearWhiteboard}>
                  <Trash2 className="mr-1 sm:mr-2 size-4" aria-hidden="true" />
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={downloadWhiteboard}>
                  <Download className="mr-1 sm:mr-2 size-4" aria-hidden="true" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="border rounded-lg bg-white cursor-crosshair w-full max-w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                aria-label="Drawing canvas"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brainstorm">
          <Card>
            <CardHeader>
              <CardTitle>Brainstorming Session</CardTitle>
              <CardDescription>Capture ideas and thoughts as they come</CardDescription>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-4 p-3 sm:p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-muted-foreground">Session Time:</span>
                  <span className="text-muted-foreground text-sm">Session Time:</span>
                  <span className="font-mono text-xl sm:text-2xl">{formatTimer(timerSeconds)}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {!isTimerRunning ? (
                    <Button size="sm" onClick={() => setIsTimerRunning(true)} className="flex-1 sm:flex-none">
                      <Play className="mr-2 size-4" aria-hidden="true" />
                      Start
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsTimerRunning(false)} className="flex-1 sm:flex-none">
                      <Pause className="mr-2 size-4" aria-hidden="true" />
                      Pause
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setTimerSeconds(0);
                      setIsTimerRunning(false);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <RotateCcw className="mr-2 size-4" aria-hidden="true" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  placeholder="Add a new idea or note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      addBrainstormNote();
                    }
                  }}
                  rows={3}
                  className="flex-1 resize-none"
                />
                <Button onClick={addBrainstormNote} className="w-full sm:w-auto">
                  <Plus className="mr-2 size-4" aria-hidden="true" />
                  Add
                </Button>
              </div>
              <ScrollArea className="h-[300px] sm:h-[400px]">
                <div className="space-y-3">
                  {brainstormNotes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Lightbulb className="size-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                      <p>No notes yet. Start brainstorming!</p>
                    </div>
                  ) : (
                    brainstormNotes.map((note) => (
                      <Card key={note.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{note.content}</p>
                            <p className="text-muted-foreground mt-2">
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBrainstormNote(note.id)}
                            aria-label="Delete note"
                          >
                            <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logic">
          <Card>
            <CardHeader>
              <CardTitle>Logic Map</CardTitle>
              <CardDescription>Visualize problem-solving steps and connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a logic step or node..."
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addLogicNode();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={addLogicNode}>
                  <Plus className="mr-2 size-4" aria-hidden="true" />
                  Add Node
                </Button>
              </div>
              <div 
                className="border rounded-lg bg-secondary/20 relative h-[400px] overflow-hidden"
                onMouseMove={handleNodeMouseMove}
                onMouseUp={handleNodeMouseUp}
                onMouseLeave={handleNodeMouseUp}
              >
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .animated-line {
                    stroke-dasharray: 5, 5;
                    animation: dash 0.5s linear infinite;
                  }
                `}</style>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {logicNodes.map(node => 
                    node.connections.map(connId => {
                      const targetNode = logicNodes.find(n => n.id === connId);
                      if (!targetNode) return null;
                      return (
                        <line
                          key={`${node.id}-${connId}`}
                          x1={node.x + 60}
                          y1={node.y + 20}
                          x2={targetNode.x + 60}
                          y2={targetNode.y + 20}
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary animated-line"
                        />
                      );
                    })
                  )}
                </svg>
                {logicNodes.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Network className="size-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                      <p>No nodes yet. Start mapping your logic!</p>
                    </div>
                  </div>
                ) : (
                  logicNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`absolute bg-card border-2 rounded-lg p-3 cursor-move transition-all hover:shadow-lg select-none ${
                        selectedNodeId === node.id ? 'border-primary ring-2 ring-primary' : 'border-border'
                      }`}
                      style={{ left: node.x, top: node.y }}
                      onClick={() => connectNodes(node.id)}
                      onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Logic node: ${node.label}`}
                    >
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <p className="flex-1">{node.label}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLogicNode(node.id);
                          }}
                          aria-label="Delete node"
                        >
                          <Trash2 className="size-3 text-destructive" aria-hidden="true" />
                        </Button>
                      </div>
                      {node.connections.length > 0 && (
                        <div className="mt-2 pt-2 border-t flex flex-wrap gap-1">
                          {node.connections.map(connId => {
                            const targetNode = logicNodes.find(n => n.id === connId);
                            if (!targetNode) return null;
                            return (
                              <button
                                key={connId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  disconnectNode(node.id, connId);
                                }}
                                className="text-xs px-2 py-1 bg-primary/10 rounded flex items-center gap-1 hover:bg-primary/20 transition-colors"
                                aria-label={`Disconnect from ${targetNode.label}`}
                              >
                                <Link2Off className="size-3" aria-hidden="true" />
                                {targetNode.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {logicNodes.length > 0 && (
                <p className="text-muted-foreground">
                  Click on nodes to connect them. Click a node, then click another to create a connection.
                  Drag nodes to connect them. Click two nodes to connect. Click connection badges to disconnect. Drag nodes to reposition.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
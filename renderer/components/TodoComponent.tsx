'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scrollarea"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import {
  Book,
  Car,
  ChevronDown,
  Command,
  Home,
  MoreVertical,
  Plus,
  User,
  Briefcase,
  Utensils,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'

interface Task {
  id: string
  title: string
  completed: boolean
  time: string
  project?: string
  tag?: string
  members?: string[]
}

interface List {
  id: string
  name: string
  icon: React.ReactNode
  count: number
}

interface Group {
  id: string
  name: string
  members: number
  avatars: string[]
}

declare global {
  interface Window {
    electron: {
      saveTasks: (tasks: Task[]) => void
      loadTasks: () => Promise<Task[]>
    }
  }
}

export default function Component() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskTime, setNewTaskTime] = useState('')

  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await window.electron.loadTasks()
      setTasks(loadedTasks)
    }
    loadTasks()
  }, [])

  useEffect(() => {
    window.electron.saveTasks(tasks)
  }, [tasks])

  const lists: List[] = [
    { id: '1', name: 'Home', icon: <Home className="w-4 h-4" />, count: 8 },
    { id: '2', name: 'Completed', icon: <Command className="w-4 h-4" />, count: 16 },
    { id: '3', name: 'Personal', icon: <User className="w-4 h-4" />, count: 4 },
    { id: '4', name: 'Work', icon: <Briefcase className="w-4 h-4" />, count: 6 },
    { id: '5', name: 'Diet', icon: <Utensils className="w-4 h-4" />, count: 3 },
    { id: '6', name: 'List of Book', icon: <Book className="w-4 h-4" />, count: 8 },
    { id: '7', name: 'Road trip list', icon: <Car className="w-4 h-4" />, count: 6 },
  ]

  const groups: Group[] = [
    {
      id: '1',
      name: 'Mobal Project',
      members: 5,
      avatars: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    },
    {
      id: '2',
      name: 'Futur Project',
      members: 4,
      avatars: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    },
  ]

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = () => {
    if (newTaskTitle.trim() !== '' && newTaskTime.trim() !== '') {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        time: newTaskTime,
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
      setNewTaskTime('')
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Private</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {/* Lists */}
          <div className="space-y-1">
            {lists.map(list => (
              <Button
                key={list.id}
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                {list.icon}
                <span>{list.name}</span>
                <span className="ml-auto text-muted-foreground">{list.count}</span>
              </Button>
            ))}
          </div>

          {/* Groups */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Group</h2>
            <div className="space-y-4">
              {groups.map(group => (
                <div key={group.id} className="p-4 rounded-lg bg-muted">
                  <h3 className="font-medium mb-2">{group.name}</h3>
                  <div className="flex -space-x-2">
                    {group.avatars.map((avatar, i) => (
                      <Avatar key={i} className="border-2 border-background w-8 h-8">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{group.members} People</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Good Morning, Sullivan! 👋</h1>
              <p className="text-muted-foreground">Today, {currentDate}</p>
            </div>
            <Button variant="outline">
              Today
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.tag && (
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-blue-500">{task.tag}</span>
                    </div>
                  )}
                </div>
                {task.members && (
                  <div className="flex -space-x-2">
                    {task.members.map((member, i) => (
                      <Avatar key={i} className="border-2 border-background w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">{task.time}</div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Create New Task Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full px-8" variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Create new task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="task-title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="task-time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., 09:00 - 10:00"
                  />
                </div>
              </div>
              <Button onClick={addTask}>Add Task</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
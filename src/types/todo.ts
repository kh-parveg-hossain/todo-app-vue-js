export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TodoFilter {
  status: 'all' | 'active' | 'completed'
  category: string
  priority: 'all' | 'low' | 'medium' | 'high'
  search: string
}

export interface TodoStats {
  total: number
  completed: number
  active: number
  overdue: number
  completionRate: number
  categories: { [key: string]: number }
  priorities: { low: number; medium: number; high: number }
}
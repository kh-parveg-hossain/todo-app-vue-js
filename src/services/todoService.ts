import type { Todo, TodoFilter, TodoStats } from '../types/todo'

export const todoService = {
  createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    return {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...todoData
    }
  },

  filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
    return todos.filter(todo => {
      // Status filter
      if (filter.status === 'active' && todo.completed) return false
      if (filter.status === 'completed' && !todo.completed) return false

      // Category filter
      if (filter.category !== 'all' && todo.category !== filter.category) return false

      // Priority filter
      if (filter.priority !== 'all' && todo.priority !== filter.priority) return false

      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const titleMatch = todo.title.toLowerCase().includes(searchLower)
        const descMatch = todo.description?.toLowerCase().includes(searchLower) || false
        if (!titleMatch && !descMatch) return false
      }

      return true
    })
  },

  getStats(todos: Todo[]): TodoStats {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const active = total - completed
    const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < new Date()).length
    
    const categories: { [key: string]: number } = {}
    const priorities = { low: 0, medium: 0, high: 0 }

    todos.forEach(todo => {
      // Categories
      categories[todo.category] = (categories[todo.category] || 0) + 1
      
      // Priorities
      priorities[todo.priority]++
    })

    return {
      total,
      completed,
      active,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      categories,
      priorities
    }
  },

  getDefaultCategories(): string[] {
    return ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Other']
  }
}
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import TodoStats from './components/TodoStats.vue'
import TodoFilters from './components/TodoFilters.vue'
import { todoService } from './services/todoService'
import type { Todo, TodoFilter } from './types/todo'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const todos = ref<Todo[]>([])
const filter = ref<TodoFilter>({
  status: 'all',
  category: 'all',
  priority: 'all',
  search: ''
})

const filteredTodos = computed(() => {
  return todoService.filterTodos(todos.value, filter.value)
})

const stats = computed(() => {
  return todoService.getStats(todos.value)
})

const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newTodo = todoService.createTodo(todoData)
  todos.value.unshift(newTodo)
  saveTodos()
}

const updateTodo = (id: string, updates: Partial<Todo>) => {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index !== -1) {
    todos.value[index] = { ...todos.value[index], ...updates, updatedAt: new Date() }
    saveTodos()
  }
}

const deleteTodo = (id: string) => {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index !== -1) {
    todos.value.splice(index, 1)
    saveTodos()
  }
}

const toggleComplete = (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    updateTodo(id, { completed: !todo.completed })
  }
}

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos.value))
}

const loadTodos = () => {
  const saved = localStorage.getItem('todos')
  if (saved) {
    todos.value = JSON.parse(saved).map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt)
    }))
  }
}

onMounted(() => {
  loadTodos()
})
</script>

<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen transition-colors duration-300">
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <!-- Header -->
      <header class="sticky top-0 z-50 glassmorphism border-b border-white/20 dark:border-gray-700/50">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  TodoFlow
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">Stay organized, get things done</p>
              </div>
            </div>
            
            <button
              @click="toggleDark()"
              class="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            >
              <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column: Form and Stats -->
          <div class="lg:col-span-1 space-y-6">
            <TodoForm @add-todo="addTodo" />
            <TodoStats :stats="stats" />
          </div>

          <!-- Right Column: Filters and Todo List -->
          <div class="lg:col-span-2 space-y-6">
            <TodoFilters v-model="filter" />
            <TodoList 
              :todos="filteredTodos"
              @update-todo="updateTodo"
              @delete-todo="deleteTodo"
              @toggle-complete="toggleComplete"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
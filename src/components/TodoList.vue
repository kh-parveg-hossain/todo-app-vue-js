<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  updateTodo: [id: string, updates: Partial<Todo>]
  deleteTodo: [id: string]
  toggleComplete: [id: string]
}>()

const sortedTodos = computed(() => {
  return [...props.todos].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Then by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    // Finally by creation date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime()
  })
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
        <span class="flex items-center">
          <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Tasks
        </span>
        <span class="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full">
          {{ todos.length }} {{ todos.length === 1 ? 'task' : 'tasks' }}
        </span>
      </h3>

      <div v-if="sortedTodos.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h4>
        <p class="text-gray-500 dark:text-gray-400">Create your first task or adjust your filters to see tasks here.</p>
      </div>

      <div v-else class="space-y-3">
        <TransitionGroup name="task" tag="div" class="space-y-3">
          <TodoItem
            v-for="todo in sortedTodos"
            :key="todo.id"
            :todo="todo"
            @update-todo="(updates) => emit('updateTodo', todo.id, updates)"
            @delete-todo="() => emit('deleteTodo', todo.id)"
            @toggle-complete="() => emit('toggleComplete', todo.id)"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
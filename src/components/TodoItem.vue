<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  updateTodo: [updates: Partial<Todo>]
  deleteTodo: []
  toggleComplete: []
}>()

const isEditing = ref(false)
const editForm = ref({
  title: props.todo.title,
  description: props.todo.description || '',
  priority: props.todo.priority,
  category: props.todo.category,
  dueDate: props.todo.dueDate ? props.todo.dueDate.toISOString().split('T')[0] : ''
})

const isOverdue = computed(() => {
  return !props.todo.completed && props.todo.dueDate && props.todo.dueDate < new Date()
})

const priorityColor = computed(() => {
  switch (props.todo.priority) {
    case 'high': return 'text-error-500 bg-error-50 dark:bg-error-900/30'
    case 'medium': return 'text-warning-500 bg-warning-50 dark:bg-warning-900/30'
    case 'low': return 'text-success-500 bg-success-50 dark:bg-success-900/30'
    default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/30'
  }
})

const priorityEmoji = computed(() => {
  switch (props.todo.priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const startEdit = () => {
  editForm.value = {
    title: props.todo.title,
    description: props.todo.description || '',
    priority: props.todo.priority,
    category: props.todo.category,
    dueDate: props.todo.dueDate ? props.todo.dueDate.toISOString().split('T')[0] : ''
  }
  isEditing.value = true
}

const saveEdit = () => {
  if (!editForm.value.title.trim()) return

  emit('updateTodo', {
    title: editForm.value.title.trim(),
    description: editForm.value.description.trim() || undefined,
    priority: editForm.value.priority,
    category: editForm.value.category,
    dueDate: editForm.value.dueDate ? new Date(editForm.value.dueDate) : undefined
  })
  
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}
</script>

<template>
  <div
    :class="[
      'group relative bg-gray-50 dark:bg-gray-700/50 rounded-xl border transition-all duration-200 hover:shadow-lg',
      todo.completed 
        ? 'border-success-200 dark:border-success-800/50 bg-success-50/50 dark:bg-success-900/20' 
        : isOverdue
          ? 'border-error-200 dark:border-error-800/50 bg-error-50/50 dark:bg-error-900/20'
          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
    ]"
  >
    <div v-if="!isEditing" class="p-4 flex items-start space-x-4">
      <!-- Checkbox -->
      <button
        @click="emit('toggleComplete')"
        :class="[
          'flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 transition-all duration-200',
          todo.completed
            ? 'bg-success-500 border-success-500 text-white'
            : 'border-gray-300 dark:border-gray-500 hover:border-primary-400'
        ]"
      >
        <svg v-if="todo.completed" class="w-3 h-3 mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 :class="[
              'font-medium text-gray-900 dark:text-white',
              todo.completed && 'line-through text-gray-500 dark:text-gray-400'
            ]">
              {{ todo.title }}
            </h4>
            
            <p v-if="todo.description" :class="[
              'mt-1 text-sm text-gray-600 dark:text-gray-400',
              todo.completed && 'line-through'
            ]">
              {{ todo.description }}
            </p>

            <div class="flex items-center space-x-3 mt-3">
              <!-- Priority -->
              <span :class="['inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', priorityColor]">
                {{ priorityEmoji }} {{ todo.priority }}
              </span>

              <!-- Category -->
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                {{ todo.category }}
              </span>

              <!-- Due Date -->
              <span v-if="todo.dueDate" :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                isOverdue 
                  ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              ]">
                📅 {{ formatDate(todo.dueDate) }}
                <span v-if="isOverdue" class="ml-1">⚠️</span>
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              @click="startEdit"
              class="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
              title="Edit task"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            
            <button
              @click="emit('deleteTodo')"
              class="p-2 text-gray-400 hover:text-error-500 transition-colors duration-200"
              title="Delete task"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="p-4 space-y-4">
      <input
        v-model="editForm.title"
        type="text"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Task title"
        required
      />

      <textarea
        v-model="editForm.description"
        rows="2"
        class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        placeholder="Description (optional)"
      ></textarea>

      <div class="grid grid-cols-2 gap-3">
        <select
          v-model="editForm.priority"
          class="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        <input
          v-model="editForm.dueDate"
          type="date"
          class="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div class="flex space-x-2">
        <button
          @click="saveEdit"
          class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Save
        </button>
        <button
          @click="cancelEdit"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
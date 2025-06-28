<script setup lang="ts">
import { ref, reactive } from 'vue'
import { todoService } from '../services/todoService'
import type { Todo } from '../types/todo'

const emit = defineEmits<{
  addTodo: [todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const form = reactive({
  title: '',
  description: '',
  priority: 'medium' as Todo['priority'],
  category: 'Personal',
  dueDate: ''
})

const isExpanded = ref(false)
const categories = todoService.getDefaultCategories()

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.category = 'Personal'
  form.dueDate = ''
  isExpanded.value = false
}

const submitTodo = () => {
  if (!form.title.trim()) return

  const todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    completed: false,
    priority: form.priority,
    category: form.category,
    dueDate: form.dueDate ? new Date(form.dueDate) : undefined
  }

  emit('addTodo', todoData)
  resetForm()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    submitTodo()
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add New Task
      </h2>

      <form @submit.prevent="submitTodo" class="space-y-4">
        <!-- Title Input -->
        <div>
          <input
            v-model="form.title"
            @keydown="handleKeyDown"
            @focus="isExpanded = true"
            type="text"
            placeholder="What needs to be done?"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <!-- Expanded Form -->
        <div v-if="isExpanded" class="space-y-4 animate-slide-up">
          <!-- Description -->
          <div>
            <textarea
              v-model="form.description"
              placeholder="Add a description (optional)"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <!-- Priority and Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select
                v-model="form.priority"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
            <input
              v-model="form.dueDate"
              type="date"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-2">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Add Task
            </button>
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
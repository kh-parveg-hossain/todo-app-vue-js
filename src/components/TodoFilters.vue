<script setup lang="ts">
import { computed } from 'vue'
import type { TodoFilter } from '../types/todo'
import { todoService } from '../services/todoService'

const props = defineProps<{
  modelValue: TodoFilter
}>()

const emit = defineEmits<{
  'update:modelValue': [filter: TodoFilter]
}>()

const filter = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const categories = todoService.getDefaultCategories()

const updateFilter = (key: keyof TodoFilter, value: any) => {
  filter.value = { ...filter.value, [key]: value }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
        </svg>
        Filters
      </h3>

      <div class="space-y-4">
        <!-- Search -->
        <div>
          <input
            :value="filter.search"
            @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Search tasks..."
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <div class="flex space-x-2">
            <button
              v-for="status in [
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' }
              ]"
              :key="status.key"
              @click="updateFilter('status', status.key)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                filter.status === status.key
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            :value="filter.category"
            @change="updateFilter('category', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="priority in [
                { key: 'all', label: 'All', emoji: '⚪' },
                { key: 'high', label: 'High', emoji: '🔴' },
                { key: 'medium', label: 'Medium', emoji: '🟡' },
                { key: 'low', label: 'Low', emoji: '🟢' }
              ]"
              :key="priority.key"
              @click="updateFilter('priority', priority.key)"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1',
                filter.priority === priority.key
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              <span>{{ priority.emoji }}</span>
              <span>{{ priority.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
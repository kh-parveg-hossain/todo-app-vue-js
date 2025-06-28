<script setup lang="ts">
import { computed } from 'vue'
import type { TodoStats } from '../types/todo'

const props = defineProps<{
  stats: TodoStats
}>()

const progressWidth = computed(() => `${props.stats.completionRate}%`)

const topCategories = computed(() => {
  return Object.entries(props.stats.categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        Statistics
      </h3>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.completionRate }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-success-400 to-success-500 transition-all duration-500 ease-out"
            :style="{ width: progressWidth }"
          ></div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.total }}</div>
          <div class="text-sm text-blue-600/80 dark:text-blue-400/80">Total Tasks</div>
        </div>
        
        <div class="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-xl p-4">
          <div class="text-2xl font-bold text-success-600 dark:text-success-400">{{ stats.completed }}</div>
          <div class="text-sm text-success-600/80 dark:text-success-400/80">Completed</div>
        </div>
        
        <div class="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30 rounded-xl p-4">
          <div class="text-2xl font-bold text-warning-600 dark:text-warning-400">{{ stats.active }}</div>
          <div class="text-sm text-warning-600/80 dark:text-warning-400/80">Active</div>
        </div>
        
        <div class="bg-gradient-to-br from-error-50 to-error-100 dark:from-error-900/30 dark:to-error-800/30 rounded-xl p-4">
          <div class="text-2xl font-bold text-error-600 dark:text-error-400">{{ stats.overdue }}</div>
          <div class="text-sm text-error-600/80 dark:text-error-400/80">Overdue</div>
        </div>
      </div>

      <!-- Priority Distribution -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Priority Distribution</h4>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span class="w-2 h-2 bg-error-500 rounded-full mr-2"></span>High
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.priorities.high }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span class="w-2 h-2 bg-warning-500 rounded-full mr-2"></span>Medium
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.priorities.medium }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span class="w-2 h-2 bg-success-500 rounded-full mr-2"></span>Low
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.priorities.low }}</span>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div v-if="topCategories.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Categories</h4>
        <div class="space-y-2">
          <div 
            v-for="([category, count], index) in topCategories" 
            :key="category"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span 
                class="w-2 h-2 rounded-full mr-2"
                :class="{
                  'bg-primary-500': index === 0,
                  'bg-purple-500': index === 1,
                  'bg-indigo-500': index === 2
                }"
              ></span>
              {{ category }}
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
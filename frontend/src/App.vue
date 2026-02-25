<template>
  <div class="container">
    <header class="header">
      <h1>🔍 小黄聚合搜索</h1>
      <p>发现优质内容，汇聚智慧资源</p>
    </header>

    <div class="search-box">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="搜索 GitHub、文章、视频、商品..."
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch" :disabled="loading">
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>

    <div class="hot-keywords">
      <h3>🔥 热门搜索</h3>
      <div class="hot-tags">
        <span
          v-for="keyword in hotKeywords"
          :key="keyword"
          class="hot-tag"
          @click="searchKeyword(keyword)"
        >
          {{ keyword }}
        </span>
      </div>
    </div>

    <div v-if="results.length > 0" class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: activeFilter === tab.value }"
        @click="activeFilter = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="results-container">
      <div v-if="loading" class="loading">
        正在搜索中，请稍候...
      </div>

      <div v-else-if="noResults" class="no-results">
        <h3>未找到相关结果</h3>
        <p>试试其他关键词吧</p>
      </div>

      <div v-else-if="filteredResults.length > 0">
        <div class="results-info">
          共找到 {{ filteredResults.length }} 条结果
        </div>
        <div class="results-list">
          <div v-for="result in filteredResults" :key="result.id" class="result-card">
            <a :href="result.url" target="_blank" rel="noopener noreferrer">
              <h3 class="result-title">{{ result.title }}</h3>
              <p class="result-snippet">{{ result.snippet }}</p>
              <div class="result-meta">
                <span class="meta-item">{{ getSourceIcon(result.source) }} {{ result.source }}</span>
                <span class="meta-badge">{{ getTypeLabel(result.type) }}</span>
                <template v-if="result.type === 'github'">
                  <span class="meta-item">⭐ {{ formatNumber(result.stars) }}</span>
                  <span class="meta-item">🍴 {{ formatNumber(result.forks) }}</span>
                  <span class="meta-badge">{{ result.language }}</span>
                </template>
                <template v-else-if="result.type === 'article'">
                  <span class="meta-item">👁️ {{ formatNumber(result.views) }}</span>
                  <span class="meta-item">❤️ {{ formatNumber(result.likes) }}</span>
                </template>
                <template v-else-if="result.type === 'video'">
                  <span class="meta-item">⏱️ {{ result.duration }}</span>
                  <span class="meta-item">👁️ {{ result.views }}</span>
                </template>
                <template v-else-if="result.type === 'product'">
                  <span class="meta-item">💰 {{ result.price }}</span>
                  <span class="meta-item">🛒 {{ result.sales }}</span>
                </template>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const query = ref('')
const results = ref([])
const loading = ref(false)
const activeFilter = ref('all')
const hotKeywords = ref([])

const filterTabs = [
  { label: '全部', value: 'all' },
  { label: 'GitHub', value: 'github' },
  { label: '文章', value: 'article' },
  { label: '视频', value: 'video' },
  { label: '商品', value: 'product' }
]

const noResults = computed(() => {
  return !loading.value && results.value.length === 0 && query.value !== ''
})

const filteredResults = computed(() => {
  if (activeFilter.value === 'all') {
    return results.value
  }
  return results.value.filter(result => result.type === activeFilter.value)
})

const getSourceIcon = (source) => {
  const icons = {
    'GitHub': '🐙',
    '掘金': '📝',
    '知乎': '💡',
    'CSDN': '📚',
    'B站': '📺',
    'YouTube': '🎬',
    '慕课网': '🎓',
    '淘宝': '🛍️',
    '极客时间': '⏰',
    '京东': '🏪'
  }
  return icons[source] || '📄'
}

const getTypeLabel = (type) => {
  const labels = {
    'github': '仓库',
    'article': '文章',
    'video': '视频',
    'product': '商品'
  }
  return labels[type] || type
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num?.toString() || '0'
}

const handleSearch = async () => {
  if (!query.value.trim()) {
    return
  }

  loading.value = true
  results.value = []

  try {
    const response = await axios.get('/api/search', {
      params: {
        q: query.value,
        type: 'all'
      }
    })
    results.value = response.data.results
  } catch (error) {
    console.error('搜索失败:', error)
    alert('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const searchKeyword = (keyword) => {
  query.value = keyword
  handleSearch()
}

const fetchHotKeywords = async () => {
  try {
    const response = await axios.get('/api/hot')
    hotKeywords.value = response.data.hotKeywords
  } catch (error) {
    console.error('获取热门搜索失败:', error)
  }
}

onMounted(() => {
  fetchHotKeywords()
})
</script>

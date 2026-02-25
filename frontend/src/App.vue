<template>
  <div class="container">
    <header class="header">
      <h1>📁 小黄文件处理助手</h1>
      <p>轻松上传、管理和下载您的文件</p>
    </header>

    <div class="upload-section">
      <div 
        class="upload-area"
        :class="{ 'drag-over': isDragOver }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          @change="handleFileSelect"
          style="display: none"
        />
        <div class="upload-icon">📤</div>
        <p class="upload-text">
          {{ uploading ? '正在上传...' : '点击或拖拽文件到此处上传' }}
        </p>
        <p class="upload-hint">支持任意格式的文件</p>
      </div>
    </div>

    <div class="files-section">
      <div class="section-header">
        <h2>📋 文件列表</h2>
        <span class="file-count">共 {{ files.length }} 个文件</span>
      </div>

      <div v-if="loading" class="loading">
        加载中...
      </div>

      <div v-else-if="files.length > 0" class="files-grid">
        <div v-for="file in files" :key="file.id" class="file-card">
          <div class="file-icon">
            {{ getFileIcon(file.name) }}
          </div>
          <div class="file-info">
            <h3 class="file-name" :title="file.name">{{ file.name }}</h3>
            <p class="file-meta">
              <span>📦 {{ file.sizeFormatted }}</span>
              <span>🕐 {{ file.uploadDateFormatted }}</span>
            </p>
          </div>
          <div class="file-actions">
            <button @click="downloadFile(file)" class="action-btn download-btn">
              📥 下载
            </button>
            <button @click="deleteFile(file)" class="action-btn delete-btn" :disabled="deleting">
              🗑️ 删除
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-files">
        <div class="no-files-icon">📭</div>
        <h3>暂无文件</h3>
        <p>上传一些文件开始使用吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const fileInput = ref(null)
const files = ref([])
const loading = ref(false)
const uploading = ref(false)
const deleting = ref(false)
const isDragOver = ref(false)

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📽️',
    pptx: '📽️',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    mp3: '🎵',
    wav: '🎵',
    mp4: '🎬',
    avi: '🎬',
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    txt: '📃',
    js: '💻',
    html: '💻',
    css: '💻',
    py: '💻',
    json: '🔧'
  }
  return icons[ext] || '📁'
}

const triggerFileInput = () => {
  if (!uploading) {
    fileInput.value.click()
  }
}

const handleFileSelect = async (e) => {
  const file = e.target.files[0]
  if (file) {
    await uploadFile(file)
  }
  e.target.value = ''
}

const handleDrop = async (e) => {
  isDragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file) {
    await uploadFile(file)
  }
}

const uploadFile = async (file) => {
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    await fetchFiles()
  } catch (error) {
    console.error('上传失败:', error)
    alert('文件上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

const fetchFiles = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/files')
    files.value = response.data.files
  } catch (error) {
    console.error('获取文件列表失败:', error)
  } finally {
    loading.value = false
  }
}

const downloadFile = (file) => {
  window.open(`/api/download/${file.filename}`, '_blank')
}

const deleteFile = async (file) => {
  if (!confirm(`确定要删除文件 "${file.name}" 吗？`)) {
    return
  }

  deleting.value = true
  try {
    await axios.delete(`/api/files/${file.filename}`)
    await fetchFiles()
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchFiles()
})
</script>

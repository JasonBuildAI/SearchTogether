const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFiles() {
  if (!fs.existsSync(UPLOAD_DIR)) return [];
  
  const files = fs.readdirSync(UPLOAD_DIR);
  return files.map(filename => {
    const filePath = path.join(UPLOAD_DIR, filename);
    const stats = fs.statSync(filePath);
    return {
      id: filename,
      name: filename.substring(filename.indexOf('-') + 1),
      filename: filename,
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size),
      uploadDate: stats.birthtime,
      uploadDateFormatted: new Date(stats.birthtime).toLocaleString('zh-CN')
    };
  }).sort((a, b) => b.uploadDate - a.uploadDate);
}

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择要上传的文件' });
  }
  res.json({
    message: '文件上传成功',
    file: {
      id: req.file.filename,
      name: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      sizeFormatted: formatFileSize(req.file.size)
    }
  });
});

app.get('/api/files', (req, res) => {
  const files = getFiles();
  res.json({ files, total: files.length });
});

app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  fs.unlinkSync(filePath);
  res.json({ message: '文件删除成功' });
});

app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  const originalName = filename.substring(filename.indexOf('-') + 1);
  res.download(filePath, originalName);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '小黄文件处理助手服务正常运行' });
});

app.listen(PORT, () => {
  console.log('🚀 小黄文件处理助手后端服务已启动: http://localhost:' + PORT);
  console.log('📚 API 文档:');
  console.log('   - 健康检查: http://localhost:' + PORT + '/api/health');
  console.log('   - 上传文件: POST http://localhost:' + PORT + '/api/upload');
  console.log('   - 文件列表: GET http://localhost:' + PORT + '/api/files');
  console.log('   - 下载文件: GET http://localhost:' + PORT + '/api/download/:filename');
  console.log('   - 删除文件: DELETE http://localhost:' + PORT + '/api/files/:filename');
  console.log('📁 上传目录:', UPLOAD_DIR);
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const hotKeywords = [
  'JavaScript',
  'Vue',
  'React',
  'Node.js',
  'TypeScript',
  '算法',
  '系统设计',
  'Python',
  'Java'
];

async function searchGitHub(query) {
  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: query,
        per_page: 5,
        sort: 'stars'
      }
    });

    return response.data.items.map(item => ({
      id: item.id,
      title: item.full_name,
      url: item.html_url,
      source: 'GitHub',
      type: 'github',
      snippet: item.description || '暂无描述',
      stars: item.stargazers_count,
      forks: item.forks_count,
      language: item.language || '未知'
    }));
  } catch (error) {
    console.error('GitHub搜索失败:', error.message);
    return [];
  }
}

function searchArticles(query) {
  return [
    {
      id: 'article-1',
      title: `${query}入门教程 - 从零开始学习`,
      url: 'https://example.com/article/1',
      source: '掘金',
      type: 'article',
      snippet: '这是一篇关于' + query + '的入门教程，适合初学者阅读，内容涵盖基础概念、核心特性和实战应用。',
      views: 12580,
      likes: 856
    },
    {
      id: 'article-2',
      title: `深入理解${query}的原理与实践`,
      url: 'https://example.com/article/2',
      source: '知乎',
      type: 'article',
      snippet: '本文深入探讨' + query + '的实现原理，从底层机制到上层应用，帮助你全面掌握相关知识。',
      views: 8920,
      likes: 523
    },
    {
      id: 'article-3',
      title: `${query}最佳实践：从开发到部署`,
      url: 'https://example.com/article/3',
      source: 'CSDN',
      type: 'article',
      snippet: '总结' + query + '在实际项目中的最佳实践经验，包括性能优化、安全加固和部署流程。',
      views: 15670,
      likes: 1024
    }
  ];
}

function searchVideos(query) {
  return [
    {
      id: 'video-1',
      title: `${query}从入门到精通 - 完整教程`,
      url: 'https://example.com/video/1',
      source: 'B站',
      type: 'video',
      snippet: '本系列教程带你从零开始学习' + query + '，包含大量实战案例和项目演示。',
      duration: '2小时35分钟',
      views: '52.8万'
    },
    {
      id: 'video-2',
      title: `${query}核心概念详解`,
      url: 'https://example.com/video/2',
      source: 'YouTube',
      type: 'video',
      snippet: '深入讲解' + query + '的核心概念和设计思想，帮助你建立完整的知识体系。',
      duration: '45分钟',
      views: '18.5万'
    },
    {
      id: 'video-3',
      title: `项目实战：用${query}构建一个完整应用`,
      url: 'https://example.com/video/3',
      source: '慕课网',
      type: 'video',
      snippet: '通过实际项目学习' + query + '，从需求分析到代码实现，全程干货！',
      duration: '3小时12分钟',
      views: '36.2万'
    }
  ];
}

function searchProducts(query) {
  return [
    {
      id: 'product-1',
      title: `${query}实战开发指南 - 最新版`,
      url: 'https://example.com/product/1',
      source: '淘宝',
      type: 'product',
      snippet: '图文并茂，深入浅出，适合各个层次的开发者阅读和学习。',
      price: '¥89.00',
      sales: '1258件'
    },
    {
      id: 'product-2',
      title: `${query}在线课程 - 终身学习`,
      url: 'https://example.com/product/2',
      source: '极客时间',
      type: 'product',
      snippet: '由一线专家授课，包含视频讲解、代码示例和课后答疑。',
      price: '¥199.00',
      sales: '3256人学习'
    },
    {
      id: 'product-3',
      title: `${query}开发工具套装`,
      url: 'https://example.com/product/3',
      source: '京东',
      type: 'product',
      snippet: '包含正版授权、技术支持和完整文档，提升开发效率。',
      price: '¥299.00',
      sales: '856套'
    }
  ];
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '小黄聚合搜索服务正常运行' });
});

app.get('/api/search', async (req, res) => {
  const { q, type = 'all' } = req.query;

  if (!q) {
    return res.status(400).json({ error: '请提供搜索关键词' });
  }

  let results = [];

  try {
    if (type === 'all' || type === 'github') {
      const githubResults = await searchGitHub(q);
      results = results.concat(githubResults);
    }

    if (type === 'all' || type === 'article') {
      const articleResults = searchArticles(q);
      results = results.concat(articleResults);
    }

    if (type === 'all' || type === 'video') {
      const videoResults = searchVideos(q);
      results = results.concat(videoResults);
    }

    if (type === 'all' || type === 'product') {
      const productResults = searchProducts(q);
      results = results.concat(productResults);
    }

    res.json({
      query: q,
      total: results.length,
      results
    });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({ error: '搜索失败，请稍后重试' });
  }
});

app.get('/api/hot', (req, res) => {
  res.json({ hotKeywords });
});

app.listen(PORT, () => {
  console.log('🚀 小黄聚合搜索后端服务已启动: http://localhost:' + PORT);
  console.log('📚 API 文档:');
  console.log('   - 健康检查: http://localhost:' + PORT + '/api/health');
  console.log('   - 搜索接口: http://localhost:' + PORT + '/api/search?q=关键词');
  console.log('   - 热门搜索: http://localhost:' + PORT + '/api/hot');
});

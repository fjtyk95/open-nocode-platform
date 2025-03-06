const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');
const workflowRoutes = require('./routes/workflows');
const submissionRoutes = require('./routes/submissions');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア設定
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 認証ミドルウェア
const authMiddleware = require('./middleware/auth');

// ルート設定
app.use('/api/auth', authRoutes);
app.use('/api/forms', authMiddleware, formRoutes);
app.use('/api/workflows', authMiddleware, workflowRoutes);
app.use('/api/submissions', authMiddleware, submissionRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// データベース接続とサーバー起動
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
  });
}); 
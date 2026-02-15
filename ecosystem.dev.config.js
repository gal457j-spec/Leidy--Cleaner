// PM2 Ecosystem Config - Run all services with: pm2 start ecosystem.dev.config.js

module.exports = {
  apps: [
    {
      // ========== BACKEND ==========
      name: 'avan-backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      ignore_watch: ['backend_data', 'node_modules'],
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    
    {
      // ========== FRONTEND ==========
      name: 'avan-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      ignore_watch: ['.next', 'node_modules'],
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],
  
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:lesa24k/avan-o.git',
      path: '/var/www/avan-o',
      'post-deploy': 'npm install && npm run build'
    }
  }
};

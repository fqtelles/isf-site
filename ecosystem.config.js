module.exports = {
  apps: [
    {
      name: 'isf-site',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/isf-site',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/isf-site-error.log',
      out_file: '/var/log/pm2/isf-site-out.log',
    },
  ],
}

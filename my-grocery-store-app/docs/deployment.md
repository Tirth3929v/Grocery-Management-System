# Deployment Guide

This document provides comprehensive instructions for deploying the Grocery Store App to various environments, including development, staging, and production.

## Prerequisites

### System Requirements
- **Node.js**: Version 16.x or higher
- **MongoDB**: Version 4.4 or higher
- **Nginx**: For production web server (optional)
- **SSL Certificate**: For HTTPS in production
- **Domain Name**: For production deployment

### Environment Setup
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install mongodb

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (optional)
sudo apt-get install nginx
```

## Development Deployment

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/grocery-store-app.git
cd grocery-store-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

# Start MongoDB
sudo systemctl start mongodb

# Seed the database
npm run seed

# Start the development server
npm run dev
```

### Development Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store-dev
SESSION_SECRET=your-development-secret-key
FRONTEND_URL=http://localhost:3000
UPLOAD_PATH=./uploads
```

## Staging Deployment

### Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### Application Deployment
```bash
# Create application directory
sudo mkdir -p /var/www/grocery-store-staging
sudo chown -R $USER:$USER /var/www/grocery-store-staging

# Clone repository
cd /var/www/grocery-store-staging
git clone https://github.com/yourusername/grocery-store-app.git .
git checkout staging

# Install dependencies
npm ci --production=false

# Create environment file
cp .env.example .env.staging
# Configure staging environment variables
```

### Process Management with PM2
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'grocery-store-staging',
    script: 'backend/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'staging',
      PORT: 5001,
      MONGODB_URI: 'mongodb://localhost:27017/grocery-store-staging'
    }
  }]
};
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js --env staging
pm2 save
pm2 startup
```

### Nginx Configuration for Staging
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/grocery-store-staging
```

```nginx
server {
    listen 80;
    server_name staging.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/grocery-store-staging/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/grocery-store-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Production Deployment

### Production Server Setup
```bash
# Security hardening
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Install fail2ban for SSH protection
sudo apt install fail2ban

# Configure SSH
sudo nano /etc/ssh/sshd_config
# Change default port, disable root login, use key authentication

# Set up firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### SSL Certificate Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Production Database Setup
```bash
# Create production database
mongo
use grocery-store-prod
db.createUser({
  user: 'groceryuser',
  pwd: 'securepassword',
  roles: ['readWrite']
})
exit

# Secure MongoDB
sudo nano /etc/mongod.conf
# Enable authentication, bind to localhost

sudo systemctl restart mongod
```

### Production Application Deployment
```bash
# Create production directory
sudo mkdir -p /var/www/grocery-store
sudo chown -R $USER:$USER /var/www/grocery-store

# Deploy application
cd /var/www/grocery-store
git clone https://github.com/yourusername/grocery-store-app.git .
git checkout main

# Install production dependencies
npm ci --production

# Configure production environment
cp .env.example .env.production
# Set production environment variables
```

### Production PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'grocery-store-prod',
    script: 'backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb://groceryuser:securepassword@localhost:27017/grocery-store-prod'
    },
    error_file: '/var/log/pm2/grocery-store-error.log',
    out_file: '/var/log/pm2/grocery-store-out.log',
    log_file: '/var/log/pm2/grocery-store.log'
  }]
};
```

### Production Nginx Configuration
```nginx
# /etc/nginx/sites-available/grocery-store
upstream grocery_app {
    server localhost:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://grocery_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /uploads {
        alias /var/www/grocery-store/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /api {
        proxy_pass http://grocery_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Environment Variables

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://groceryuser:securepassword@localhost:27017/grocery-store-prod
SESSION_SECRET=your-very-secure-production-secret-key
FRONTEND_URL=https://yourdomain.com
UPLOAD_PATH=/var/www/grocery-store/uploads
CORS_ORIGIN=https://yourdomain.com
```

## Deployment Automation

### CI/CD Pipeline Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_KEY }}
        script: |
          cd /var/www/grocery-store
          git pull origin main
          npm ci --production
          pm2 restart ecosystem.config.js --env production
```

### Automated Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-grocery-store.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/grocery-store"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mongodump --db grocery-store-prod --out $BACKUP_DIR/mongodb_$DATE

# Application files backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www grocery-store

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR s3://your-backup-bucket/ --recursive

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "mongodb_*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable and schedule
sudo chmod +x /usr/local/bin/backup-grocery-store.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-grocery-store.sh
```

## Monitoring and Maintenance

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Checks
```bash
# Create health check endpoint
curl https://yourdomain.com/api/health

# Monitor with uptime monitoring service
# Example: UptimeRobot, Pingdom, or New Relic
```

### Performance Monitoring
```bash
# Enable PM2 metrics
pm2 install pm2-server-monit

# Monitor with APM tools
# Example: New Relic, DataDog, or AppDynamics
```

## Troubleshooting

### Common Deployment Issues

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>

# Or change port in environment
PORT=5001
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongo --eval "db.stats()"

# Reset MongoDB
sudo systemctl restart mongod
```

#### Permission Issues
```bash
# Fix upload directory permissions
sudo chown -R www-data:www-data /var/www/grocery-store/uploads
sudo chmod -R 755 /var/www/grocery-store/uploads
```

#### SSL Certificate Renewal
```bash
# Manual renewal
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## Scaling Considerations

### Horizontal Scaling
```javascript
// PM2 cluster mode for multiple cores
module.exports = {
  apps: [{
    name: 'grocery-store-prod',
    script: 'backend/server.js',
    instances: 0, // Use all available cores
    exec_mode: 'cluster',
    // ... other config
  }]
};
```

### Database Scaling
- Implement read replicas for read-heavy operations
- Use sharding for large datasets
- Implement connection pooling

### CDN Integration
- Use CloudFront, Cloudflare, or similar for static assets
- Implement image optimization and WebP conversion

## Security Checklist

### Pre-deployment
- [ ] Remove debug logging
- [ ] Disable development routes
- [ ] Update dependencies
- [ ] Run security audit: `npm audit`

### Server Security
- [ ] Configure firewall properly
- [ ] Disable root SSH login
- [ ] Set up fail2ban
- [ ] Enable automatic updates
- [ ] Configure log rotation

### Application Security
- [ ] Set strong session secrets
- [ ] Configure HTTPS only
- [ ] Set secure headers
- [ ] Implement rate limiting
- [ ] Regular security updates

This deployment guide ensures reliable, secure, and scalable operation of the Grocery Store App across all environments.

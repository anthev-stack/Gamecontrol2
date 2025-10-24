# Pterodactyl Panel Deployment Guide

This guide will help you deploy your customized Pterodactyl Panel to your VM.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Server Setup](#initial-server-setup)
3. [Installing Dependencies](#installing-dependencies)
4. [Installing Pterodactyl Panel](#installing-pterodactyl-panel)
5. [Automated Deployment from GitHub](#automated-deployment-from-github)
6. [Installing Wings (Game Server Daemon)](#installing-wings)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### VM Requirements
- **OS**: Ubuntu 20.04 LTS or 22.04 LTS (recommended)
- **RAM**: Minimum 2GB (4GB+ recommended)
- **Disk**: 20GB+ available space
- **Root/sudo access**

### External Requirements
- Domain name pointing to your VM IP address
- GitHub account with SSH key or personal access token

---

## Initial Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Create Swap (if needed)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 3. Configure Firewall
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8080/tcp  # Wings
sudo ufw allow 2022/tcp  # Wings SFTP
sudo ufw enable
```

---

## Installing Dependencies

### 1. Install Required Packages
```bash
# Add PHP repository
sudo apt install -y software-properties-common curl apt-transport-https ca-certificates gnupg
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install dependencies
sudo apt install -y php8.1 php8.1-{cli,gd,mysql,pdo,mbstring,tokenizer,bcmath,xml,fpm,curl,zip} \
    nginx tar unzip git redis-server mariadb-server
```

### 2. Install Composer
```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### 3. Install Node.js and Yarn
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g yarn
```

---

## Installing Pterodactyl Panel

### 1. Create Directory and Clone Repository
```bash
# Create directory
sudo mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl

# Clone your customized version
sudo git clone https://github.com/anthev-stack/Gamecontrol2.git .
```

### 2. Install Dependencies
```bash
# Install composer dependencies
sudo composer install --no-dev --optimize-autoloader

# Install node dependencies and build assets
yarn install
yarn build:production
```

### 3. Setup Database
```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p << EOF
CREATE DATABASE panel;
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
EOF
```

### 4. Configure Environment
```bash
# Copy environment file
sudo cp .env.example .env

# Generate application key
sudo php artisan key:generate --force

# Configure database (edit the .env file)
sudo nano .env
```

Update these values in `.env`:
```env
APP_URL=https://yourdomain.com
APP_TIMEZONE=America/New_York

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=panel
DB_USERNAME=pterodactyl
DB_PASSWORD=yourpassword

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 5. Database Setup
```bash
# Run migrations
sudo php artisan migrate --seed --force

# Create first admin user
sudo php artisan p:user:make
```

### 6. Set Permissions
```bash
sudo chown -R www-data:www-data /var/www/pterodactyl/*
sudo chmod -R 755 /var/www/pterodactyl/storage/* /var/www/pterodactyl/bootstrap/cache/
```

### 7. Configure Cron
```bash
sudo crontab -e
```

Add this line:
```
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

### 8. Configure Queue Worker
```bash
# Create systemd service
sudo nano /etc/systemd/system/pteroq.service
```

Paste this content:
```ini
[Unit]
Description=Pterodactyl Queue Worker
After=redis-server.service

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable --now pteroq.service
```

### 9. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/pterodactyl.conf
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/pterodactyl/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf
sudo systemctl restart nginx
```

### 10. Install SSL Certificate (Optional but Recommended)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

---

## Automated Deployment from GitHub

Once your panel is set up, you can use the deployment script for updates:

### 1. Make Script Executable
```bash
sudo chmod +x /var/www/pterodactyl/deploy.sh
```

### 2. Deploy Updates
```bash
cd /var/www/pterodactyl
sudo ./deploy.sh
```

### 3. Set Up GitHub Actions (Optional)
The repository includes a GitHub Actions workflow that can automatically deploy on push. You'll need to:
1. Add your VM SSH credentials as GitHub Secrets
2. Enable Actions in your repository

---

## Installing Wings (Game Server Daemon)

Wings is the daemon that actually runs your game servers.

### 1. Install Docker
```bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
sudo systemctl enable --now docker
```

### 2. Install Wings
```bash
sudo mkdir -p /etc/pterodactyl
curl -L -o /usr/local/bin/wings "https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_$([[ "$(uname -m)" == "x86_64" ]] && echo "amd64" || echo "arm64")"
sudo chmod u+x /usr/local/bin/wings
```

### 3. Configure Wings
1. Go to your Panel admin area
2. Navigate to **Nodes** → Create Node
3. Copy the configuration and save it to `/etc/pterodactyl/config.yml`

### 4. Create Systemd Service
```bash
sudo nano /etc/systemd/system/wings.service
```

Paste:
```ini
[Unit]
Description=Wings Daemon
After=docker.service
Requires=docker.service
PartOf=docker.service

[Service]
User=root
WorkingDirectory=/etc/pterodactyl
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/local/bin/wings
Restart=on-failure
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable --now wings
```

---

## Troubleshooting

### Check Service Status
```bash
sudo systemctl status pteroq
sudo systemctl status wings
sudo systemctl status nginx
sudo systemctl status php8.1-fpm
```

### View Logs
```bash
# Panel logs
tail -f /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log

# Wings logs
sudo wings --debug

# Queue worker logs
sudo journalctl -u pteroq -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Common Issues

**Issue: 500 Error**
- Check file permissions
- Check `.env` configuration
- View laravel logs

**Issue: Queue not processing**
- Restart pteroq: `sudo systemctl restart pteroq`
- Check Redis: `redis-cli ping`

**Issue: Wings not connecting**
- Check firewall rules
- Verify config.yml
- Check Wings logs

---

## Next Steps

1. **Customize the Panel** - See `CUSTOMIZATION_GUIDE.md`
2. **Add Game Eggs** - Import game configurations from the panel
3. **Create Your First Server** - Test the setup

Need help? Check the Pterodactyl documentation: https://pterodactyl.io/panel/1.0/getting_started.html


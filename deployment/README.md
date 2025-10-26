# GameControl.cc Deployment Guide

This folder contains server configuration files and deployment scripts.

## 🌐 Setting Up Domain (gamecontrol.cc)

### Prerequisites
1. DNS A records pointing to your server:
   - `@` → `45.76.125.141`
   - `www` → `45.76.125.141`
2. Wait for DNS propagation (check at https://dnschecker.org)

### Automated Setup

On your **VM** (`45.76.125.141`):

```bash
cd /var/www/pterodactyl
git pull origin main
sudo bash deployment/setup-domain.sh
```

The script will:
- ✅ Update `.env` with new domain
- ✅ Install Certbot
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Configure Nginx with HTTPS
- ✅ Clear Laravel caches
- ✅ Restart services

### Manual Setup

If you prefer to do it manually:

1. **Get SSL Certificate:**
   ```bash
   systemctl stop nginx
   certbot certonly --standalone -d gamecontrol.cc -d www.gamecontrol.cc
   ```

2. **Copy Nginx Config:**
   ```bash
   cp /var/www/pterodactyl/deployment/nginx/gamecontrol.cc.conf /etc/nginx/sites-available/pterodactyl.conf
   ```

3. **Update .env:**
   ```bash
   nano /var/www/pterodactyl/.env
   ```
   Change:
   - `APP_URL=https://gamecontrol.cc`
   - `SESSION_DOMAIN=gamecontrol.cc`

4. **Restart Services:**
   ```bash
   cd /var/www/pterodactyl
   php artisan config:clear
   php artisan cache:clear
   nginx -t
   systemctl start nginx
   systemctl restart php8.2-fpm
   ```

### Post-Setup Tasks

#### Update Wings on All Nodes

**Main Node (45.76.125.141):**
```bash
nano /etc/pterodactyl/config.yml
# Change: remote: 'https://gamecontrol.cc'
systemctl restart wings
```

**Sydney Node (207.148.83.8):**
```bash
ssh root@207.148.83.8
nano /etc/pterodactyl/config.yml
# Change: remote: 'https://gamecontrol.cc'
systemctl restart wings
```

#### Update Admin Panel
1. Visit: https://gamecontrol.cc/admin/settings
2. Update **Panel Domain** to: `gamecontrol.cc`
3. Click Save

## 🎉 Done!

Your site should now be live at: **https://gamecontrol.cc**

Test these URLs:
- Homepage: https://gamecontrol.cc
- Login: https://gamecontrol.cc/auth/login
- Dashboard: https://gamecontrol.cc/servers
- Cart: https://gamecontrol.cc/cart
- Billing: https://gamecontrol.cc/billing

All pages should show a green padlock 🔒 indicating secure HTTPS connection.


#!/bin/bash

# GameControl.cc Domain Setup Script
# Run this on the VM after pulling from GitHub

set -e

echo "🌐 GameControl.cc Domain Setup"
echo "==============================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (sudo bash deployment/setup-domain.sh)"
    exit 1
fi

DOMAIN="gamecontrol.cc"
PANEL_DIR="/var/www/pterodactyl"

echo "📋 Step 1: Updating .env file..."
cd $PANEL_DIR

# Update APP_URL
sed -i "s|^APP_URL=.*|APP_URL=https://$DOMAIN|" .env

# Update or add SESSION_DOMAIN
if grep -q "^SESSION_DOMAIN=" .env; then
    sed -i "s|^SESSION_DOMAIN=.*|SESSION_DOMAIN=$DOMAIN|" .env
else
    echo "SESSION_DOMAIN=$DOMAIN" >> .env
fi

echo "✅ .env updated"

echo ""
echo "📋 Step 2: Installing Certbot..."
apt update
apt install certbot python3-certbot-nginx -y

echo ""
echo "📋 Step 3: Stopping Nginx for SSL certificate..."
systemctl stop nginx

echo ""
echo "🔒 Step 4: Getting SSL certificate..."
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
    echo "⚠️  SSL certificate failed. Make sure DNS is pointing to this server!"
    echo "   Check DNS at: https://dnschecker.org/#A/$DOMAIN"
    exit 1
}

echo ""
echo "📋 Step 5: Copying Nginx configuration..."
cp $PANEL_DIR/deployment/nginx/gamecontrol.cc.conf /etc/nginx/sites-available/pterodactyl.conf

echo ""
echo "📋 Step 6: Testing Nginx configuration..."
nginx -t

echo ""
echo "📋 Step 7: Opening firewall port 443..."
ufw allow 443/tcp

echo ""
echo "📋 Step 8: Clearing Laravel caches..."
cd $PANEL_DIR
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo ""
echo "📋 Step 9: Starting services..."
systemctl start nginx
systemctl restart php8.2-fpm

echo ""
echo "✅ Domain setup complete!"
echo ""
echo "🌍 Your site is now live at: https://$DOMAIN"
echo ""
echo "⚠️  IMPORTANT: Update Wings configuration on all nodes:"
echo "   1. SSH into each node"
echo "   2. Edit: nano /etc/pterodactyl/config.yml"
echo "   3. Change remote: 'http://45.76.125.141' to remote: 'https://$DOMAIN'"
echo "   4. Run: systemctl restart wings"
echo ""
echo "📱 Also update admin panel settings:"
echo "   Visit: https://$DOMAIN/admin/settings"
echo "   Update 'Panel Domain' to: $DOMAIN"
echo ""


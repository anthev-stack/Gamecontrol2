#!/bin/bash

###############################################################################
# Pterodactyl Panel Deployment Script
# This script automates the deployment of Pterodactyl Panel to your VM
###############################################################################

set -e

echo "=================================="
echo "Pterodactyl Panel Deployment"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}" 
   exit 1
fi

echo -e "${GREEN}[1/8]${NC} Pulling latest changes from GitHub..."
git pull origin main

echo -e "${GREEN}[2/8]${NC} Installing/Updating Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo -e "${GREEN}[3/8]${NC} Clearing application cache..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo -e "${GREEN}[4/8]${NC} Running database migrations..."
php artisan migrate --force --seed

echo -e "${GREEN}[5/8]${NC} Setting permissions..."
chown -R www-data:www-data /var/www/pterodactyl
chmod -R 755 storage/* bootstrap/cache/

echo -e "${GREEN}[6/8]${NC} Installing Node dependencies and building assets..."
yarn install
yarn build:production

echo -e "${GREEN}[7/8]${NC} Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo -e "${GREEN}[8/8]${NC} Restarting services..."
systemctl restart nginx
systemctl restart php8.1-fpm

echo ""
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo ""


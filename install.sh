#!/bin/bash

###############################################################################
# Pterodactyl Panel Installation Script
# Run this script on your VM after cloning the repository
###############################################################################

set -e

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

echo "=================================="
echo "Pterodactyl Panel Installation"
echo "=================================="
echo ""

# Install systemd service
echo -e "${GREEN}[1/3]${NC} Installing queue worker service..."
cp config/systemd/pteroq.service /etc/systemd/system/pteroq.service
systemctl daemon-reload
systemctl enable pteroq.service

# Install nginx config
echo -e "${GREEN}[2/3]${NC} Installing nginx configuration..."
cp config/nginx/pterodactyl.conf /etc/nginx/sites-available/pterodactyl.conf
ln -sf /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf

# Remove default nginx site if exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Test nginx config
nginx -t

# Restart services
echo -e "${GREEN}[3/3]${NC} Starting services..."
systemctl restart nginx
systemctl start pteroq.service

echo ""
echo -e "${GREEN}✓ Installation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Visit http://YOUR_VM_IP in your browser"
echo "2. Log in with the admin user you created"
echo "3. Install Wings on this server or another node"
echo ""


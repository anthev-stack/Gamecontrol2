#!/bin/bash

###############################################################################
# Wings Installation Script
# Installs Docker and Wings daemon for game server management
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
echo "Wings Daemon Installation"
echo "=================================="
echo ""

# Install Docker
echo -e "${GREEN}[1/6]${NC} Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -sSL https://get.docker.com/ | CHANNEL=stable bash
    systemctl enable --now docker
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${YELLOW}✓ Docker already installed${NC}"
fi

# Download Wings
echo -e "${GREEN}[2/6]${NC} Downloading Wings..."
curl -L -o /usr/local/bin/wings "https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_amd64"
chmod u+x /usr/local/bin/wings
echo -e "${GREEN}✓ Wings downloaded${NC}"

# Create directories
echo -e "${GREEN}[3/6]${NC} Creating directories..."
mkdir -p /etc/pterodactyl
mkdir -p /var/lib/pterodactyl/volumes
echo -e "${GREEN}✓ Directories created${NC}"

# Install configuration
echo -e "${GREEN}[4/6]${NC} Installing Wings configuration..."
cp config/wings/config.yml /etc/pterodactyl/config.yml
echo -e "${GREEN}✓ Configuration installed${NC}"

# Install systemd service
echo -e "${GREEN}[5/6]${NC} Installing Wings service..."
cp config/systemd/wings.service /etc/systemd/system/wings.service
systemctl daemon-reload
systemctl enable wings.service
echo -e "${GREEN}✓ Service installed${NC}"

# Start Wings
echo -e "${GREEN}[6/6]${NC} Starting Wings..."
systemctl start wings.service

echo ""
echo -e "${GREEN}✓ Wings installation complete!${NC}"
echo ""
echo "Check status with: systemctl status wings"
echo "View logs with: journalctl -u wings -f"
echo ""


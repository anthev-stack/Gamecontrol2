#!/bin/bash

# Wings SSL Configuration Script for Gamecontrol
# This script configures Wings to use SSL for secure WebSocket connections
# Run this on the Wings node (45.76.125.141)

set -e

echo "=================================="
echo "Wings SSL Configuration"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

DOMAIN="gamecontrol.cc"
CONFIG_FILE="/etc/pterodactyl/config.yml"

# Check if Wings config exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Wings configuration file not found at $CONFIG_FILE"
    echo "Make sure Wings is installed first."
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "Error: SSL certificates not found for $DOMAIN"
    echo "Make sure you've run the domain setup script first."
    exit 1
fi

echo "Backing up current Wings configuration..."
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

echo "Updating Wings configuration to enable SSL..."

# Use sed to update the config file
# Find the api: section and update ssl settings
if grep -q "ssl:" "$CONFIG_FILE"; then
    # SSL section exists, update it
    sed -i 's/enabled: false/enabled: true/' "$CONFIG_FILE"
    sed -i "s|cert: .*|cert: /etc/letsencrypt/live/$DOMAIN/fullchain.pem|" "$CONFIG_FILE"
    sed -i "s|key: .*|key: /etc/letsencrypt/live/$DOMAIN/privkey.pem|" "$CONFIG_FILE"
else
    # SSL section doesn't exist, add it after the port line
    sed -i '/port: 8080/a\  ssl:\n    enabled: true\n    cert: /etc/letsencrypt/live/'"$DOMAIN"'/fullchain.pem\n    key: /etc/letsencrypt/live/'"$DOMAIN"'/privkey.pem' "$CONFIG_FILE"
fi

echo ""
echo "Wings configuration updated!"
echo ""
echo "Current SSL configuration:"
grep -A 4 "ssl:" "$CONFIG_FILE"
echo ""

echo "Restarting Wings..."
systemctl restart wings

echo ""
echo "Checking Wings status..."
systemctl status wings --no-pager | head -n 10

echo ""
echo "=================================="
echo "Wings SSL Setup Complete!"
echo "=================================="
echo ""
echo "Wings is now using SSL/TLS (WSS) on port 8080"
echo "WebSocket connections from the panel will now work over HTTPS"
echo ""
echo "If you need to revert, restore from: ${CONFIG_FILE}.backup.*"
echo ""

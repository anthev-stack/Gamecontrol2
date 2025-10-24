# 🚀 Quick Start Checklist

Use this checklist to get your GameControl 2.0 panel up and running!

## ✅ Pre-Deployment Checklist

### 1. Domain & DNS
- [ ] Register a domain name (or use subdomain)
- [ ] Point A record to your VM IP address
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Test: `ping yourdomain.com`

### 2. VM Requirements
- [ ] Ubuntu 20.04 or 22.04 installed
- [ ] At least 2GB RAM
- [ ] 20GB+ disk space
- [ ] Root or sudo access
- [ ] SSH access working

### 3. GitHub Setup
- [ ] Repository is accessible at https://github.com/anthev-stack/Gamecontrol2
- [ ] You have Git installed on your VM: `git --version`

---

## 🔧 Installation Checklist

Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) and check off each step:

### Initial Server Setup
- [ ] System updated: `sudo apt update && sudo apt upgrade -y`
- [ ] Firewall configured (ports 22, 80, 443, 8080, 2022)
- [ ] Swap configured (if needed)

### Dependencies
- [ ] PHP 8.1 and extensions installed
- [ ] Nginx installed
- [ ] MariaDB/MySQL installed
- [ ] Redis installed
- [ ] Composer installed
- [ ] Node.js and Yarn installed

### Database Setup
- [ ] MySQL secured: `sudo mysql_secure_installation`
- [ ] Database `panel` created
- [ ] Database user `pterodactyl` created
- [ ] Permissions granted

### Panel Installation
- [ ] Repository cloned to `/var/www/pterodactyl`
- [ ] Composer dependencies installed
- [ ] Node dependencies installed
- [ ] `.env` file configured
- [ ] Application key generated
- [ ] Database migrations run
- [ ] First admin user created
- [ ] Permissions set correctly

### Web Server
- [ ] Nginx configured
- [ ] Site enabled
- [ ] Nginx restarted
- [ ] SSL certificate installed (recommended)

### Services
- [ ] Queue worker (pteroq) service created
- [ ] Queue worker enabled and running
- [ ] Cron job configured

### Testing
- [ ] Panel accessible at your domain
- [ ] Can log in with admin user
- [ ] Admin dashboard loads

---

## 🎯 Wings Installation Checklist

### Docker
- [ ] Docker installed
- [ ] Docker service running

### Wings Setup
- [ ] Wings binary downloaded
- [ ] Wings made executable
- [ ] Node created in panel
- [ ] Configuration copied to `/etc/pterodactyl/config.yml`
- [ ] Wings service created
- [ ] Wings service enabled and running
- [ ] Wings connected to panel (check node status)

---

## 🎨 Customization Checklist

See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for details.

- [ ] Panel name updated in `.env`
- [ ] Logo replaced (optional)
- [ ] Favicon replaced (optional)
- [ ] Colors customized (optional)
- [ ] Email settings configured
- [ ] Frontend assets rebuilt: `yarn build:production`

---

## 🤖 GitHub Actions Setup Checklist

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for details.

- [ ] SSH key generated on VM
- [ ] SSH key added to authorized_keys
- [ ] GitHub Secrets configured:
  - [ ] `VM_HOST`
  - [ ] `VM_USERNAME`
  - [ ] `VM_SSH_KEY`
  - [ ] `VM_PORT`
- [ ] Deployment script is executable
- [ ] GitHub Actions tested (push to main)

---

## 🎮 First Server Setup Checklist

### In Admin Panel
- [ ] Node created and online
- [ ] Location created
- [ ] Nest/Egg imported (e.g., Minecraft)
- [ ] Allocations created for node

### Create Test Server
- [ ] Navigate to Servers → Create New
- [ ] Fill in server details
- [ ] Assign to user
- [ ] Server created successfully
- [ ] Server shows as installing
- [ ] Server completes installation
- [ ] Can access server console
- [ ] Can start/stop server

---

## 🔍 Verification Checklist

### Panel Health
- [ ] Panel accessible via HTTPS
- [ ] No errors in Laravel logs: `tail /var/www/pterodactyl/storage/logs/laravel-*.log`
- [ ] Queue worker running: `systemctl status pteroq`
- [ ] Redis working: `redis-cli ping` (should return PONG)

### Wings Health
- [ ] Wings service running: `systemctl status wings`
- [ ] Wings connected (check node in admin panel - should be green)
- [ ] Docker working: `docker ps`

### Security
- [ ] Firewall enabled: `ufw status`
- [ ] SSL certificate active (HTTPS working)
- [ ] Database password is strong
- [ ] Default admin password changed

---

## 📋 Maintenance Checklist

### Daily
- [ ] Check panel is accessible
- [ ] Monitor server resources
- [ ] Check for any server issues

### Weekly
- [ ] Review Laravel logs for errors
- [ ] Check Wings logs: `journalctl -u wings -n 100`
- [ ] Review queue worker logs: `journalctl -u pteroq -n 100`
- [ ] Check disk space: `df -h`

### Monthly
- [ ] Update system packages: `apt update && apt upgrade`
- [ ] Review and rotate logs if needed
- [ ] Backup database
- [ ] Update panel if new version available

---

## 🆘 Troubleshooting Quick Reference

### Panel Issues
```bash
# Check logs
tail -f /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log

# Clear cache
cd /var/www/pterodactyl
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Restart services
systemctl restart nginx
systemctl restart php8.1-fpm
systemctl restart pteroq
```

### Wings Issues
```bash
# Check status
systemctl status wings

# View logs
journalctl -u wings -f

# Restart
systemctl restart wings

# Debug mode
wings --debug
```

### Database Issues
```bash
# Check MySQL status
systemctl status mariadb

# Access MySQL
mysql -u root -p

# Check panel database
mysql -u pterodactyl -p panel
```

---

## 📚 Documentation Links

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Full installation instructions
- **[Customization Guide](./CUSTOMIZATION_GUIDE.md)** - Branding and modifications
- **[GitHub Setup](./GITHUB_SETUP.md)** - Automated deployment setup
- **[Official Pterodactyl Docs](https://pterodactyl.io)** - Additional help

---

## ✅ All Done!

Once you've checked off everything:

1. 🎉 **Congratulations!** Your panel is ready
2. 🎮 Create your first game server
3. 🎨 Customize the branding to match your style
4. 📢 Invite users to your platform
5. 🚀 Scale up by adding more nodes

**Need help?** Open an issue on [GitHub](https://github.com/anthev-stack/Gamecontrol2/issues)

---

**Estimated Time**:
- First-time setup: 2-3 hours
- With experience: 30-60 minutes
- Wings installation: 15-30 minutes

Good luck! 🎮


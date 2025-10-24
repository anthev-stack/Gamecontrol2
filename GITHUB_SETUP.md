# GitHub Setup for Automated Deployment

This guide explains how to set up GitHub Actions for automated deployment to your VM.

## Overview

When you push code to the `main` branch, GitHub Actions will automatically:
1. Connect to your VM via SSH
2. Pull the latest code
3. Run the deployment script
4. Restart services

## Step-by-Step Setup

### 1. Generate SSH Key on Your VM

SSH into your VM and generate a dedicated SSH key for GitHub Actions:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Display the public key
cat ~/.ssh/github_actions.pub

# Add the public key to authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Display the private key (you'll need this for GitHub)
cat ~/.ssh/github_actions
```

**Important**: Save the private key contents - you'll add it to GitHub Secrets.

### 2. Configure GitHub Secrets

Go to your repository on GitHub:

1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these four secrets:

#### VM_HOST
- **Name**: `VM_HOST`
- **Value**: Your VM IP address (e.g., `192.168.1.100` or `your-domain.com`)

#### VM_USERNAME
- **Name**: `VM_USERNAME`
- **Value**: Your SSH username (usually `root` or your user account)

#### VM_SSH_KEY
- **Name**: `VM_SSH_KEY`
- **Value**: The **entire private key** from `~/.ssh/github_actions` (including the `-----BEGIN` and `-----END` lines)

#### VM_PORT
- **Name**: `VM_PORT`
- **Value**: Your SSH port (usually `22`)

### 3. Test the SSH Connection

Before relying on GitHub Actions, test the SSH connection locally:

```bash
# Test from your local machine
ssh -i ~/.ssh/github_actions your-username@your-vm-ip -p 22
```

If this works, GitHub Actions should work too!

### 4. Verify Deployment Script Permissions

Make sure the deployment script is executable on your VM:

```bash
cd /var/www/pterodactyl
sudo chmod +x deploy.sh
```

### 5. Test GitHub Actions

Make a small change and push to GitHub:

```bash
# Make a change
echo "# Test" >> test.txt

# Commit and push
git add test.txt
git commit -m "Test automated deployment"
git push origin main
```

### 6. Monitor the Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see your workflow running
4. Click on it to see real-time logs

## Troubleshooting

### Action Fails with "Permission Denied"

**Solution**: Check that the SSH key is correctly added to `~/.ssh/authorized_keys` on your VM.

```bash
# On your VM
cat ~/.ssh/authorized_keys
```

### Action Fails at "Deploy to VM via SSH"

**Solution**: Verify your GitHub Secrets are correct:
- Double-check VM_HOST (no `http://` or trailing slashes)
- Verify VM_PORT is a number (usually 22)
- Ensure VM_SSH_KEY includes the full private key with headers

### Deployment Script Fails

**Solution**: SSH into your VM and run the script manually to see errors:

```bash
cd /var/www/pterodactyl
sudo ./deploy.sh
```

### Can't Find the Repository

**Solution**: Make sure Git is configured on your VM:

```bash
cd /var/www/pterodactyl
git remote -v
# Should show: origin  https://github.com/anthev-stack/Gamecontrol2.git
```

If not, set it:
```bash
git remote add origin https://github.com/anthev-stack/Gamecontrol2.git
```

## Manual Deployment (Fallback)

If GitHub Actions aren't working, you can always deploy manually:

```bash
# SSH into your VM
ssh your-username@your-vm-ip

# Navigate to panel directory
cd /var/www/pterodactyl

# Pull latest changes
git pull origin main

# Run deployment script
sudo ./deploy.sh
```

## Security Best Practices

1. ✅ **Use a dedicated SSH key** (don't reuse your personal key)
2. ✅ **Restrict SSH key permissions** on your VM:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```
3. ✅ **Use a non-root user** when possible
4. ✅ **Enable SSH key-only authentication** (disable password auth)
5. ✅ **Keep your GitHub repository private** if it contains sensitive data

## Advanced: Using Deploy Keys

For added security, you can use GitHub Deploy Keys instead of SSH keys:

1. Go to **Settings** → **Deploy keys** in your GitHub repo
2. Click **Add deploy key**
3. Paste your public key (`~/.ssh/github_actions.pub`)
4. Check **Allow write access** if you need to push from your VM

## Need Help?

- Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review the [deployment guide](./DEPLOYMENT_GUIDE.md)
- Open an issue on GitHub

Happy deploying! 🚀


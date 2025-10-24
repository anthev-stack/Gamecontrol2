# GameControl 2.0

A customized version of Pterodactyl Panel for game server hosting.

![License](https://img.shields.io/github/license/anthev-stack/Gamecontrol2)
![Stars](https://img.shields.io/github/stars/anthev-stack/Gamecontrol2)

## 🎮 About

GameControl 2.0 is a powerful, customized game server management panel built on Pterodactyl. It provides an intuitive interface for managing game servers, users, and resources.

## ✨ Features

- 🎯 **User-Friendly Dashboard** - Clean, modern interface
- 🔒 **Secure** - Built-in security features and 2FA
- 🚀 **Fast Deployment** - Automated deployment scripts
- 🎨 **Customizable** - Easy branding and theming
- 📊 **Resource Management** - Monitor server resources in real-time
- 🔌 **API Access** - Full RESTful API
- 🌐 **Multi-Node Support** - Scale across multiple servers
- 📦 **Game Support** - Minecraft, Rust, ARK, CS2, and more

## 🚀 Quick Start

### Prerequisites

- Ubuntu 20.04 or 22.04
- 2GB+ RAM
- Domain name
- Root/sudo access

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/anthev-stack/Gamecontrol2.git /var/www/pterodactyl
cd /var/www/pterodactyl
```

2. **Follow the deployment guide**:
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed installation instructions.

3. **Customize your panel**:
See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for branding and customization options.

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete installation and setup instructions
- **[Customization Guide](./CUSTOMIZATION_GUIDE.md)** - Branding and customization options
- **[Pterodactyl Docs](https://pterodactyl.io)** - Official Pterodactyl documentation

## 🔧 Technologies

- **Backend**: PHP 8.1, Laravel 10
- **Frontend**: React, TypeScript, TailwindCSS
- **Database**: MySQL/MariaDB
- **Cache**: Redis
- **Server Management**: Docker, Wings

## 🛠️ Development

### Local Setup

1. **Install dependencies**:
```bash
composer install
yarn install
```

2. **Configure environment**:
```bash
cp .env.example .env
php artisan key:generate
```

3. **Run development server**:
```bash
php artisan serve
yarn watch
```

## 📦 Deployment

### Automated Deployment

The project includes automated deployment via GitHub Actions:

1. Set up GitHub Secrets:
   - `VM_HOST` - Your VM IP address
   - `VM_USERNAME` - SSH username
   - `VM_SSH_KEY` - Private SSH key
   - `VM_PORT` - SSH port (usually 22)

2. Push to main branch:
```bash
git push origin main
```

The panel will automatically deploy to your VM!

### Manual Deployment

```bash
cd /var/www/pterodactyl
sudo ./deploy.sh
```

## 🎨 Customization

The panel is designed to be easily customizable:

- **Colors & Themes**: Edit `tailwind.config.js`
- **Logo**: Replace `resources/scripts/assets/images/pterodactyl.svg`
- **Branding**: Update `.env` and config files
- **Custom Pages**: Add routes and views

See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Built on [Pterodactyl Panel](https://github.com/pterodactyl/panel)
- Thanks to the Pterodactyl community

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/anthev-stack/Gamecontrol2/issues)
- **Discord**: Join the Pterodactyl Discord

## 🔐 Security

If you discover a security vulnerability, please email [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ for the gaming community

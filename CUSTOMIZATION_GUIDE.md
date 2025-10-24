# Pterodactyl Panel Customization Guide

This guide will help you customize your Pterodactyl Panel to match your brand and requirements.

## Table of Contents
1. [Branding & Styling](#branding--styling)
2. [Logo & Favicon](#logo--favicon)
3. [Color Scheme](#color-scheme)
4. [Panel Name](#panel-name)
5. [Email Templates](#email-templates)
6. [Adding Custom Pages](#adding-custom-pages)
7. [Modifying Functionality](#modifying-functionality)

---

## Branding & Styling

### Changing Panel Colors

The panel uses TailwindCSS. To customize colors, edit `tailwind.config.js`:

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                // Primary brand colors
                primary: {
                    50: '#your-color',
                    100: '#your-color',
                    // ... add your color palette
                    900: '#your-color',
                },
            }
        }
    }
}
```

After changes, rebuild assets:
```bash
yarn build:production
```

### Custom CSS

Add custom styles to `resources/scripts/assets/css/GlobalStylesheet.ts`:

```typescript
import tw from 'twin.macro';

export default css`
    /* Your custom CSS here */
    .custom-class {
        ${tw`bg-blue-500 text-white`}
    }
`;
```

---

## Logo & Favicon

### Replace Logo

1. **Main Logo** (shown in header)
   - Location: `resources/scripts/assets/images/pterodactyl.svg`
   - Replace with your own SVG or PNG
   - Recommended size: 180x40px

2. **Update Logo Reference**
   ```bash
   # If using a different image format or name:
   # Edit: resources/scripts/components/NavigationBar.tsx
   ```

### Replace Favicon

Replace files in `public/favicons/`:
- `favicon.ico` - Main favicon
- `apple-touch-icon.png` - iOS devices
- `favicon-16x16.png` - Small favicon
- `favicon-32x32.png` - Standard favicon

You can generate a complete favicon package at [favicon.io](https://favicon.io/)

---

## Panel Name

### Change Application Name

Edit `.env` file:
```env
APP_NAME="Your Game Hosting"
```

### Update Meta Information

Edit `config/app.php`:
```php
'name' => env('APP_NAME', 'Your Game Hosting'),
```

### Change Admin Panel Title

Edit `resources/views/layouts/admin.blade.php`:
```blade
<title>@yield('title') - Your Admin Panel</title>
```

### Change Client Panel Title

Edit `resources/scripts/components/App.tsx`:
```typescript
<Helmet>
    <title>{route.name} | Your Game Hosting</title>
</Helmet>
```

---

## Color Scheme

### Update Theme Colors

Edit `resources/scripts/theme.ts`:

```typescript
export default {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    // ... other colors
};
```

### Dark Mode Customization

The panel includes dark mode by default. To customize dark mode colors:

Edit TailwindCSS config for dark mode variants:
```javascript
// tailwind.config.js
module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    50: '#your-dark-color',
                    // ... dark palette
                }
            }
        }
    }
}
```

---

## Email Templates

### Customize Email Templates

Email templates are in `resources/views/vendor/notifications/`:

1. **Welcome Email**: `resources/views/vendor/notifications/email.blade.php`
2. **Password Reset**: Edit in notification class

### Change Email Sender

Edit `.env`:
```env
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Your Game Hosting"
```

### Add Custom Email Footer

Edit `resources/views/vendor/notifications/email.blade.php`:
```blade
{{-- Footer --}}
<tr>
    <td>
        <p>© {{ date('Y') }} Your Company Name. All rights reserved.</p>
    </td>
</tr>
```

---

## Adding Custom Pages

### Create a New Route

1. **Add Route** in `routes/base.php`:
```php
Route::get('/custom-page', 'CustomController@index')->name('custom.page');
```

2. **Create Controller** in `app/Http/Controllers/Base/`:
```php
<?php

namespace Pterodactyl\Http\Controllers\Base;

use Pterodactyl\Http\Controllers\Controller;

class CustomController extends Controller
{
    public function index()
    {
        return view('custom.page');
    }
}
```

3. **Create View** in `resources/views/custom/page.blade.php`:
```blade
@extends('layouts.main')

@section('title')
    Custom Page
@endsection

@section('content')
    <div class="container mx-auto">
        <h1>Your Custom Content</h1>
    </div>
@endsection
```

### Add Navigation Link

Edit `resources/scripts/components/NavigationBar.tsx`:
```typescript
<NavLink to="/custom-page">Custom Page</NavLink>
```

---

## Modifying Functionality

### Custom Server Creation Limits

Edit `app/Services/Servers/ServerCreationService.php`:

```php
// Add custom validation
if ($user->servers()->count() >= 5) {
    throw new DisplayException('Maximum servers reached.');
}
```

### Add Custom User Fields

1. **Create Migration**:
```bash
php artisan make:migration add_custom_field_to_users
```

2. **Edit Migration**:
```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('custom_field')->nullable();
    });
}
```

3. **Run Migration**:
```bash
php artisan migrate
```

4. **Update Model** (`app/Models/User.php`):
```php
protected $fillable = [
    // ... existing fields
    'custom_field',
];
```

### Custom Dashboard Widgets

Edit `resources/scripts/components/dashboard/DashboardContainer.tsx`:

```typescript
// Add your custom widget
<div className="custom-widget">
    <h2>Custom Statistics</h2>
    {/* Your content */}
</div>
```

---

## Advanced Customizations

### Custom API Endpoints

1. **Create Route** in `routes/api-client.php`:
```php
Route::get('/custom-endpoint', 'CustomApiController@index');
```

2. **Create Controller**:
```php
<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

class CustomApiController extends ClientApiController
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => 'your custom data',
        ]);
    }
}
```

### Custom Middleware

1. **Create Middleware**:
```bash
php artisan make:middleware CustomMiddleware
```

2. **Register in** `app/Http/Kernel.php`:
```php
protected $routeMiddleware = [
    // ... existing middleware
    'custom' => \Pterodactyl\Http\Middleware\CustomMiddleware::class,
];
```

### Custom Background Jobs

1. **Create Job**:
```bash
php artisan make:job CustomJob
```

2. **Implement Job Logic** in `app/Jobs/CustomJob.php`

3. **Dispatch Job**:
```php
dispatch(new CustomJob($data));
```

---

## Building & Deploying Changes

After making any customizations:

### 1. Build Frontend Assets
```bash
yarn build:production
```

### 2. Clear Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 3. Optimize for Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Commit Changes
```bash
git add .
git commit -m "Customizations: your changes"
git push origin main
```

### 5. Deploy to VM
```bash
cd /var/www/pterodactyl
sudo ./deploy.sh
```

---

## Testing Your Customizations

### Local Development

1. **Install Dependencies**:
```bash
composer install
yarn install
```

2. **Copy Environment**:
```bash
cp .env.example .env
php artisan key:generate
```

3. **Run Development Server**:
```bash
php artisan serve
```

4. **Watch Assets** (in another terminal):
```bash
yarn watch
```

### Common Issues

**Assets not updating?**
```bash
yarn build:production
php artisan view:clear
```

**Database changes not applying?**
```bash
php artisan migrate:fresh --seed
```

**API not working?**
```bash
php artisan route:clear
php artisan config:clear
```

---

## Best Practices

1. ✅ **Always test locally first**
2. ✅ **Keep backups before major changes**
3. ✅ **Use version control (Git)**
4. ✅ **Document your customizations**
5. ✅ **Follow Laravel/React best practices**
6. ✅ **Keep the panel updated** (merge upstream changes)

---

## Resources

- **Pterodactyl Docs**: https://pterodactyl.io
- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev
- **TailwindCSS Docs**: https://tailwindcss.com

---

## Need Help?

- Pterodactyl Discord: https://discord.gg/pterodactyl
- GitHub Issues: https://github.com/anthev-stack/Gamecontrol2/issues

Happy customizing! 🎮


<?php

namespace Pterodactyl\Http\Controllers\Admin\Credits;

use Illuminate\View\View;
use Pterodactyl\Http\Controllers\Controller;

class CreditController extends Controller
{
    /**
     * Display the credit management page.
     */
    public function index(): View
    {
        return view('admin.credits.index');
    }
}


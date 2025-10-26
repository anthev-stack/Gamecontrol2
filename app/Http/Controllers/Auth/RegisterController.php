<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Pterodactyl\Http\Controllers\Controller;

class RegisterController extends Controller
{
    /**
     * Handle registration request.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|min:3|max:32|unique:users,username|regex:/^[a-z0-9_-]+$/i',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                'email' => $request->input('email'),
                'username' => $request->input('username'),
                'name_first' => $request->input('username'), // Use username as first name by default
                'name_last' => '',
                'password' => Hash::make($request->input('password')),
                'language' => 'en',
                'root_admin' => false,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Account created successfully. You can now login.',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating your account. Please try again.',
            ], 500);
        }
    }
}


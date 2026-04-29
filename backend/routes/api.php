<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GeneratorController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user
    ], 201);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        
        Route::get('/sales-pages', [GeneratorController::class, 'index']);
        Route::post('/generate', [GeneratorController::class, 'generate']);
        Route::get('/sales-pages/{id}', [GeneratorController::class, 'show']);
        Route::put('/sales-pages/{id}/regenerate', [GeneratorController::class, 'regenerate']);
        Route::delete('/sales-pages/{id}', [GeneratorController::class, 'destroy']);
    });
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GeneratorController;
use Illuminate\Support\Facades\Route;

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

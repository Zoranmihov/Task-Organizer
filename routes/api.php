<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public

Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::get('profile', [UserController::class, 'profile']);
    Route::post('verify', [UserController::class, 'verifyUser']);
    Route::get('logout', [UserController::class, 'logout']);

    //Project routes
    Route::post('create-project', [ProjectController::class, 'createProject']);
    Route::get('projects', [ProjectController::class, 'getProjects']);
});

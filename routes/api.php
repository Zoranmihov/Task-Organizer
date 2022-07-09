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
    Route::get('resend', [UserController::class, 'resendCode']);
   // Route::get('test', [UserController::class, 'test']);
    Route::get('logout', [UserController::class, 'logout']);

    //Project routes
    Route::post('create-project', [ProjectController::class, 'createProject']);
    Route::post('delete-project', [ProjectController::class, 'deleteProject']);
    Route::get('projects', [ProjectController::class, 'getProjects']);
    Route::post('project', [ProjectController::class, 'getSingleProject']);
    Route::post('leave-project', [ProjectController::class, 'leaveProject']);
    Route::post('new-task', [ProjectController::class, 'createTask']);
    Route::post('delete-task', [ProjectController::class, 'deleteTask']);
    Route::put('update-task', [ProjectController::class, 'updateTask']);
    Route::post('add-user', [ProjectController::class, 'addMemeber']);
    Route::post('remove-user', [ProjectController::class, 'removeMember']);
    Route::post('new-message', [ProjectController::class, 'message']);
});

<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProgramController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Program routes
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{program}', [ProgramController::class, 'show']);
Route::get('/programs/{program}/download', [ProgramController::class, 'download']);

// Category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Programs
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::put('/programs/{program}', [ProgramController::class, 'update']);
    Route::delete('/programs/{program}', [ProgramController::class, 'destroy']);
    
    // Comments
    Route::post('/programs/{program}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    
    // Categories (admin only)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});
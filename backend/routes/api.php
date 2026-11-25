
<?php

use App\Http\Controllers\Api\MediaController;
use Illuminate\Support\Facades\Route;

// CRUD MEDIA
Route::apiResource('media', MediaController::class)
    ->parameters(['media' => 'media']);

// MENAMBAHKAN MEDIA KE KOLEKSI
Route::post(
    '/users/{userId}/collection/{mediaId}',
    [MediaController::class, 'addToCollection']
);

// MENAMPILKAN KOLEKSI PENGGUNA
Route::get(
    '/users/{userId}/collection',
    [MediaController::class, 'userCollection']
);

// MENGHAPUS MEDIA DARI KOLEKSI
Route::delete(
    '/users/{userId}/collection/{mediaId}',
    [MediaController::class, 'removeFromCollection']
);

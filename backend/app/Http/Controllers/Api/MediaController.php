<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMediaRequest;
use App\Http\Requests\UpdateMediaRequest;
use App\Http\Resources\MediaResource;
use App\Http\Resources\UserResource;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    /**
     * 1. Menampilkan semua media dan pencarian berdasarkan judul.
     */
    public function index(Request $request)
    {
        $query = Media::with('users');

        if ($request->filled('search')) {
            $query->where(
                'title',
                'like',
                '%' . $request->search . '%'
            );
        }

        $media = $query->latest()->get();

        return MediaResource::collection($media);
    }

    /**
     * 2. Menampilkan detail media beserta pengguna yang mengoleksi.
     */
    public function show(Media $media)
    {
        $media->load('users');

        return new MediaResource($media);
    }

    /**
     * 3. Menambahkan media baru.
     */
    public function store(StoreMediaRequest $request)
    {
        $media = Media::create($request->validated());

        return (new MediaResource($media))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * 4. Mengubah data media.
     */
    public function update(
        UpdateMediaRequest $request,
        Media $media
    ) {
        $media->update($request->validated());

        $media->load('users');

        return new MediaResource($media);
    }

    /**
     * 5. Menghapus media.
     */
    public function destroy(Media $media)
    {
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media berhasil dihapus.'
        ], 200);
    }

    /**
     * 6. Menambahkan media ke koleksi pengguna.
     */
    public function addToCollection(
        int $userId,
        int $mediaId
    ) {
        $user = User::findOrFail($userId);
        $media = Media::findOrFail($mediaId);

        // Memeriksa apakah media sudah ada di koleksi.
        if ($user->media()->where('media.id', $media->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Media sudah ada di koleksi pengguna.'
            ], 409);
        }

        // Menambahkan media ke koleksi pengguna.
        $user->media()->attach($media->id);

        $user->load('media');

        return response()->json([
            'success' => true,
            'message' => 'Media berhasil ditambahkan ke koleksi.',
            'data' => new UserResource($user)
        ], 201);
    }

    /**
     * 7. Menghapus media dari koleksi pengguna.
     */
    public function removeFromCollection(
        int $userId,
        int $mediaId
    ) {
        $user = User::findOrFail($userId);
        $media = Media::findOrFail($mediaId);

        $deleted = $user->media()->detach($media->id);

        if ($deleted === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Media tidak ditemukan dalam koleksi.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Media berhasil dihapus dari koleksi.'
        ], 200);
    }

    /**
     * 8. Menampilkan koleksi media milik pengguna.
     */
    public function userCollection(int $userId)
    {
        $user = User::with('media')->findOrFail($userId);

        return MediaResource::collection($user->media);
    }
}

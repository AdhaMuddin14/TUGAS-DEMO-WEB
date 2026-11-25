<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'description' => $this->description,
            'cover' => $this->cover,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Menampilkan pengguna yang mengoleksi media.
            'users' => UserResource::collection(
                $this->whenLoaded('users')
            ),
        ];
    }
}

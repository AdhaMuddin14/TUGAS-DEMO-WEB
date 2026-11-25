<?php

namespace Tests\Feature;

use App\Models\Media;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class MediaShowTest extends TestCase
{
    use DatabaseTransactions;

    public function test_show_returns_the_requested_media_record(): void
    {
        $title = 'Media binding test '.Str::uuid();
        $media = Media::create([
            'title' => $title,
            'type' => 'Film',
            'description' => 'Science fiction movie',
            'cover' => 'interstellar.jpg',
        ]);

        $this->getJson("/api/media/{$media->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $media->id)
            ->assertJsonPath('data.title', $title)
            ->assertJsonPath('data.type', 'Film');
    }

    public function test_show_returns_not_found_for_an_unknown_media_id(): void
    {
        $unknownMediaId = (Media::query()->max('id') ?? 0) + 1;

        $this->getJson("/api/media/{$unknownMediaId}")
            ->assertNotFound();
    }
}

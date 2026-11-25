<?php
namespace FlipPlay;
class Library
{
    // Property untuk menyimpan daftar media
    private array $daftarMedia = [];

    // Constructor
    public function __construct()
    {
        $this->daftarMedia = [];
    }

    // Method untuk menambahkan media
    public function tambahMedia(Media $media): void
    {
        $this->daftarMedia[] = $media;
        echo "Media berhasil ditambahkan!\n";
    }

    // Method untuk menampilkan semua media
    public function tampilkanMedia(): void
    {
        echo "\n=== DAFTAR MEDIA FLIPPLAY ===\n";

        if (empty($this->daftarMedia)) {
            echo "Belum ada media tersedia.\n";
            return;
        }

        foreach ($this->daftarMedia as $index => $media) {
            echo ($index + 1) . ". ";
            echo $media->tampilkanInfo() . "\n";
        }
    }

    // Method untuk mencari media berdasarkan judul
    public function cariMedia(string $judul): ?Media
    {
        foreach ($this->daftarMedia as $media) {
            if (stripos($media->getJudul(), $judul) !== false) {
                return $media;
            }
        }

        return null;
    }

    // Method untuk mengambil seluruh daftar media
    public function getDaftarMedia(): array
    {
        return $this->daftarMedia;
    }
}

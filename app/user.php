<?php
namespace FlipPlay;
// CLASS USER
class User
{
    // PROPERTY
    private string $nama;
    private array $koleksiMedia = [];

    // CONSTRUCTOR
    public function __construct(string $nama)
    {
        $this->nama = $nama;
        $this->koleksiMedia = [];
    }

    // METHOD MENGAMBIL NAMA
    public function getNama(): string
    {
        return $this->nama;
    }

    // METHOD MENAMBAHKAN KOLEKSI
    public function tambahKoleksi(Media $media): void
    {
        $this->koleksiMedia[] = $media;

        echo "Media berhasil ditambahkan ke koleksi {$this->nama}!\n";
    }

    // METHOD MENAMPILKAN KOLEKSI
    public function tampilkanKoleksi(): void
    {
        echo "\n=== KOLEKSI MEDIA " . strtoupper($this->nama) . " ===\n";

        if (empty($this->koleksiMedia)) {
            echo "Koleksi masih kosong.\n";
            return;
        }

        foreach ($this->koleksiMedia as $index => $media) {
            echo ($index + 1) . ". ";
            echo $media->tampilkanInfo() . "\n";
        }
    }

    // METHOD MENGHITUNG KOLEKSI
    public function jumlahKoleksi(): int
    {
        return count($this->koleksiMedia);
    }
}

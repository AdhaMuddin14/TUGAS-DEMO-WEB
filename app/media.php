<?php
namespace FlipPlay;
// CLASS MEDIA
class Media
{
    // PROPERTY
    private string $judul;
    private string $genre;
    private int $tahun;

    // CONSTRUCTOR
    public function __construct(
        string $judul,
        string $genre,
        int $tahun
    ) {
        $this->judul = $judul;
        $this->genre = $genre;
        $this->tahun = $tahun;
    }

    // METHOD MENGAMBIL JUDUL
    public function getJudul(): string
    {
        return $this->judul;
    }

    // METHOD MENAMPILKAN INFORMASI
    public function tampilkanInfo(): string
    {
        return "Judul: {$this->judul} | Genre: {$this->genre} | Tahun: {$this->tahun}";
    }
}

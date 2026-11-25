<?php

//MEMANGGIL FILE CLASS
require_once __DIR__ . '/app/media.php';
require_once __DIR__ . '/app/library.php';
require_once __DIR__ . '/app/user.php';

//MENGGUNAKAN NAMESPACE
use FlipPlay\Media;
use FlipPlay\Library;
use FlipPlay\User;

echo "====================================\n";
echo "       FLIPPLAY MEDIA LIBRARY       \n";
echo "====================================\n";

//MEMBUAT OBJECT LIBRARY
$library = new Library();

//MEMBUAT OBJECT MEDIA
$media1 = new Media(
    "Avengers: Endgame",
    "Action",
    2019
);

$media2 = new Media(
    "Interstellar",
    "Sci-Fi",
    2014
);

$media3 = new Media(
    "The Batman",
    "Action",
    2022
);

$media4 = new Media(
    "Inside Out 2",
    "Animation",
    2024
);

//MENAMBAHKAN MEDIA KE LIBRARY
echo "\n[1] MENAMBAHKAN MEDIA\n";

$library->tambahMedia($media1);
$library->tambahMedia($media2);
$library->tambahMedia($media3);
$library->tambahMedia($media4);

//MENAMPILKAN DAFTAR MEDIA
echo "\n[2] DAFTAR MEDIA TERSEDIA\n";

$library->tampilkanMedia();

//MENCARI MEDIA BERDASARKAN JUDUL
echo "\n[3] MENCARI MEDIA\n";

$kataKunci = "Interstellar";

$hasil = $library->cariMedia($kataKunci);

if ($hasil !== null) {
    echo "Media ditemukan!\n";
    echo $hasil->tampilkanInfo() . "\n";
} else {
    echo "Media tidak ditemukan.\n";
}

//MENAMPILKAN DETAIL MEDIA
echo "\n[4] DETAIL MEDIA\n";

echo $media1->tampilkanInfo() . "\n";

//MEMBUAT OBJECT USER
echo "\n[5] KOLEKSI PENGGUNA\n";

$user = new User("Adha");

// Menambahkan media ke koleksi pengguna
$user->tambahKoleksi($media1);
$user->tambahKoleksi($media2);

// Menampilkan nama pengguna
echo "Nama pengguna: " . $user->getNama() . "\n";

// Menampilkan koleksi pengguna
$user->tampilkanKoleksi();

// Menampilkan jumlah koleksi
echo "Jumlah koleksi: " . $user->jumlahKoleksi() . "\n";

//PROGRAM SELESAI
echo "\n====================================\n";
echo "       SIMULASI FLIPPLAY SELESAI    \n";
echo "====================================\n";

?>
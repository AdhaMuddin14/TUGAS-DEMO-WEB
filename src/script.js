
/* =========================================
   1. NAVBAR TOGGLE
========================================= */

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isClosed = navMenu.classList.contains("hidden");

        navMenu.classList.toggle("hidden");
        navMenu.classList.toggle("flex");

        menuToggle.setAttribute("aria-expanded", String(isClosed));
        menuToggle.setAttribute(
            "aria-label",
            isClosed ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 768) {
                navMenu.classList.add("hidden");
                navMenu.classList.remove("flex");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Buka menu navigasi");
            }
        });
    });
}

/* =========================================
   2. VALIDASI CONTACT FORM
========================================= */

const contactForm = document.querySelector("#contact-form");
const namaInput = document.querySelector("#nama");
const emailInput = document.querySelector("#email");
const pesanInput = document.querySelector("#pesan");
const formMessage = document.querySelector("#form-message");

if (contactForm && namaInput && emailInput && pesanInput && formMessage) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        formMessage.textContent = "";
        formMessage.className = "mb-4 text-sm";

        const nama = namaInput.value.trim();
        const email = emailInput.value.trim();
        const pesan = pesanInput.value.trim();

        if (nama.length < 3) {
            formMessage.textContent = "Nama minimal 3 karakter.";
            formMessage.classList.add("text-red-600");
            namaInput.focus();
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            formMessage.textContent = "Masukkan email dengan format yang benar.";
            formMessage.classList.add("text-red-600");
            emailInput.focus();
            return;
        }

        if (pesan.length === 0) {
            formMessage.textContent = "Pesan wajib diisi.";
            formMessage.classList.add("text-red-600");
            pesanInput.focus();
            return;
        }

        formMessage.textContent =
            `Terima kasih, ${nama}! Validasi berhasil.`;
        formMessage.classList.add("text-green-700");

        contactForm.reset();
    });
}

/* =========================================
   3. THE VIBE GRID - FETCH API
========================================= */

const animeGrid = document.querySelector("#anime-grid");
const animeLoading = document.querySelector("#anime-loading");
const animeError = document.querySelector("#anime-error");
const animeErrorMessage = document.querySelector("#anime-error-message");
const retryAnimeButton = document.querySelector("#retry-anime");
const animeSearch = document.querySelector("#search-anime");
const animeResultCount = document.querySelector("#anime-result-count");
const auraButtons = document.querySelectorAll(".aura-btn");

let animeData = [];
let selectedAura = "all";
let isLoadingAnime = false;

async function fetchAnime() {
    if (
        !animeGrid ||
        !animeLoading ||
        !animeError ||
        !animeErrorMessage ||
        !retryAnimeButton
    ) {
        console.error(
            "Elemen The Vibe Grid tidak lengkap. Periksa ID di index.html."
        );
        return;
    }

    if (isLoadingAnime) return;

    isLoadingAnime = true;

    animeLoading.classList.remove("hidden");
    animeError.classList.add("hidden");
    animeGrid.innerHTML = "";
    animeErrorMessage.textContent = "";
    retryAnimeButton.disabled = true;

    if (animeResultCount) {
        animeResultCount.textContent = "";
    }

    try {
        const response = await fetch( //Mengambil data API
            "https://kitsu.io/api/edge/anime?page%5Blimit%5D=20&sort=-userCount&include=genres",
            { signal: AbortSignal.timeout(15000) }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();//Membaca respons

        if (!Array.isArray(result.data) || !Array.isArray(result.included)) {
            throw new Error("Format data anime tidak sesuai.");
        }

        const genreNames = new Map(
            result.included
                .filter((item) => item.type === "genres")
                .map((genre) => [genre.id, genre.attributes.name])
        );

        animeData = result.data.map((item) => {
            const attributes = item.attributes;
            const posterUrl =
                attributes.posterImage?.large ||
                attributes.posterImage?.medium ||
                "";
            const rating = Number(attributes.averageRating);
            const genres = (item.relationships?.genres?.data || [])
                .map((genre) => genreNames.get(genre.id))
                .filter(Boolean)
                .map((name) => ({ name }));

            return {
                title_english:
                    attributes.titles?.en ||
                    attributes.canonicalTitle ||
                    "Judul tidak tersedia",
                title:
                    attributes.canonicalTitle ||
                    attributes.titles?.en ||
                    "Judul tidak tersedia",
                title_japanese: attributes.titles?.ja_jp || "",
                images: {
                    jpg: {
                        large_image_url: posterUrl,
                        image_url: posterUrl
                    }
                },
                episodes: attributes.episodeCount,
                score: Number.isFinite(rating) ? rating / 10 : null,
                genres
            };
        });

        renderAnime();

        console.log(`Berhasil memuat ${animeData.length} anime.`);

    } catch (error) {
        console.error("Gagal mengambil data anime:", error);

        if (error.name === "TimeoutError" || error.name === "AbortError") {
            animeErrorMessage.textContent =
                "Server anime terlalu lama merespons. Silakan coba lagi.";
        } else if (error.message === "HTTP 429") {
            animeErrorMessage.textContent =
                "Permintaan sedang dibatasi oleh server anime. Tunggu sebentar, lalu coba lagi.";
        } else if (error.message.startsWith("HTTP 5")) {
            animeErrorMessage.textContent =
                "Server anime sedang bermasalah. Silakan coba lagi nanti.";
        } else if (error instanceof TypeError) {
            animeErrorMessage.textContent =
                "Browser tidak dapat menghubungi Kitsu API. Periksa koneksi atau coba lagi beberapa saat.";
        } else {
            animeErrorMessage.textContent =
                "Data anime gagal dimuat. Silakan coba lagi beberapa saat.";
        }
        animeError.classList.remove("hidden");
    } finally {
        animeLoading.classList.add("hidden");
        isLoadingAnime = false;
        retryAnimeButton.disabled = false;
    }
}

/* =========================================
   4. SEARCH DAN FILTER AURA
========================================= */

function renderAnime() {
    if (!animeGrid || !animeSearch) return;
    if (animeData.length === 0 && isLoadingAnime) return;

    const keyword = animeSearch.value.trim().toLowerCase();

    const filteredAnime = animeData.filter((anime) => {//Menyaring data anime
        const title = (
            anime.title_english ||
            anime.title ||
            ""
        ).toLowerCase();

        const alternativeTitle = (
            anime.title_japanese || ""
        ).toLowerCase();

        const matchesSearch =
            title.includes(keyword) ||
            alternativeTitle.includes(keyword);

        const genres = (anime.genres || []).map(
            (genre) => genre.name
        );

        let matchesAura = true;

        if (selectedAura === "High Energy") {//Menyimpan filter yang dipilih
            matchesAura = genres.some((genre) =>//Mengecek kecocokan genre
                ["Action", "Adventure", "Sports"].includes(genre)
            );
        } else if (selectedAura === "Melancholy") {
            matchesAura = genres.some((genre) =>
                ["Drama", "Romance"].includes(genre)
            );
        } else if (selectedAura === "Binge Mode") {
            matchesAura =
                anime.episodes === null ||
                anime.episodes >= 24;
        }

        return matchesSearch && matchesAura;
    });

    if (animeResultCount) {
        animeResultCount.textContent =
            `Menampilkan ${filteredAnime.length} dari ${animeData.length} anime`;
    }

    if (filteredAnime.length === 0) {//Menampilkan kartu
        animeGrid.innerHTML = `
            <div class="col-span-full rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                <p class="mb-3 text-3xl">🔎</p>
                <h3 class="font-bold text-slate-800">
                    Anime tidak ditemukan
                </h3>
                <p class="mt-2 text-sm text-slate-500">
                    Coba kata kunci atau filter yang lain.
                </p>
            </div>
        `;
        return;
    }

    animeGrid.innerHTML = filteredAnime.map((anime) => {//Mengubah data menjadi kartu
        const title =
            anime.title_english ||
            anime.title ||
            "Judul tidak tersedia";

        const imageUrl =
            anime.images?.jpg?.large_image_url ||
            anime.images?.jpg?.image_url ||
            "";

        const episodeText =
            anime.episodes == null
                ? "Belum diketahui"
                : anime.episodes;

        const scoreText =
            anime.score == null
                ? "Belum ada rating"
                : anime.score.toFixed(1);

        const genres = (anime.genres || [])
            .slice(0, 3)
            .map((genre) => genre.name)
            .map(escapeHTML)
            .join(" · ");

        const safeImageUrl = imageUrl.startsWith("https://media.kitsu.app/")
            ? escapeHTML(imageUrl)
            : "";

        return `
            <article class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <img
                    src="${safeImageUrl}"
                    alt="${escapeHTML(title)}"
                    class="h-64 w-full bg-slate-100 object-cover"
                    loading="lazy"
                >

                <div class="p-5">
                    <div class="mb-3 flex items-center justify-between gap-2">
                        <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            ANIME
                        </span>
                        <span class="text-sm font-semibold text-amber-500">
                            ★ ${scoreText}
                        </span>
                    </div>

                    <h3 class="mb-2 text-lg font-bold text-slate-800">
                        ${escapeHTML(title)}
                    </h3>

                    <p class="mb-2 text-sm text-slate-500">
                        Episode: ${escapeHTML(episodeText)}
                    </p>

                    <p class="text-xs leading-relaxed text-blue-600">
                        ${genres || "Genre belum tersedia"}
                    </p>
                </div>
            </article>
        `;
    }).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

if (retryAnimeButton) {
    retryAnimeButton.addEventListener("click", fetchAnime);
}

/* =========================================
   5. EVENT SEARCH REAL-TIME
========================================= */

if (animeSearch) {
    animeSearch.addEventListener("input", renderAnime);//Pencarian langsung saat mengetik   
}

/* =========================================
   6. EVENT TOMBOL AURA
========================================= */

auraButtons.forEach((button) => {//Memproses tombol filter
    button.addEventListener("click", () => {
        selectedAura = button.dataset.aura || "all";

        auraButtons.forEach((item) => {
            const isSelected = item === button;
            item.setAttribute("aria-pressed", String(isSelected));

            item.classList.toggle("bg-blue-500", isSelected);
            item.classList.toggle("text-white", isSelected);

            item.classList.toggle("bg-white", !isSelected);
            item.classList.toggle("text-blue-700", !isSelected);
            item.classList.toggle("border", !isSelected);
            item.classList.toggle("border-blue-100", !isSelected);
        });

        renderAnime();
    });
});

/* =========================================
   7. MULAI MEMUAT DATA
========================================= */

if (animeGrid && animeLoading && animeError && animeSearch) {
    fetchAnime();
}

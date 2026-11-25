const postContainer = document.querySelector("#post-container");
const loadingMessage = document.querySelector("#loading-message");
const errorContainer = document.querySelector("#error-container");
const errorMessage = document.querySelector("#error-message");
const reloadButton = document.querySelector("#reload-button");
const retryButton = document.querySelector("#retry-button");
const postCount = document.querySelector("#post-count");

async function fetchPosts() {
    // Tampilkan loading dan sembunyikan error lama
    loadingMessage.classList.remove("hidden");
    errorContainer.classList.add("hidden");
    postContainer.innerHTML = "";
    postCount.textContent = "";
    reloadButton.disabled = true;
    retryButton.disabled = true;

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error("Format data API tidak sesuai.");
        }

        renderPosts(posts);

    } catch (error) {
        console.error("Gagal mengambil data:", error);

        errorMessage.textContent =
            "Data gagal dimuat. Periksa koneksi internet, lalu coba lagi.";

        errorContainer.classList.remove("hidden");

    } finally {
        loadingMessage.classList.add("hidden");
        reloadButton.disabled = false;
        retryButton.disabled = false;
    }
}

function renderPosts(posts) {
    if (posts.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className =
            "col-span-full rounded-xl bg-white p-8 text-center text-slate-500";
        emptyMessage.textContent = "Belum ada postingan yang tersedia.";
        postContainer.replaceChildren(emptyMessage);
        postCount.textContent = "Tidak ada postingan.";
        return;
    }

    const fragment = document.createDocumentFragment();

    posts.forEach((post) => {
        const article = document.createElement("article");
        article.className =
            "post-card rounded-2xl border border-slate-100 bg-white p-6 shadow-sm";

        const badge = document.createElement("span");
        badge.className =
            "mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600";
        badge.textContent = `POST #${post.id}`;

        const title = document.createElement("h3");
        title.className =
            "mb-3 text-lg font-bold leading-relaxed text-blue-700";
        title.textContent = post.title;

        const body = document.createElement("p");
        body.className = "mb-5 text-sm leading-7 text-slate-600";
        body.textContent = post.body;

        const postId = document.createElement("p");
        postId.className = "border-t border-slate-100 pt-4 text-xs text-slate-400";
        postId.textContent = `Post ID: ${post.id}`;

        article.append(badge, title, body, postId);
        fragment.append(article);
    });

    postContainer.replaceChildren(fragment);

    postCount.textContent =
        `Berhasil menampilkan ${posts.length} postingan`;
}

// Tombol muat ulang
reloadButton.addEventListener("click", fetchPosts);

// Tombol coba lagi ketika terjadi error
retryButton.addEventListener("click", fetchPosts);

// Ambil data ketika halaman pertama kali dibuka
fetchPosts();

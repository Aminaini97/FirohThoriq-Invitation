// === 1. VARIABEL & SETUP AWAL ===
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const heroVideo = document.getElementById('heroVideo');
const weddingDate = new Date("Jan 16, 2026 08:00:00").getTime();

// =========================================
// 0. SPLASH SCREEN & DYNAMIC NAME LOGIC
// =========================================

document.addEventListener("DOMContentLoaded", function() {
    
    // A. FUNGSI AMBIL NAMA DARI URL (Contoh: ?to=Budi+Santoso)
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        // Decode agar spasi (+) terbaca benar
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // B. TAMPILKAN NAMA DI SPLASH SCREEN
    const guestNameElement = document.getElementById('guestName');
    // Ambil parameter 'to' dari URL
    const urlName = getParameterByName('to');

    if (urlName) {
        // Jika ada nama di URL, pakai nama itu
        guestNameElement.innerText = urlName;
    } else {
        // Jika tidak ada, pakai default
        guestNameElement.innerText = "Tamu Undangan";
    }


    // C. LOGIKA TOMBOL BUKA UNDANGAN
    const splashScreen = document.getElementById('splash-screen');
    const openBtn = document.getElementById('openBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (openBtn) {
        openBtn.addEventListener('click', function() {
            // 1. Hilangkan Splash Screen (tambah class 'hide')
            splashScreen.classList.add('hide');

            // 2. Mulai Putar Musik (Karena browser butuh interaksi user dulu)
            const mobileContainer = document.querySelector('.mobile-container');
            
            if (mobileContainer) {
            // BUKA KUNCI SAAT TOMBOL DIKLIK
            mobileContainer.style.overflowY = 'auto'; 
            mobileContainer.style.height = 'auto'; // Atau biarkan 100vh jika scroll di dalam
            mobileContainer.style.scrollBehavior = 'smooth';
            }

            if (bgMusic) {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicBtn.classList.add('playing');
                    musicIcon.classList.remove('fa-music');
                    musicIcon.classList.add('fa-compact-disc');
                }).catch(error => {
                    console.log("Autoplay diblokir browser, menunggu interaksi music fab.");
                });
            }
            
            // Opsional: Hapus splash screen dari DOM setelah animasi selesai biar ringan
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 1000); // Tunggu 1 detik sesuai durasi transisi CSS
        });
    }

});

// === LOGIKA MUSIK TERPISAH (FLOATING ICON) ===

const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');

let isMusicPlaying = false;

// 1. Fungsi Toggle (Nyalakan/Matikan)
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        musicBtn.classList.remove('playing'); // Stop putar
        musicIcon.classList.remove('fa-compact-disc');
        musicIcon.classList.add('fa-music'); // Balik ikon not
    } else {
        bgMusic.play();
        isMusicPlaying = true;
        musicBtn.classList.add('playing'); // Mulai putar
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-compact-disc'); // Ganti ikon piringan
    }
}

// 2. Event Listener Tombol
if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
}

// 3. Autoplay Attempt (Coba nyalakan otomatis saat load)
window.addEventListener('load', () => {
    bgMusic.play().then(() => {
        // SUKSES AUTOPLAY
        isMusicPlaying = true;
        musicBtn.classList.add('playing');
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-compact-disc');
    }).catch(error => {
        // GAGAL AUTOPLAY (Browser memblokir suara)
        // Biarkan tombol diam/pulse, menunggu diklik tamu
        console.log("Menunggu interaksi tamu untuk memutar musik.");
    });
});

// Status awal (True karena video autoplay)
let isPlaying = true;

// === 2. FUNGSI TOMBOL PLAY/PAUSE ===
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            heroVideo.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            isPlaying = false;
        } else {
            heroVideo.play();
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            isPlaying = true;
        }
    });
}

// === 3. COUNTDOWN TIMER ===
const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");

    if (elDays) elDays.innerHTML = days;
    if (elHours) elHours.innerHTML = hours < 10 ? "0" + hours : hours;
    if (elMinutes) elMinutes.innerHTML = minutes < 10 ? "0" + minutes : minutes;
    if (elSeconds) elSeconds.innerHTML = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
        clearInterval(countdownInterval);
        if (elDays) elDays.innerHTML = "00";
        if (elHours) elHours.innerHTML = "00";
        if (elMinutes) elMinutes.innerHTML = "00";
        if (elSeconds) elSeconds.innerHTML = "00";
    }
}, 1000);

// === 4. ANIMASI TEKS UNDANGAN (FADE UP SIMPEL) ===
const inviteLines = document.querySelectorAll('.invitation-message');

const inviteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Cukup tambahkan class 'show-animate'
            entry.target.classList.add('show-animate');
            // Stop mengamati
            inviteObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); // Muncul saat 50% teks terlihat

inviteLines.forEach(line => {
    inviteObserver.observe(line);
});

// === 5. ANIMASI MINI PLAYER CARD ===
const miniCard = document.querySelector('.mini-spotify-card');
if (miniCard) {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animate');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    cardObserver.observe(miniCard);
}

// === 6. ANIMASI KARTU ARTIS (COUPLE) ===
const coupleCards = document.querySelectorAll('.single-artist-card');
const coupleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-animate');
            coupleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.30 });

coupleCards.forEach(card => {
    coupleObserver.observe(card);
});

// === 7. ANIMASI GALERI FOTO ===
// HAPUS BAGIAN INI KARENA SUDAH TIDAK DIPAKAI (VERSI HORIZONTAL)
// === 7. ANIMASI GALERI FOTO ===
const galleryOptions = {
    root: document.querySelector('.horizontal-scroll'),
    rootMargin: '0px',
    threshold: 0.75
};

const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
        } else {
            entry.target.classList.remove('is-active');
        }
    });
}, galleryOptions);

const galleryCards = document.querySelectorAll('.gallery-card');
galleryCards.forEach(card => {
    galleryObserver.observe(card);
});

// === 8. ANIMASI TOUR/EVENT (MUNCUL BERURUTAN) ===
const tourElements = document.querySelectorAll('.tour-animate');

const tourObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Tambahkan class show-animate agar muncul
            entry.target.classList.add('show-animate');
            // Stop mengamati
            tourObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 }); // Muncul begitu 10% terlihat

tourElements.forEach(el => {
    tourObserver.observe(el);
});

// === 9. ANIMASI BAGIAN BAWAH (GALLERY GRID & CLOSING) ===
// Ini yang bikin foto muncul gantian & logo Spotify membal
const bottomElements = document.querySelectorAll('.bottom-animate');

const bottomObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Beri sedikit jeda biar smooth
            setTimeout(() => {
                entry.target.classList.add('show-animate');
            }, 100);
            
            // Stop mengamati setelah animasi jalan
            bottomObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 }); // Muncul saat 10% terlihat

bottomElements.forEach(el => {
    bottomObserver.observe(el);
});

// === 10. FUNGSI COPY TO CLIPBOARD (VERSI ANTI-GAGAL) ===
function copyText(elementId, btnElement) {
    // 1. Ambil elemen teks berdasarkan ID
    const textElement = document.getElementById(elementId);
    
    // Cek apakah elemen ada?
    if (!textElement) {
        console.error("ID tidak ditemukan: " + elementId);
        return;
    }

    const textToCopy = textElement.innerText;

    // 2. Buat elemen textarea sementara (Trik agar bisa copy di semua HP)
    const tempInput = document.createElement("textarea");
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    
    // 3. Pilih teksnya
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Khusus agar jalan di HP

    // 4. Salin (Execute Command)
    try {
        document.execCommand("copy");
        
        // --- EFEK VISUAL BERHASIL ---
        const originalText = btnElement.innerHTML;
        // Ganti teks tombol & warna
        btnElement.innerHTML = '<i class="fas fa-check"></i> Disalin!';
        btnElement.style.backgroundColor = '#1ed760'; /* Hijau Spotify */
        btnElement.style.color = '#fff';
        btnElement.style.borderColor = '#1ed760';

        // Balikin lagi setelah 2 detik
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.backgroundColor = ''; 
            btnElement.style.color = '';
            btnElement.style.borderColor = '';
        }, 2000);

    } catch (err) {
        console.error("Gagal menyalin", err);
        alert("Gagal menyalin otomatis. Silakan salin manual.");
    }

    // 5. Hapus elemen sementara
    document.body.removeChild(tempInput);
}
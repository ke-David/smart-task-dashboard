
let celebrationIndex = 0;
const toggle = document.getElementById("celebration-toggle");
const celebrations = [
    {
        banner: "🎉 TASK COMPLETED! YOU ABSOLUTE MACHINE 🔥",
        meme: "static/pictures/dicaprio.png",
        sound: "static/sounds/gatsby.mp3"
    },
    {
        banner: "💪 WELL DONE! 🙌",
        meme: "static/pictures/dance.gif",
        sound: "static/sounds/dance.mp3"
    },
    {
        banner: "🐊 JUST A COOL CROC BECAUSE YOU DESERVE IT 🐊",
        meme: "static/pictures/crocodile.jpg",
        sound: "static/sounds/hawaii.mp3"
    }
];


export function ultimateCelebration() {

    if (!celebrationsEnabled()) return;

    // can be randomized later
    const current = celebrations[celebrationIndex];

    showCelebrationBanner(current.banner);
    showMeme(current.meme);
    playSuccessSound(current.sound);
    fireConfetti();

    celebrationIndex = (celebrationIndex + 1) % celebrations.length;
}

function celebrationsEnabled() {
    return localStorage.getItem("celebrationsEnabled") !== "false";
}

function fireConfetti() {
    confetti({
        particleCount: 200,
        spread: 120,
        startVelocity: 45,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 160,
            origin: { y: 0.3 }
        });
    }, 250);
}

function playSuccessSound(src) {
    const audio = new Audio(src);
    audio.volume = 0.6;
    audio.currentTime = 0; // allows rapid replay
    audio.play().catch(() => {});
}

function showCelebrationBanner(text) {
    const banner = document.getElementById("celebration-banner");
    banner.textContent = text;

    banner.classList.remove("hidden");
    void banner.offsetWidth; // forces reflow
    banner.classList.add("show-banner");

    setTimeout(() => {
        banner.classList.add("hidden");
        banner.classList.remove("show-banner");
    }, 4000);
}

let memeTimer;

function showMeme(src) {
    const meme = document.getElementById("meme-overlay");
    meme.src = src;

    meme.classList.remove("hidden");
    meme.classList.remove("show-meme");

    void meme.offsetWidth;  // resets animation, so it s guaranteed it will play every time
    meme.classList.add("show-meme");

    memeTimer = setTimeout(() => {
        meme.classList.add("hidden");
        meme.classList.remove("show-meme");
    }, 4500);
}
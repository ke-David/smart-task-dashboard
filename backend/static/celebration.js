
export function ultimateCelebration() {
    showCelebrationBanner();
    showMeme();
    playSuccessSound();
    fireConfetti();
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

function playSuccessSound() {
    const audio = new Audio("static/sounds/gatsby.mp3");
    audio.volume = 0.6;
    audio.currentTime = 0; // allows rapid replay
    audio.play().catch(() => {});
}

function showCelebrationBanner() {
    const banner = document.getElementById("celebration-banner");

    banner.classList.remove("hidden");
    // void banner.offsetWidth; // forces reflow
    banner.classList.add("show-banner");

    // // restart animation
    // banner.style.animation = "none";
    // banner.offsetHeight; // force reflow
    // banner.style.animation = null;

    setTimeout(() => {
        banner.classList.add("hidden");
        banner.classList.remove("show-banner");
    }, 4000);
}

// function showCelebrationBanner() {
//   const banner = document.getElementById("celebration-banner");

//   console.log("Banner found:", banner);
//   console.log("Before remove:", banner.classList);

//   banner.classList.remove("hidden");

//   console.log("After remove:", banner.classList);

//   setTimeout(() => {
//     banner.classList.add("hidden");
//     console.log("Banner hidden again");
//   }, 4000);
// }

let memeTimer;


function showMeme() {
    const meme = document.getElementById("meme-overlay");


    meme.classList.remove("hidden");
    meme.classList.remove("show-meme");

    void meme.offsetWidth;  // resets animation, so it s guaranteed it will play every time
    meme.classList.add("show-meme");

    memeTimer = setTimeout(() => {
        meme.classList.add("hidden");
        meme.classList.remove("show-meme");
    }, 4500);
}
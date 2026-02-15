
export function ultimateCelebration() {
    showCelebrationBanner();
    showMeme();
//   celebrateCompletion();
//   playSuccessSound();
//   fireConfetti();
//   showMeme();
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

function showMeme() {
    const meme = document.getElementById("meme-overlay");

    meme.classList.remove("hidden");
    meme.classList.add("show-meme");

    setTimeout(() => {
        meme.classList.add("hidden");
        meme.classList.remove("show-meme");
    }, 4000);
}
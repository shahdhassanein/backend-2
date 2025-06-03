const video = document.getElementById("hero-video");
const videos = [
    "assests/videos/videoonespeed.mp4",
    "assests/videos/lambodriving.mp4"
];
let currentVideoIndex = 0;

video.addEventListener("ended", () => {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    video.src = videos[currentVideoIndex];
video.play(); 
});

function playSound(soundFile) {
const sound = new Audio(`assests/sounds/${soundFile}.mp3`); 
    sound.play();
}

const bestSellerImages = [
    "car2.png",  
    "car12.png",
    "car9.png" 
];

let currentBestSellerIndex = 0; 

function changeBestSellerImage() {
    const bestSellerImg = document.getElementById("best-seller-image");
    
    currentBestSellerIndex = (currentBestSellerIndex + 1) % bestSellerImages.length;

    bestSellerImg.src = bestSellerImages[currentBestSellerIndex];
}


const videoElement= document.getElementById('hero-video');
const videos=["/img/videoonespeed.mp4", "/img/lambodriving.mp4"];
let currentVideoIndex=0;

if(videoElement){
    videoElement.addEventListener("ended",()=>{
        currentVideoIndex=(currentVideoIndex+1) % videos.length;
        videoElement.src =videos[currentVideoIndex];
        videoElement.play();
    });
} else {
    console.error("Hero video element not found");
}


function playSound(soundId){
    const sound =new Audio('/img/${soundId}.mp3');
        spund.play();
}

const bestSellerImages = [
    "/img/car12.png", 
    "/img/car9.png",  
    "/img/car13.png"  
    
];

let currentBestSellerIndex = 0;

function changeBestSellerImage() {
    const bestSellerImg = document.getElementById("best-seller-image");

    if (bestSellerImg) { // Check if the image element exists
        currentBestSellerIndex = (currentBestSellerIndex + 1) % bestSellerImages.length;
        bestSellerImg.src = bestSellerImages[currentBestSellerIndex];
    } else {
        console.error("Best seller image element not found!");
    }
}
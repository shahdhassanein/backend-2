const videoElement= document.getElementById('hero-video');
const videos=["/img/lambodriving.mp4"];
let currentVideoIndex=0;

if(!videoElement){
    

// Video autoplay and looping
const videoElement = document.getElementById('hero-video');
const videos = ["/img/videoonespeed.mp4", "/img/lambodriving.mp4"];
let currentVideoIndex = 0;

if (videoElement) {
    videoElement.addEventListener("ended", () => {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        videoElement.src = videos[currentVideoIndex];
        videoElement.play();
    });
} else {
    console.error("Hero video element not found");
}

// Play sound function
function playSound(soundId) {
    const sound = new Audio(`/img/${soundId}.mp3`); // Corrected template literal syntax and variable name
    sound.play(); // <<< FIXED TYPO: Changed 'spund.play()' to 'sound.play()'
} }

// Best Seller Image Changer
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

// --- Cookie Consent Banner Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookieConsentBanner');
    const acceptBtn = document.getElementById('acceptCookiesBtn');
    const denyBtn = document.getElementById('denyCookiesBtn');

    // Helper function to set a client-side cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")   + expires + "; path=/";
    }

    // Helper function to get a cookie value
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';'); // Split all cookies by semicolon
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Remove leading spaces
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Found the cookie
        }
        return null; // Cookie not found
    }

    // Check if user has already made a consent choice (accepted or denied)
    const consentStatus = getCookie('cookie_consent_status');
    if (consentStatus === 'accepted' || consentStatus === 'denied') {
        cookieBanner.style.display = 'none'; // Hide banner if a choice has been made
    } else {
        cookieBanner.style.display = 'flex'; // Show banner if no choice yet
    }

    // Event listener for Accept button click
    acceptBtn.addEventListener('click', async () => {
        setCookie('cookie_consent_status', 'accepted', 365); // Set client-side cookie to remember choice for 1 year
        cookieBanner.style.display = 'none'; // Hide the banner immediately

        // Send request to backend to record consent in MongoDB (for logged-in user)
        // This fetch call will rely on the browser automatically sending the JWT token cookie
        // that was set during login.
        try {
            const response = await fetch('/api/consent/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) { // Check if the response status is 2xx (success)
                const data = await response.json();
                if (data.success) {
                    console.log('Backend recorded cookie consent (accepted).');
                } else {
                    console.error('Failed to record cookie consent in backend:', data.message);
                }
            } else { // If response is not ok (e.g., 401 Unauthorized if not logged in)
                console.warn(`Backend consent API call failed with status: ${response.status}. This is expected if not logged in.`);
                // The DB update only happens if the user is logged in because the /api/consent/accept route is protected.
            }
        } catch (error) {
            console.error('Error sending consent to backend:', error);
        }
    });

    // Event listener for Deny button click
    denyBtn.addEventListener('click', () => {
        setCookie('cookie_consent_status', 'denied', 365); // Set client-side cookie to remember choice for 1 year
        cookieBanner.style.display = 'none'; // Hide the banner immediately
        console.log('User denied cookie consent. No non-essential cookies will be set and no backend update.'); 
    });
});
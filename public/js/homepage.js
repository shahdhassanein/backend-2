// public/js/homepage.js

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
    const sound = new Audio(`/img/${soundId}.mp3`);
    sound.play();
}

// Best Seller Image Changer
const bestSellerImages = [
    "/img/car12.png",
    "/img/car9.png",
    "/img/car13.png"
];

let currentBestSellerIndex = 0;

function changeBestSellerImage() {
    const bestSellerImg = document.getElementById("best-seller-image");

    if (bestSellerImg) {
        currentBestSellerIndex = (currentBestSellerIndex + 1) % bestSellerImages.length;
        bestSellerImg.src = bestSellerImages[currentBestSellerIndex];
    } else {
        console.error("Best seller image element not found!");
    }
}

// --- Cookie Consent Banner Logic (UPDATED FOR USER-SPECIFIC CONSENT) ---
document.addEventListener('DOMContentLoaded', async () => { // Made async to await fetch calls
    const cookieBanner = document.getElementById('cookieConsentBanner');
    const acceptBtn = document.getElementById('acceptCookiesBtn');
    const denyBtn = document.getElementById('denyCookiesBtn');

    // Hide banner by default until status is checked
    if (cookieBanner) {
        cookieBanner.style.display = 'none';
    } else {
        console.error("Cookie consent banner element not found!");
        return; // Exit if banner element is missing
    }

    // Function to check consent status from the backend
    async function checkConsentFromBackend() {
        try {
            // Attempt to fetch consent status. This route is protected.
            // If the user is NOT logged in, the backend's 'protect' middleware
            // will redirect to /login or respond with 401.
            const response = await fetch('/api/consent/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // If backend redirects to login (due to protect middleware),
            // the fetch API usually throws an error or returns a non-200 status.
            // For a GET request for status, we should check the actual response.
            if (response.ok) {
                const data = await response.json();
                console.log(`[Homepage JS] Consent status from backend: ${data.hasAccepted}`);
                if (!data.hasAccepted) {
                    cookieBanner.style.display = 'flex'; // Show banner if consent not accepted
                } else {
                    cookieBanner.style.display = 'none'; // Hide if already accepted
                }
            } else if (response.status === 401 || response.redirected) {
                // If 401 (unauthorized) or redirected (e.g., to login page),
                // it means the user is not logged in or token expired.
                // In this case, we should show the banner as consent is not known/given for current session.
                console.warn(`[Homepage JS] Not logged in or session expired. Showing cookie banner for new user/session.`);
                cookieBanner.style.display = 'flex';
            } else {
                console.error(`[Homepage JS] Error checking consent status. Status: ${response.status}`);
                // Default to showing banner if there's an unexpected error
                cookieBanner.style.display = 'flex';
            }
        } catch (error) {
            console.error('[Homepage JS] Network error checking consent status:', error);
            // Default to showing banner if there's a network error
            cookieBanner.style.display = 'flex';
        }
    }

    // Check consent status on page load
    await checkConsentFromBackend(); // Await this call to ensure banner is correctly set before other interactions

    // Event listener for Accept button click
    acceptBtn.addEventListener('click', async () => {
        cookieBanner.style.display = 'none'; // Hide the banner immediately

        // Send request to backend to record consent in MongoDB (for logged-in user)
        try {
            const response = await fetch('/api/consent/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('Backend recorded cookie consent (accepted).');
                } else {
                    console.error('Failed to record cookie consent in backend:', data.message);
                }
            } else {
                console.warn(`Backend consent API call failed with status: ${response.status}. This is expected if not logged in.`);
            }
        } catch (error) {
            console.error('Error sending consent to backend:', error);
        }
    });

    // Event listener for Deny button click
    denyBtn.addEventListener('click', () => {
        cookieBanner.style.display = 'none'; // Hide the banner immediately
        console.log('User denied cookie consent. No backend update for denial.');
        // No client-side cookie is set here, nor a backend call for denial,
        // so the banner will reappear for this user next time they load if they aren't logged in
        // or haven't accepted.
    });
});
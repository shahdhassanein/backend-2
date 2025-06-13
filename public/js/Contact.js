// public/js/Contact.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const address = formData.get('address');
            const message = formData.get('message');

            // --- Frontend Validation (if any) ---
            // If you have client-side validation, it would go here.
            // Example:
            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message).');
                return; // Stop if validation fails
            }
            // --- End Frontend Validation ---

            // Optional: Visually indicate sending state (good UX)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            try {
                // Log the data being sent to the backend
                console.log("Frontend: Attempting to send data:", { name, email, phone, address, message }); // <--- IMPORTANT NEW LOG

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        address,
                        message
                    })
                });

                // Log the raw response status from the backend
                console.log("Frontend: Raw response status:", response.status); // <--- IMPORTANT NEW LOG

                // Try to parse the response as JSON. This might throw an error if the response isn't JSON.
                const data = await response.json();
                console.log("Frontend: Parsed response data:", data); // <--- IMPORTANT NEW LOG

                if (response.ok) { // `response.ok` is true for 2xx status codes
                    alert(data.message || 'Message sent successfully!'); // Use message from backend or a default
                    contactForm.reset(); // Clear the form on success
                } else {
                    // Log and display specific error message from backend
                    console.error("Frontend: Backend responded with an error:", data.message || 'Unknown error from server.'); // <--- IMPORTANT NEW LOG
                    alert(`Error: ${data.message || 'Failed to send message. Please try again.'}`);
                }

            } catch (error) {
                // This 'catch' block handles network errors (e.g., server not running)
                // OR errors if the response from the server is NOT valid JSON
                console.error('Frontend: Error during fetch operation or JSON parsing:', error); // <--- IMPORTANT NEW LOG
                alert('An unexpected error occurred. Please check your network and try again.');
            } finally {
                // Re-enable the button and reset its text regardless of success or failure
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }
        });
    } else {
        console.error("Contact.js: Form element with ID 'contact-form' not found.");
    }
});
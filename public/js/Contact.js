// public/js/Contact.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // <-- THIS IS CRITICAL TO STOP DATA IN URL
            // The issue with data in URL comes from this line not executing or being overridden.

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone'); // Now present in HTML
            const address = formData.get('address'); // Now present in HTML
            const message = formData.get('message');

            try {
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

                const data = await response.json();

                if (response.ok) { // Check for 2xx status codes
                    alert(data.message);
                    contactForm.reset();
                } else {
                    alert(`Error: ${data.message}`); // Display backend's error message
                }

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                alert('Could not connect to the server. Please try again later.');
            }
        });
    }
});
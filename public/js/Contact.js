const contactForm = document.getElementById('contact-form');
const nameInput = contactForm.querySelector('input[name="name"]');
const emailInput = contactForm.querySelector('input[name="email"]');
const messageInput = contactForm.querySelector('textarea[name="message"]');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
        alert('All fields are required!');
        return;
    }

    alert('Thank you for contacting us! We will get back to you soon.');

    contactForm.reset();
});
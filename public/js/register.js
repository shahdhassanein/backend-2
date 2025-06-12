document.getElementById('register-form').addEventListener('submit', async (e) => {
    // مهمة جدًا علشان ما يعملش refresh
 e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
    });

    const result = await response.json();
    if (response.ok) {
        alert('✅ Registered successfully');
    } else {
        console.error('❌ Error:', result.error);
    }
});

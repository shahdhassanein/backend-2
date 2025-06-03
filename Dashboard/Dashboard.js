// Tab Switching Logic
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll('.nav-menu li');
    const sections = document.querySelectorAll('.dashboard-section');

    // Initialize with mock user data
    initializeUserData();

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Set active on selected
            item.classList.add('active');
            const target = item.getAttribute('data-tab');
            if (target) {
                const targetSection = document.getElementById(target);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            }
        });
    });

    // Logout functionality
    const logoutButton = document.querySelector('.nav-menu li:nth-child(5)');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear any sensitive session data
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Load cart data if exists
    loadCartData();
});

// Initialize user profile with mock data
function initializeUserData() {
    const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, New York, NY 10001"
    };
    
    // Set form values
    document.getElementById('name').value = userData.name;
    document.getElementById('email').value = userData.email;
    document.getElementById('address').value = userData.address;
    
    // Save to session storage
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Toggle Edit Mode for Profile Section
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profile-section input, #profile-section select');
    const editBtn = document.querySelector('.edit-btn');
    
    if (inputs[0].disabled) {
        // Entering edit mode
        inputs.forEach(input => {
            input.disabled = false;
        });
        editBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    } else {
        // Saving changes
        inputs.forEach(input => {
            input.disabled = true;
        });
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        
        // Save updated profile data
        const updatedUserData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };
        
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Show success message
        showNotification('Profile updated successfully!');
    }
}

// Show notification message
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and show
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load cart data from localStorage
function loadCartData() {
    const cartData = localStorage.getItem('cartItems');
    if (cartData) {
        const cartItems = JSON.parse(cartData);
        // Update notification badge with cart count
        const badges = document.querySelectorAll('.badge');
        if (badges.length > 0) {
            badges[0].textContent = cartItems.length;
        }
    }
}
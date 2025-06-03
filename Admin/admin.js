// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab switching
    initializeTabs();
    
    // Initialize modal functionality
    initializeModals();
    
    // Initialize sidebar toggle for mobile
    initializeSidebar();
    
    // Function to initialize the tab switching
    function initializeTabs() {
        const navItems = document.querySelectorAll('.admin-nav li');
        const contentSections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            // Skip the logout item
            if (item.classList.contains('logout')) {
                item.addEventListener('click', handleLogout);
                return;
            }
            
            item.addEventListener('click', function() {
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked nav item
                this.classList.add('active');
                
                // Get the target section
                const targetSection = this.getAttribute('data-tab');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the target section
                document.getElementById(targetSection).classList.add('active');
            });
        });
        
        // Initialize settings tabs
        const settingsMenuItems = document.querySelectorAll('.settings-menu li');
        const settingsPanels = document.querySelectorAll('.settings-panel');
        
        settingsMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all menu items
                settingsMenuItems.forEach(menu => menu.classList.remove('active'));
                
                // Add active class to clicked menu item
                this.classList.add('active');
                
                // Get index of clicked item
                const index = Array.from(settingsMenuItems).indexOf(this);
                
                // Hide all panels
                settingsPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
                
                // Show the panel at the same index
                settingsPanels[index].classList.add('active');
            });
        });
    }
    
    // Function to initialize modal functionality
    function initializeModals() {
        // Get all modal triggers
        const addCarBtn = document.querySelector('.add-car-btn');
        const closeModalBtns = document.querySelectorAll('.close-modal, .modal-footer .cancel-btn');
        const modal = document.getElementById('add-car-modal');
        
        // Open modal when add car button is clicked
        if (addCarBtn) {
            addCarBtn.addEventListener('click', function() {
                openModal(modal);
            });
        }
        
        // Close modal when close button is clicked
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeModal(modal);
            });
        });
        
        // Close modal when clicked outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
        
        // Initialize file upload
        const fileInput = document.getElementById('car-image');
        const fileLabel = document.querySelector('.file-upload label span');
        
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    fileLabel.textContent = this.files[0].name;
                } else {
                    fileLabel.textContent = 'Choose Image';
                }
            });
        }
    }
    
    // Function to initialize sidebar toggle for mobile
    function initializeSidebar() {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.admin-header').prepend(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            sidebar.classList.toggle('expanded');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Function to open modal
    function openModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close modal
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Function to handle logout
    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Redirect to login page
            window.location.href = '../login/login.html';
        }
    }
    
    // Initialize edit and delete actions for inventory
    initializeInventoryActions();
    
    function initializeInventoryActions() {
        // Get all edit buttons in inventory
        const editButtons = document.querySelectorAll('.inventory-table .actions button:first-child');
        const deleteButtons = document.querySelectorAll('.inventory-table .actions button:last-child');
        
        // Add click event to edit buttons
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const carName = row.querySelector('td:nth-child(2)').textContent;
                
                // Here you would typically open a modal with the car data pre-filled
                alert(`Edit car: ${carName}`);
            });
        });
        
        // Add click event to delete buttons
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const carName = row.querySelector('td:nth-child(2)').textContent;
                
                if (confirm(`Are you sure you want to delete ${carName}?`)) {
                    // Here you would typically send an API request to delete the car
                    row.remove();
                    
                    // Show a notification
                    showNotification(`${carName} has been deleted`);
                }
            });
        });
    }
    
    // Function to show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#1cc88a',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '5px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: '300px',
            zIndex: '1000',
            transform: 'translateY(100px)',
            opacity: '0',
            transition: 'transform 0.3s ease, opacity 0.3s ease'
        });
        
        // Add notification to document
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            
            // Remove notification after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            
            // Remove notification after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Mock data for charts
    initializeMockCharts();
    
    function initializeMockCharts() {
        // This is a placeholder function that would normally initialize charts
        // Using a real charting library like Chart.js or D3.js
        
        // For now, let's just update some of the stats with random values
        
        // Update the stats
        setInterval(() => {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                // Only update number stats (not currency)
                if (!stat.textContent.includes('$')) {
                    const currentValue = parseInt(stat.textContent);
                    const newValue = currentValue + Math.floor(Math.random() * 10) - 5;
                    
                    // Don't let the value go below 0
                    stat.textContent = Math.max(0, newValue);
                }
            });
        }, 10000); // Update every 10 seconds
    }
    
    // Search functionality
    initializeSearch();
    
    function initializeSearch() {
        const searchInputs = document.querySelectorAll('.search-bar input, .search-filter input, .orders-filter input, .customers-filter input');
        
        searchInputs.forEach(input => {
            input.addEventListener('keyup', function() {
                const searchValue = this.value.toLowerCase();
                const table = this.closest('section').querySelector('table');
                
                if (!table) return;
                
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
});
<<<<<<< HEAD
// public/js/admin.js

// ==== Global Variables & Initial Setup ====
const currentUser = window.currentUser; // Assuming currentUser is set globally in your EJS or via a script
const baseUrl = ''; // Base URL if your API is on a different domain/path, otherwise keep empty
const currentSectionTitle = document.getElementById('current-section-title');

// Helper function to display messages
function displayMessage(element, text, isSuccess) {
    element.textContent = text;
    element.style.color = isSuccess ? 'green' : 'red';
    element.style.display = 'block';
    setTimeout(() => {
        element.textContent = '';
        element.style.display = 'none';
    }, 3000); // Message disappears after 3 seconds
}

// ==== Access logged-in user data & Display Admin Name ====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Logged-in admin:', currentUser);

    if (currentUser && currentUser.name) {
        const adminNameElement = document.getElementById('admin-name');
        if (adminNameElement) {
            adminNameElement.textContent = `Welcome, ${currentUser.name}`;
        }
    }

    // ==== Logout functionality ====
    document.getElementById('logout').addEventListener('click', async function() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
                credentials: 'include' // Include cookies for session management
            });

            if (response.ok) {
                window.location.href = '/login'; // Redirect to login after successful logout
            } else {
                console.error('Logout failed:', response.statusText);
                alert('Logout failed. Please try again.'); // Using alert as a fallback, consider custom modal
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred during logout.'); // Using alert as a fallback
        }
    });

    // ==== Tab Switching Logic ====
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const tabContents = document.querySelectorAll('.main-content .tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.dataset.tab; // Get the data-tab attribute

            // Skip if it's the logout link or if no tabId
            if (!tabId) return;

            // Remove 'active' from all nav items and tab contents
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Add 'active' to the clicked nav item and corresponding tab content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Update the main content header title
            currentSectionTitle.textContent = this.textContent.trim(); // Use trimmed text content of li
            if (currentSectionTitle.textContent.includes('Cars')) {
                currentSectionTitle.textContent = 'Cars Management';
                fetchCars(); // Fetch cars when switching to Cars Management tab
            } else if (currentSectionTitle.textContent.includes('Users')) {
                currentSectionTitle.textContent = 'Users Management';
                fetchUsers(); // Fetch users when switching to Users Management tab
            } else if (currentSectionTitle.textContent.includes('Orders')) {
                currentSectionTitle.textContent = 'Orders Management';
                // fetchOrders(); // Call fetchOrders if you implement it
            }
        });
    });

    // Initial load: Activate the first tab (Cars Management) and fetch cars
    const initialTab = document.querySelector('.sidebar nav ul li.active');
    if (initialTab) {
        initialTab.click(); // Trigger click on initial tab to set content and title
    } else {
        // Fallback if no active class is set initially
        fetchCars();
        currentSectionTitle.textContent = 'Cars Management';
    }

    // ==== CARS MANAGEMENT LOGIC (Existing) ====

    // ==== Fetch Cars Function ====
    async function fetchCars() {
        try {
            const response = await fetch(`${baseUrl}/addcars/all`); // Ensure this matches your route
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cars = await response.json();

            const carsGrid = document.getElementById('cars-grid');
            carsGrid.innerHTML = ''; // Clear grid before adding

            if (cars.length === 0) {
                carsGrid.innerHTML = '<p>No cars found. Add a new car using the "Add New Car" button.</p>';
                return;
            }

            cars.forEach(car => {
                const carCard = document.createElement('div');
                carCard.classList.add('car-card');
                carCard.innerHTML = `
                    <img src="${car.image || 'https://placehold.co/200x150/e0e0e0/ffffff?text=No+Image'}" alt="${car.name}">
                    <h3>${car.name}</h3>
                    <p>Model: ${car.model}</p>
                    <p>Price: $${car.price}</p>
                    <p>Engine: ${car.engine}</p>
                    <p>Color: ${car.color}</p>
                    <p style="font-size: 0.8em; color: #666;">ID: ${car._id}</p>
                `;
                carsGrid.appendChild(carCard);
            });
        } catch (err) {
            console.error('Failed to load cars:', err);
            document.getElementById('cars-grid').innerHTML = '<p style="color: red;">Failed to load cars. Please check server connection.</p>';
        }
    }

    // ==== ADD CAR ====
    const addPopup = document.getElementById('addPopup');
    const addBtn = document.getElementById('add-car-btn');
    const closeAdd = document.querySelector('.close-add');
    const addForm = document.getElementById('add-car-form');
    const addMessage = document.getElementById('add-message');

    addBtn.onclick = () => { addPopup.style.display = 'block'; };
    closeAdd.onclick = () => { addPopup.style.display = 'none'; addForm.reset(); addMessage.textContent = ''; };

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newCar = {
            name: document.getElementById('addName').value,
            model: document.getElementById('addModel').value,
            price: document.getElementById('addPrice').value,
            engine: document.getElementById('addEngine').value,
            color: document.getElementById('addColor').value,
            image: document.getElementById('addImage').value
        };

        try {
            const res = await fetch(`${baseUrl}/addcars/addcars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newCar)
            });
            const data = await res.json();

            if (res.ok) {
                displayMessage(addMessage, 'Car added successfully!', true);
                addForm.reset();
                fetchCars();
                setTimeout(() => { addPopup.style.display = 'none'; }, 2000);
            } else {
                displayMessage(addMessage, data.error || data.message || 'Failed to add car.', false);
            }
        } catch (err) {
            displayMessage(addMessage, 'Server error.', false);
            console.error('Add car fetch error:', err);
        }
    });

    // ==== REMOVE CAR ====
    const removeBtn = document.getElementById("remove-car-btn");
    const removePopup = document.getElementById("removePopup");
    const closeRemove = document.querySelector(".close-remove");

    removeBtn.addEventListener("click", () => { removePopup.style.display = "block"; });
    closeRemove.addEventListener("click", () => { removePopup.style.display = "none"; });

    document.getElementById("remove-car-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const carId = document.getElementById("carId").value;
        const messageEl = document.getElementById("remove-message");

        try {
            const response = await fetch(`${baseUrl}/addcars/deletecar`, {
                method: "POST", // Your controller expects POST for delete
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ id: carId })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to remove car.');
            }

            displayMessage(messageEl, "Car removed successfully!", true);
            document.getElementById("carId").value = '';
            fetchCars();
            setTimeout(() => { removePopup.style.display = "none"; }, 2000);
        } catch (err) {
            displayMessage(messageEl, "Error: " + err.message, false);
            console.error('Remove car fetch error:', err);
        }
    });

    // ==== UPDATE CAR ====
    const updateBtn = document.getElementById("update-car-btn");
    const updatePopup = document.getElementById("updatePopup");
    const closeUpdate = document.querySelector(".close-update");

    updateBtn.addEventListener("click", () => { updatePopup.style.display = "block"; });
    closeUpdate.addEventListener("click", () => { updatePopup.style.display = "none"; });

    document.getElementById("update-car-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedCar = {
            id: document.getElementById("updateCarId").value,
            name: document.getElementById("updateName").value,
            model: document.getElementById("updateModel").value,
            price: document.getElementById("updatePrice").value,
            engine: document.getElementById("updateEngine").value,
            color: document.getElementById("updateColor").value,
            image: document.getElementById("updateImage").value,
        };
        const messageEl = document.getElementById("update-message");

        try {
            const res = await fetch(`${baseUrl}/addcars/updatecar`, {
                method: "POST", // Your controller expects POST for update
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(updatedCar),
            });

            if (!res.ok) throw new Error(await res.text());

            displayMessage(messageEl, "Car updated successfully!", true);
            document.getElementById("update-car-form").reset();
            fetchCars();
            setTimeout(() => { updatePopup.style.display = "none"; }, 2000);
        } catch (err) {
            displayMessage(messageEl, "Error: " + err.message, false);
            console.error('Update car fetch error:', err);
        }
    });


    // ==== NEW: USERS MANAGEMENT LOGIC (No Update) ====

    // Fetch Users Function
    async function fetchUsers() {
        try {
            const response = await fetch(`${baseUrl}/api/users`); // Endpoint for listing all users
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            const users = result.data; // Assuming your API returns { success: true, data: [...] }

            const usersTableBody = document.getElementById('users-table-body');
            usersTableBody.innerHTML = ''; // Clear table body before adding

            if (!users || users.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="6">No users found. Add a new user.</td></tr>';
                return;
            }

            users.forEach(user => {
                const row = usersTableBody.insertRow();
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${user.role}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                `;
            });
        } catch (err) {
            console.error('Failed to load users:', err);
            document.getElementById('users-table-body').innerHTML = `<tr><td colspan="6" style="color: red;">Failed to load users. ${err.message || ''}</td></tr>`;
        }
    }

    // ==== ADD USER ====
    const addUserPopup = document.getElementById('addUserPopup');
    const addUserBtn = document.getElementById('add-user-btn');
    const closeAddUser = document.querySelector('.close-add-user');
    const addUserForm = document.getElementById('add-user-form');
    const addUserMessage = document.getElementById('add-user-message');

    addUserBtn.onclick = () => { addUserPopup.style.display = 'block'; };
    closeAddUser.onclick = () => { addUserPopup.style.display = 'none'; addUserForm.reset(); addUserMessage.textContent = ''; };

    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newUser = {
            name: document.getElementById('addUserName').value,
            email: document.getElementById('addUserEmail').value,
            phone: document.getElementById('addUserPhone').value,
            password: document.getElementById('addUserPassword').value,
            role: document.getElementById('addUserRole').value
        };

        try {
            const res = await fetch(`${baseUrl}/api/users/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newUser)
            });
            const data = await res.json();

            if (res.ok) {
                displayMessage(addUserMessage, 'User added successfully!', true);
                addUserForm.reset();
                fetchUsers(); // Refresh user list
                setTimeout(() => { addUserPopup.style.display = 'none'; }, 2000);
            } else {
                displayMessage(addUserMessage, data.message || 'Failed to add user.', false);
            }
        } catch (err) {
            displayMessage(addUserMessage, 'Server error. Could not add user.', false);
            console.error('Add user fetch error:', err);
        }
    });

    // ==== REMOVE USER ====
    const removeUserBtn = document.getElementById("remove-user-btn");
    const removeUserPopup = document.getElementById("removeUserPopup");
    const closeRemoveUser = document.querySelector(".close-remove-user");

    removeUserBtn.addEventListener("click", () => { removeUserPopup.style.display = "block"; });
    closeRemoveUser.addEventListener("click", () => { removeUserPopup.style.display = "none"; });

    document.getElementById("remove-user-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const userId = document.getElementById("removeUserId").value;
        const messageEl = document.getElementById("remove-user-message");

        try {
            const response = await fetch(`${baseUrl}/api/users/remove/${userId}`, { // Use dynamic ID in URL
                method: "DELETE", // Use DELETE method
                headers: { "Content-Type": "application/json" }, // Ensure headers are set
                credentials: 'include',
            });

            const data = await response.json(); // Even for success, parse JSON for message

            if (response.ok) {
                displayMessage(messageEl, data.message || "User removed successfully!", true);
                document.getElementById("removeUserId").value = '';
                fetchUsers(); // Refresh user list
                setTimeout(() => { removeUserPopup.style.display = "none"; }, 2000);
            } else {
                displayMessage(messageEl, data.message || 'Failed to remove user.', false);
            }
        } catch (err) {
            displayMessage(messageEl, "Server error. Could not remove user.", false);
            console.error('Remove user fetch error:', err);
        }
    });


    // ==== Global Modal Close on Outside Click (Updated to include new user modals) ====
    window.addEventListener("click", (e) => {
        // Cars modals
        if (e.target === addPopup) { addPopup.style.display = "none"; addForm.reset(); addMessage.textContent = ''; }
        if (e.target === removePopup) { removePopup.style.display = "none"; }
        if (e.target === updatePopup) { updatePopup.style.display = "none"; }

        // User modals (NEW)
        if (e.target === addUserPopup) { addUserPopup.style.display = "none"; addUserForm.reset(); addUserMessage.textContent = ''; }
        if (e.target === removeUserPopup) { removeUserPopup.style.display = "none"; }
        // REMOVED: if (e.target === updateUserPopup) { updateUserPopup.style.display = "none"; }
    });
});
=======

    const currentUser = window.currentUser;
    if (currentUser && currentUser.name) {
      const adminNameElement = document.getElementById('admin-name');
      adminNameElement.textContent = `Welcome, ${currentUser.name}`;
    }

    document.getElementById('logout').addEventListener('click', async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) window.location.href = '/login';
      } catch (err) {
        console.error('Logout failed:', err);
      }
    });

    async function fetchCars() {
      try {
        const res = await fetch('/addcars/all');
        const cars = await res.json();
        const grid = document.getElementById('cars-grid');
        grid.innerHTML = '';
        cars.forEach(car => {
          const div = document.createElement('div');
          div.classList.add('car-card');
          div.innerHTML = `
            <img src="${car.image || 'default.jpg'}" alt="${car.name}">
            <h3>${car.name}</h3>
            <p>Model: ${car.model}</p>
            <p>Price: $${car.price}</p>
            <p>Engine: ${car.engine}</p>
            <p>Color: ${car.color}</p>
            <p style="font-size: 0.8em;">ID: ${car._id}</p>
          `;
          grid.appendChild(div);
        });
      } catch (err) {
        console.error('Fetch cars failed:', err);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      fetchCars();

      // ==== ADD CAR ====
      const addPopup = document.getElementById('addPopup');
      const addBtn = document.getElementById('add-car-btn');
      const closeAdd = document.querySelector('.close-add');
      const addForm = document.getElementById('add-car-form');
      const addMessage = document.getElementById('add-message');

      addBtn.onclick = () => addPopup.style.display = 'block';
      closeAdd.onclick = () => {
        addPopup.style.display = 'none';
        addForm.reset();
        addMessage.textContent = '';
      };

      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const car = {
          name: addForm.addName.value,
          model: addForm.addModel.value,
          price: addForm.addPrice.value,
          engine: addForm.addEngine.value,
          color: addForm.addColor.value,
          image: addForm.addImage.value
        };
        try {
          const res = await fetch('/addcars/addcars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(car)
          });
          const data = await res.json();
          if (res.ok) {
            addMessage.textContent = '✅ Car added!';
            addMessage.style.color = 'green';
            fetchCars();
            setTimeout(() => {
              addPopup.style.display = 'none';
              addForm.reset();
              addMessage.textContent = '';
            }, 1500);
          } else {
            addMessage.textContent = data.error || 'Error';
            addMessage.style.color = 'red';
          }
        } catch (err) {
          addMessage.textContent = '❌ Server error';
          addMessage.style.color = 'red';
        }
      });

      // ==== REMOVE CAR ====
      const removePopup = document.getElementById('removePopup');
      document.getElementById('remove-car-btn').onclick = () => removePopup.style.display = 'block';
      document.querySelector('.close').onclick = () => removePopup.style.display = 'none';

      document.getElementById('remove-car-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const carId = document.getElementById('carId').value;
        const msg = document.getElementById('remove-message');
        try {
          const res = await fetch('/addcars/deletecar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: carId })
          });
          if (!res.ok) throw new Error(await res.text());
          msg.textContent = '✅ Removed!';
          msg.style.color = 'green';
          fetchCars();
          setTimeout(() => {
            removePopup.style.display = 'none';
            msg.textContent = '';
          }, 1500);
        } catch (err) {
          msg.textContent = '❌ ' + err.message;
          msg.style.color = 'red';
        }
      });

      // ==== UPDATE CAR ====
      const updatePopup = document.getElementById('updatePopup');
      document.getElementById('update-car-btn').onclick = () => updatePopup.style.display = 'block';
      document.querySelector('.close-update').onclick = () => updatePopup.style.display = 'none';

      document.getElementById('update-car-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedCar = {
          id: form.updateCarId.value,
          name: form.updateName.value,
          model: form.updateModel.value,
          price: form.updatePrice.value,
          engine: form.updateEngine.value,
          color: form.updateColor.value,
          image: form.updateImage.value
        };
        const msg = document.getElementById('update-message');
        try {
          const res = await fetch('/addcars/updatecar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updatedCar)
          });
          if (!res.ok) throw new Error(await res.text());
          msg.textContent = '✅ Car updated!';
          msg.style.color = 'green';
          fetchCars();
          setTimeout(() => {
            updatePopup.style.display = 'none';
            msg.textContent = '';
          }, 1500);
        } catch (err) {
          msg.textContent = '❌ ' + err.message;
          msg.style.color = 'red';
        }
      });

      // ==== SEARCH CAR BY ID ====
      document.getElementById('search-btn').addEventListener('click', async () => {
        const id = document.getElementById('search-car-id').value.trim();
        const grid = document.getElementById('cars-grid');
        if (!id) return;
        try {
          const res = await fetch(`/addcars/search/${id}`);
          if (!res.ok) throw new Error('Car not found');
          const car = await res.json();
          grid.innerHTML = `
            <div class="car-card">
              <img src="${car.image || 'default.jpg'}" alt="${car.name}">
              <h3>${car.name}</h3>
              <p>Model: ${car.model}</p>
              <p>Price: $${car.price}</p>
              <p>Engine: ${car.engine}</p>
              <p>Color: ${car.color}</p>
              <p style="font-size: 0.8em;">ID: ${car._id}</p>
            </div>
          `;
        } catch (err) {
          grid.innerHTML = `<p style="color:red;">❌ Car not found or error occurred.</p>`;
        }
      });

      document.getElementById('clear-search-btn').addEventListener('click', () => {
        document.getElementById('search-car-id').value = '';
        fetchCars();
      });

      // ==== Global Click to Close Modals ====
      window.onclick = function (e) {
        if (e.target === addPopup) addPopup.style.display = 'none';
        if (e.target === removePopup) removePopup.style.display = 'none';
        if (e.target === updatePopup) updatePopup.style.display = 'none';
      };
    });
>>>>>>> bbe9b010b24927714abb37678aa629b7beceb316

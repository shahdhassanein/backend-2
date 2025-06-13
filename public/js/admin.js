
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

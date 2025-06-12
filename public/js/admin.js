document.addEventListener('DOMContentLoaded', () => {
  fetch('/addcars') // This should match the Express route
    .then(res => res.json())
    .then(data => {
      const carsGrid = document.getElementById('cars-grid');
      carsGrid.innerHTML = ''; // Clear previous content

      data.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
          <h3>${car.name}</h3>
          <p>Model: ${car.model}</p>
          <p>Price: ${car.price}</p>
        `;
        carsGrid.appendChild(carCard);
      });
    })
    .catch(err => console.error('Error fetching cars:', err));
});

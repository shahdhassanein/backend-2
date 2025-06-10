
document.addEventListener('DOMContentLoaded', async () => {
    const carId = document.getElementById('carId').value;
    const form = document.getElementById('updateCarForm');
    const messageDiv = document.getElementById('message');

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning', 'alert-info');
        messageDiv.classList.add(`alert-${type}`);
        setTimeout(() => {
            messageDiv.classList.add('d-none'); // Hide message after 4 seconds
        }, 4000);
    }

    if (carId) {
        try {
            const response = await fetch(`/api/cars/${carId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const car = await response.json(); // Parse the JSON data of the car

            document.getElementById('name').value = car.name || '';
            document.getElementById('brand').value = car.brand || '';
            document.getElementById('model').value = car.model || '';
            document.getElementById('price').value = car.price || '';
            document.getElementById('engine').value = car.engine || '';
            document.getElementById('image').value = car.image || '';
              document.getElementById('availability').checked = (car.availability !== undefined) ? car.availability : true;

        } catch (error) {
            console.error('Error fetching car data:', error);
            showMessage(`Failed to load car data: ${error.message}`, 'danger');
        }
    } else {
      
        showMessage('No car ID provided for update. Please go back and select a car.', 'danger');
    }

  
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);
        const carData = {}; 

        
        for (const [key, value] of formData.entries()) {
            // Convert 'price' to a number and 'availability' to a boolean
            if (key === 'price') {
                carData[key] = parseFloat(value);
            } else if (key === 'availability') {
                carData[key] = (value === 'on'); 
            } else {
                carData[key] = value;
            }
        }
        
        if (!form.elements['availability'].checked) {
            carData['availability'] = false;
        }

        try {
            
            const response = await fetch(`/api/cars/${carId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json', 
                   
                },
                body: JSON.stringify(carData)
            });

            if (!response.ok) {
               
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json(); 
            showMessage(result.message || 'Car updated successfully!', 'success');
            
        } catch (error) {
            console.error('Error updating car:', error);
            showMessage(`Error updating car: ${error.message}`, 'danger');
        }
    });
});
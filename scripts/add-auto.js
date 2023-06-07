'use strict';

document.getElementById('addAutoForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  
  const formData = {
    number: document.getElementById('number').value,
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    year: document.getElementById('year').value,
    vin: document.getElementById('vin').value,
    engine: document.getElementById('engine').value,
    volume: document.getElementById('volume').value,
    client: document.getElementById('client').value,
    phone: document.getElementById('phone').value,
    more: document.getElementById('more').value,
  };

  addAuto(formData);
});

const addAuto = async (formData) => {
  try {
    const response = await fetch('/api/add-auto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('An error occurred while adding the auto.');
    }
    const addedAuto = await response.json();
    console.log('Auto added:', addedAuto);
    window.location.href = '/';

  } catch (error) {
    console.error(error);
  }
}
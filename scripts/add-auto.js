'use strict';

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

  } catch (error) {
    console.error(error);
  }
}

document.getElementById('addAutoForm').addEventListener('submit', (event) => {
  event.preventDefault();

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
  window.location.href = '/find-auto';
});


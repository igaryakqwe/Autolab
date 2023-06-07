'use strict';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('search');
const headers = document.querySelectorAll('h3');
const error = document.getElementById('error');
const worksList = document.getElementById('worksList');
const worksHeader = document.getElementById('worksHeader');
const total = document.getElementById('total');
const worksContainer = document.getElementById('works');
const deleteContainer = document.getElementById('deleteContainer')

const names = {
  number: 'Номер авто: ',
  brand: 'Марка авто: ',
  model: 'Модель: ',
  year: 'Рік випуску: ',
  vin: 'VIN код: ',
  engine: 'Тип двигуна: ',
  volume: "Об'єм двигуна: ",
  client: 'ПІБ клієнта: ',
  phone: 'Тел.: ',
  more: 'Додаткова інформація: ',
}

const createNestedElement = (tagName, textContent, children) => {
  const element = document.createElement(tagName);
  if (textContent) {
    element.textContent = textContent;
  }
  if (children && children.length > 0) {
    children.forEach(child => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else {
        const nestedElement = createNestedElement(child.tagName, child.textContent, child.children);
        element.appendChild(nestedElement);
      }
    });
  }
  return element;
}

const createListElement = (items) => {
  const list = document.createElement('ul');
  items.forEach(item => {
    if (item instanceof Node) {
      const listItem = document.createElement('li');
      listItem.appendChild(item);
      list.appendChild(listItem);
    } else {
      const listItem = createNestedElement(item.tagName, item.textContent, item.children);
      list.appendChild(listItem);
    }
  });
  return list;
}

const totalSum = (data) => {
  let total = 0;
  for (const item of data.works) {
    for (const work of item.done) {
      total += work.price;
    }
  }
  return total;
}


const deleteAuto = (number) => {
  fetch('/api/delete-auto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ deleteValue: number })
  })
    .then(response => response.json())
    .catch(error => {
      window.location.href = '/';
      console.error(error);
      console.log('Помилка підключення до сервера.');
    });
};

const createDeleteButton = (number) => {
  const button = document.createElement('button');
  button.textContent = 'Видалити';
  button.addEventListener('click', () => {
    deleteAuto(number);
  });
  return button;
};


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchValue = searchInput.value;
  worksList.innerHTML = '';

  fetch('/api/find-auto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ searchValue: searchValue })
  })
    .then(response => response.json())
    .then(data => {
      if (typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          const element = document.getElementById(key);
          if (element && typeof value === 'string' && value !== '') {
            element.textContent = names[key] + value;
          }
        }

        const deleteButton = createDeleteButton(data.number);
        deleteContainer.innerHTML = '';
        deleteContainer.appendChild(deleteButton);

        error.textContent = '';

        if (Array.isArray(data.works) && data.works.length > 0) {
          worksHeader.textContent = 'Список робіт:';
          worksContainer.innerHTML = '';
          worksContainer.appendChild(worksHeader);

          const worksList = createListElement(data.works.map(work => {
            return createNestedElement('li', work.date, [
              createListElement([
                createNestedElement('li', 'Перелік робіт:', [
                  createListElement(work.done.map(work => {
                    return createNestedElement('li', `${work.type} - ${work.price} грн.`);
                  }))
                ]),
                work.more !== null && createNestedElement('li', work.more),
              ]),
            ]);
          }));
          total.textContent = `Загальна сумма: ${totalSum(data)} грн.`;
          worksContainer.appendChild(worksList);
          worksContainer.appendChild(total);
        } else {
          worksContainer.innerHTML = '';
          const notFoundWorks = document.createElement('h3');
          notFoundWorks.innerHTML = 'Робіт поки що немає';
          worksContainer.appendChild(notFoundWorks);
        }
      } else {
        for (const header of headers) {
          header.textContent = '';
        }
        error.textContent = 'Авто не знайдено';
      }
    })
    .catch(error => {
      console.error(error);
      error.textContent = 'Помилка підключення до сервера';
    });
});
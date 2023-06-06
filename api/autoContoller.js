'use strict';

const fs = require('fs');

const generateUniqueId = (length) => {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

const factorifyAuto = (number, brand, model, year, vin = '', engine, volume, client, phone, more = '', works = []) => {
  return { 
    id: generateUniqueId(6),
    number, 
    brand, 
    model, 
    year, 
    vin, 
    engine, 
    volume, 
    client, 
    phone, 
    more, 
    works 
  };
}

class AutoController {
  addAuto = async (num, brand, model, year, vin, engine, volume, client, phone, more) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      const carData = JSON.parse(data);
      const foundAuto = carData.find(auto => auto.number === num);
  
      if (!foundAuto) {
        carData.push(factorifyAuto(num, brand, model, year, vin, engine, volume, client, phone, more));
        const jsonData = JSON.stringify(carData, null, 2);
        fs.writeFile('data.json', jsonData, (err) => {
          if (err) throw err;
          return 'The car has been added!';
        });
      } else {
        return 'The car is already on the list';
      }
    });
  }
  
  
  deleteAuto = async (num) => {
    fs.readFile('./data.json', 'utf8', (error, data) => {
      if (error) throw error;
  
      const carData = JSON.parse(data);
      const deletedAuto = carData.filter(auto => auto.number !== num);
      
      const jsonData = JSON.stringify(deletedAuto, null, 2);
      fs.writeFile('data.json', jsonData, (err) => {
        if (err) throw err;
        return 'The car has been deleted!';
      });
    });
  }
  
  findAuto = async (searchValue) => {
    return new Promise((resolve, reject) => {
      fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
  
        const carData = JSON.parse(data);
        const foundAuto = carData.find(auto => auto.number === searchValue);
  
        if (foundAuto) {
          resolve(foundAuto);
        } else {
          resolve('The car is not found.');
        }
      });
    });
  }
}

const autoController = new AutoController();
module.exports = autoController;

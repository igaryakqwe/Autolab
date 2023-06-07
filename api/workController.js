'use strict';

const fs = require('fs');

const getCurrentDate = () => {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return currentDate.toISOString().split('T')[0];
}


const factorifyWork = (more) => {
  return {
    date: getCurrentDate(),
    more,
    work: [],
  }
}

const factorifyDoneWork = (type, price) => {
  return { 
    type,
    price
  }
}

class WorkController {
  addWork = async () => {
    
  }

  deleteWork = async () => {

  }
}
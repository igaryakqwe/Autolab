'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const autoController = require('./api/autoContoller');
const url = require('url');

const api = new Map();

const PORT = 3000;

const types = {
  html: "text/html",
  js: "application/javascript",
  css: "text/css",
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', types.html);

  const createHTMLPath = (page) => {
    return path.resolve(__dirname, './pages', `${page}.html`);
  }
  
  const createCSSPath = (page) => {
    return path.resolve(__dirname, page);
  }

  let basePath = '';

  switch (req.url) {
    case '/':
      basePath = createHTMLPath('index');
      res.statusCode = 200;
      break;
    case '/add-auto':
      basePath = createHTMLPath('add-auto')
      res.statusCode = 200;
      break;
    case '/find-auto':
      basePath = createHTMLPath('find-auto');
      res.statusCode = 200;
      break;
    case '/auto-page':
      basePath = createHTMLPath('auto-page');
      res.statusCode = 200;
      break;
    case '/api/add-auto':
      if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });
        req.on('end', async () => {
          try {
            const formData = JSON.parse(data);
            const { number, brand, model, year, vin, engine, volume, client, phone, more } = formData;
    
            autoController.addAuto(number, brand, model, year, vin, engine, volume, client, phone, more, (err, addedAuto) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'An error occurred while adding the auto.' }));
              } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(addedAuto));
              }
            });
          } catch (error) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid data format.' }));
          }
        });
      } else {
        res.statusCode = 404;
      }
      break;
    case '/api/find-auto':
      if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });
        req.on('end', async () => {
          const params = JSON.parse(data);
          const searchValue = params.searchValue;
    
          autoController.findAuto(searchValue)
            .then(result => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            })
            .catch(error => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'An error occurred' }));
            });
        });
      } else {
        res.statusCode = 404;
      }
      break; 
    default:
      if (req.url.endsWith('.css')) {
        const cssPath = createCSSPath(req.url.slice(1));
        fs.readFile(cssPath, (err, data) => {
          if (err) {
            console.log(err);
            res.statusCode = 404;
            res.end();
          } else {
            res.setHeader('Content-Type', types.css);
            res.write(data);
            res.end();
          }
        });
        return;
      } else {
        basePath = createHTMLPath('error');
        res.statusCode = 404;
      }
    break;
  }

  fs.readFile(basePath, (err, data) => {
    if (err) {
      console.log(err);
      res.end;
    } else {
      res.write(data);
      res.end();
    }
  });
});

server.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server listening on port ${PORT}`);
  }
});
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const autoController = require('./api/autoContoller');

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
    case '/add-auto':
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          const formData = new URLSearchParams(body);
          const num = formData.get('number');
          const brand = formData.get('brand');
          const model = formData.get('model');
          const year = formData.get('year');
          const vin = formData.get('vin');
          const engine = formData.get('engine');
          const volume = formData.get('volume');
          const client = formData.get('client');
          const phone = formData.get('phone');
          const more = formData.get('more');
          autoController.addAuto(num, brand, model, year, vin, engine, volume, client, phone, more, (err, message) => {
            if (err) {
              res.statusCode = 500;
              res.end(err);
            } else {
              res.statusCode = 302;
              const redirectUrl = `/auto-page?id=${addedAuto.id}`;
              res.setHeader('Location', redirectUrl);
              res.end();
            }
          });
        });
      } else {
        basePath = createHTMLPath('add-auto');
        res.statusCode = 200;
      }
      break;
    case '/find-auto':
      basePath = createHTMLPath('find-auto');
      res.statusCode = 200;
      break;
    case '/auto-page':
      basePath = createHTMLPath('auto-page');
      res.statusCode = 200;
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

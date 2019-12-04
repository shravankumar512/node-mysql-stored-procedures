'use strict';

import fs from 'fs'

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
};

function routes(app) {

  fs
    .readdirSync(__dirname + '/')
    .filter(file => file.match(/\.js$/))
    .forEach(file => {
      if (file !== 'index.js') {
        let sp = file.split('.');
        app.use('/' + sp[0], require('./' + sp[0]));
        app.use(allowCrossDomain);
      }
    });
}

export default routes;
'use strict';

const express = require('express');
const app = express();

app.set('view engine','jade');
app.set('views',__dirname + '/views');

app.use(require('./controllers'));


app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")
});

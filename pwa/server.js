var express = require('express');
var compression = require('compression');
var app = express();
app.use(compression());
app.use(express.static('dist'));

app.listen(3400);

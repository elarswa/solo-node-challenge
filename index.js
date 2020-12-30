const express = require('express');
const indexRouter = require('./routes/index.js');
const peopleRouter = require('./routes/people.js');
const planetsRouter = require('./routes/planets.js');
const app = express();

app.use('/', indexRouter);
app.get('/people', peopleRouter);
app.get('/planets', planetsRouter);

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});

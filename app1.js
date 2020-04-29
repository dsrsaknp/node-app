const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    res.send('<h1>where the heck are users!!</h1>');
});

app.use('/', (req, res, next) => {
    res.send('<h1>Nothing here...Get lost!!</h1>');
})

app.listen(3000, () => {
    console.log("Server's up and running...");
});
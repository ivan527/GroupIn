const express = require('express');
const router = express.Router();

const constructorMethod = (app) => {
    app.use("*", (req, res) => {
        res.render("groupin/static", {});
    })
};

module.exports = constructorMethod;
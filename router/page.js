var express = require('express');
var page = express.Router();
const pool = require("../src/sql.js");
const path = require("path");



page.get('/login', (req, res) => {

    const response = 200;

    res.sendFile(path.join(__dirname, "../build/index.html"));


});

page.get('/Project', (req, res) => {

    const response = 200;

    res.sendFile(path.join(__dirname, "../build/index.html"));


});

module.exports = page;
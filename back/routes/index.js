const express = require("express");
const fs = require("fs");
const router = express.Router();

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
};

fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtension(file);
    if (name !== 'index') {
        const route = require('./' + name);
        if (typeof route === 'function') {
            router.use('/' + name, route);
        } else {
            console.error(`Error: The module './${name}' does not export a function.`);
        }
    }
});

module.exports = router;

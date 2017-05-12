const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.post("/add", (req, res) => {
    let userArgs = req.body;
    userData.addUser(userArgs.username, userArgs.password).then((user) => {
        res.json(user);
    }, () => {
        res.sendStatus(500);
    });
});

module.exports = router;

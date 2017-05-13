// routes/index.js
const authCheck = require("./authenticate.js");
const userRoutes = require("./user.js");
const mediaListRoutes = require("./mediaList.js");

const constructorMethod = (app) => {
    app.use("/", authCheck);
    app.use("/user", userRoutes);

    app.use("/mediaList", mediaListRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error: "Page not found"});
    });
};

module.exports = constructorMethod;

// routes/index.js
const authCheck = require("./authenticate.js");
const userRoutes = require("./user.js");

const constructorMethod = (app) => {
    app.use("/", authCheck);
    app.use("/user", userRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error: "Page not found"});
    });
};

module.exports = constructorMethod;

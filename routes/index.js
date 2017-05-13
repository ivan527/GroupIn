// routes/index.js
const authCheck = require("./authenticate.js");

const userRoutes = require("./user.js");
const mediaListRoutes = require("./mediaList.js");



const authenticationMiddleware = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/");
    }
};


const constructorMethod = (app) => {
    app.use("/", authCheck);
    app.use("/user", authenticationMiddleware, userRoutes);
    // app.use("/test", authenticationMiddleware, test);

    app.use("/mediaList", mediaListRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error: "Page not found"});
    });
};

module.exports = constructorMethod;

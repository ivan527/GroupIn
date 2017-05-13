// routes/index.js
const authCheck = require("./authenticate.js");

const userRoutes = require("./hub.js");
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
    app.use("/hub", authenticationMiddleware, userRoutes);
    app.use("/medialist", authenticationMiddleware, mediaListRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error: "Page not found"});
    });
};

module.exports = constructorMethod;

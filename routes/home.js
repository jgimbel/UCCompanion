module.exports = function(router) {
    router.get("/", index);
    router.get("/presentation", presentation);
    
    return router;
};

function index(req, res, next) {
    return res.render("index", {
        title: "UC Companion"
    });
}

function presentation(req, res, next) {
    return res.render("presentor");
}
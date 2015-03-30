var Event = require("../models/Event");

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
    Event.find({}, function(err, e) {
        if(err) return err;
        
        return res.render("presentor", {
            title: "UC Companion",
            events: e
        });
    })
}
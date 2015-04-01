var Event = require("../models/Event");

module.exports = function(router) {
    router.get("/", index);
    router.get("/presentation", presentation);
    router.get("/speakers", speakers);

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
        
        return res.render("presentation", {
            title: "Presentations - UC Companion",
            events: e
        });
    })
}

function speakers(req, res, next) {
    Event.find({}, function(err, e) {
        if(err) return err;
        console.log(e);
        return res.render("speakers", {
            title: "Presentations - UC Companion",
            events: e
        });
    });
}
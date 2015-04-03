var Event = require("../models/Event");
var Comment = require("../models/Comment");

module.exports = function(router) {
    router.get("/", index);
    router.get("/presentation", presentations);
    router.get("/presentation/:id", presentation);
    router.get("/speakers/:id", speaker);
    router.get("/speakers", speakers);
    router.post("/comment", comment);
    router.param('id', function(req, res, next, id) {

        // once validation is done save the new item in the req
        req.id = id;
        // go to the next thing
        next();
    });

    return router;
};

function index(req, res, next) {
    return res.render("index", {
        title: "UC Companion"
    });
}

function presentations(req, res, next) {
    
    Event.find({}, function(err, e) {
        if (err) return err;
        console.log(e);
        // var split = e.Description.split('\n');
        // var clean = split.filter(function(n){ return n});
        // var joined = clean.join('<\p><p>');
        // var result = '<p>' + joined + '</p>';
        // e.Description = result;
        
        return res.render("presentation", {
            title: "Presentations - UC Companion",
            events: e
        });
    })
}

function presentation(req, res, next) {
    Event.findOne({
        _id: req.id
    }, function(err, e) {
        if (err) return err;
        return res.render("presentation", {
            title: "Presentation - UC Companion",
            event: e
        });
    });
}

function speaker(req, res, next) {
    Event.find({
        _id: req.id
    }, function(err, e) {
        if (err) return err;
        return res.render("speakers", {
            title: "Presentations - UC Companion",
            events: e
        });
    });
}
function speakers(req, res, next) {
    Event.find({}, function(err, e) {
        if (err) return err;
        return res.render("speakers", {
            title: "Presentations - UC Companion",
            events: e
        });
    });
}

function comment(req, res, next) {
    if(!req.user) return res.sendStatus(403);
    Comment.find({
        user: req.user.id,
        Event: req.body.id
    }, function(err, com) {
        if (err) return err;
        if (com) {
            com.Message = req.body.Message || com.Message;
            com.Stars = req.body.Stars || com.Stars;
            com.save();
            return res.json({
                status: "Success"
            });
        }

        Event.findOne({
            _id: req.body.id
        }, function(err, event) {
            if (err) return err;
            
            var Message = req.body.Message || com.Message;
            var Stars = req.body.Stars || com.Stars;
            var com = new Comment({
                User: req.user.id,
                Event: event._id,
                Message: Message,
                Stars: Stars
            });
            com.save();
            return res.json({
                status: "Success"
            });
        });
    });
}
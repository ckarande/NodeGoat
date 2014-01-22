var ProfileDAO = require("../data/profile-dao").ProfileDAO;
var SessionDAO = require("../data/session-dao").SessionDAO;

/* The ProfileHandler must be constructed with a connected db */
function ProfileHandler(db) {
    "use strict";

    var profile = new ProfileDAO(db);
    var session = new SessionDAO(db);

    this.displayProfile = function(req, res, next) {

        var sessionId = req.cookies.session;

        session.getUserName(sessionId, function(err, username) {

            if (err) return next(err);

            profile.getByUserName(username, function(error, user) {

                if (error) return next(error);

                return res.render("profile", user);
            });

        });
    };

    this.handleProfileUpdate = function(req, res, next) {

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var ssn = req.body.ssn;
        var dob = req.body.dob;
        var address = req.body.address;

        var sessionId = req.cookies.session;

        session.getUserName(sessionId, function(err, username) {

            if (err) return next(err);

            profile.updateUser(username, firstname, lastname, ssn, dob, address, function(err, user) {

                if (err) return next(err);

                user.updateSuccess = true;
                return res.render("profile", user);
            });
        });
    };

}

module.exports = ProfileHandler;

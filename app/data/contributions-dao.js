var UserDAO = require("./user-dao").UserDAO;


/* The ContributionsDAO must be constructed with a connected database object */
function ContributionsDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ContributionsDAO)) {
        console.log("Warning: ContributionsDAO constructor called without 'new' operator");
        return new ContributionsDAO(db);
    }

    var contributionsDB = db.collection("contributions");
    var userDAO = new UserDAO(db);


    this.update = function(username, pretax, aftertax, roth, callback) {

        // Create contributions document
        var contributions = {
            _id: username,
            pretax: pretax,
            aftertax: aftertax,
            roth: roth
        };

        contributionsDB.update({
            _id: username
        }, contributions, {
            upsert: true
        }, function(err, result) {

            if (!err) {
                console.log("Updated contributions");
                return callback(null, contributions);
            }

            return callback(err, null);
        });
    };

    this.getByUserName = function(username, callback) {
        contributionsDB.findOne({
            _id: username
        }, function(err, contributions) {

            if (err) return callback(err, null);

            userDAO.getByUserName(username, function(err, user) {

                if (err) return callback(err, null);

                // add user details
                contributions.username = user.username;
                contributions.userid = user._id;
                contributions.firstname = user.firstname;
                contributions.lastname = user.lastname;

                callback(null, contributions);
            });

        });
    };
}

module.exports.ContributionsDAO = ContributionsDAO;

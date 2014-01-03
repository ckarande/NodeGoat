var UserDAO = require("./user-dao").UserDAO;


/* The AllocationsDAO must be constructed with a connected database object */
function AllocationsDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof AllocationsDAO)) {
        console.log("Warning: AllocationsDAO constructor called without 'new' operator");
        return new AllocationsDAO(db);
    }

    var allocationsDB = db.collection("allocations");
    var userDAO = new UserDAO(db);


    this.update = function(userid, stocks, funds, govbonds, callback) {

        // Create allocations document
        var allocations = {
            _id: userid,
            stocks: stocks,
            funds: funds,
            govbonds: govbonds
        };

        allocationsDB.update({
            _id: userid
        }, allocations, {
            upsert: true
        }, function(err, result) {

            if (!err) {
                console.log("Updated allocations");
                return callback(null, allocations);
            }

            return callback(err, null);
        });
    };

    this.getByUserId = function(userid, callback) {
        allocationsDB.findOne({
            _id: userid
        }, function(err, allocations) {

            if (err) return callback(err, null);
            console.log("userid = " + userid);

            userDAO.getUserById(userid, function(err, user) {

                if (err) return callback(err, null);

                // add user details
                allocations.username = user._id;
                allocations.userid = userid;
                allocations.firstname = user.firstname;
                allocations.lastname = user.lastname;

                callback(null, allocations);
            });

        });
    };
}

module.exports.AllocationsDAO = AllocationsDAO;

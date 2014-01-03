var AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
var SessionDAO = require("../data/session-dao").SessionDAO;


function AllocationsHandler(db) {
    "use strict";

    var sessionDAO = new SessionDAO(db);
    var allocationsDAO = new AllocationsDAO(db);


    this.displayAllocations = function(req, res, next) {

        var userid = req.params.userid;

        allocationsDAO.getByUserId(userid, function(error, allocations) {

            if (error) return next(error);

            return res.render("allocations", allocations);
        });
    };
    /*
    this.handleAllocationsUpdate = function(req, res, next) {

        var stocks = req.body.stocks;
        var funds = req.body.funds;
        var govbonds = req.body.govbonds;
        var userid = req.params.userid;

        allocationsDAO.update(userid, stocks, funds, govbonds, function(err, allocations) {

            if (err) return next(err);

            allocations.updateSuccess = true;
            return res.render("allocations", allocations);
        });
    };
*/
}

module.exports = AllocationsHandler;

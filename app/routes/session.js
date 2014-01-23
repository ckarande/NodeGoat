var UserDAO = require("../data/user-dao").UserDAO;
var SessionDAO = require("../data/session-dao").SessionDAO;
var AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler(db) {
    "use strict";

    var userDAO = new UserDAO(db);
    var sessionDAO = new SessionDAO(db);
    var allocationsDAO = new AllocationsDAO(db);

    var prepareUserData = function(user, next) {

        // Generate random allocations
        var stocks = Math.floor((Math.random() * 40) + 1);
        var funds = Math.floor((Math.random() * 40) + 1);
        var bonds = 100 - (stocks + funds);

        allocationsDAO.update(user.userId, stocks, funds, bonds, function(err, allocations) {
            if (err) return next(err);
        });
    };

    this.isLoggedInMiddleware = function(req, res, next) {
        var sessionId = req.cookies.session;
        sessionDAO.getUserId(sessionId, function(err, userId) {

            if (!err && userId) {
                req.userId = userId;
            }
            return next();
        });
    };

    this.displayLoginPage = function(req, res, next) {
        return res.render("login", {
            userName: "",
            password: "",
            loginError: ""
        });
    };

    this.handleLoginRequest = function(req, res, next) {

        var userName = req.body.userName;
        var password = req.body.password;

        console.log("user submitted userName: " + userName + " pass: " + password);

        userDAO.validateLogin(userName, password, function(err, user) {

            if (err) {
                if (err.noSuchUser) {
                    return res.render("login", {
                        userName: userName,
                        password: "",
                        loginError: "No such user"
                    });
                } else if (err.invalidPassword) {
                    return res.render("login", {
                        userName: userName,
                        password: "",
                        loginError: "Invalid password"
                    });
                } else {
                    // Some other kind of error
                    return next(err);
                }
            }

            sessionDAO.startSession(user.userId, function(err, sessionId) {

                if (err) return next(err);

                res.cookie("session", sessionId);
                return res.redirect("/dashboard");
            });
        });
    };

    this.displayLogoutPage = function(req, res, next) {

        var sessionId = req.cookies.session;
        sessionDAO.endSession(sessionId, function(err) {

            // Even if the user wasn"t logged in, redirect to home
            res.cookie("session", "");
            return res.redirect("/");
        });
    };

    this.displaySignupPage = function(req, res, next) {
        res.render("signup", {
            userName: "",
            password: "",
            passwordError: "",
            email: "",
            userNameError: "",
            emailError: "",
            verifyError: ""
        });
    };

    function validateSignup(userName, firstName, lastName, password, verify, email, errors) {

        var USER_RE = /^.{1,20}$/;
        var FNAME_RE = /^.{1,100}$/;
        var LNAME_RE = /^.{1,100}$/;
        var PASS_RE = /^.{1,20}$/;
        var EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;

        errors.userNameError = "";
        errors.firstNameError = "";
        errors.lastNameError = "";

        errors.passwordError = "";
        errors.verifyError = "";
        errors.emailError = "";

        if (!USER_RE.test(userName)) {
            errors.userNameError = "Invalid user name.";
            return false;
        }
        if (!FNAME_RE.test(firstName)) {
            errors.firstNameError = "Invalid first name.";
            return false;
        }
        if (!LNAME_RE.test(firstName)) {
            errors.lastNameError = "Invalid last name.";
            return false;
        }
        if (!PASS_RE.test(password)) {
            errors.passwordError = "Invalid password.";
            return false;
        }
        if (password !== verify) {
            errors.verifyError = "Password must match";
            return false;
        }
        if (email !== "") {
            if (!EMAIL_RE.test(email)) {
                errors.emailError = "Invalid email address";
                return false;
            }
        }
        return true;
    }

    this.handleSignup = function(req, res, next) {

        var email = req.body.email;
        var userName = req.body.userName;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var password = req.body.password;
        var verify = req.body.verify;

        // set these up in case we have an error case
        var errors = {
            "userName": userName,
            "email": email
        };

        if (validateSignup(userName, firstName, lastName, password, verify, email, errors)) {

            userDAO.getUserByUserName(userName, function(err, user) {

                if (err) return next(err);

                if (user) {
                    errors.userNameError = "User name already in use. Please choose another";
                    return res.render("signup", errors);
                }

                userDAO.addUser(userName, firstName, lastName, password, email, function(err, user) {

                    if (err) return next(err);

                    //prepare data for the user
                    prepareUserData(user, next);

                    sessionDAO.startSession(user.userId, function(err, sessionId) {

                        if (err) return next(err);

                        res.cookie("session", sessionId);
                        return res.redirect("/dashboard");
                    });
                });
            });
        } else {
            console.log("user did not validate");
            return res.render("signup", errors);
        }
    };

    this.displayWelcomePage = function(req, res, next) {

        if (!req.userId) {
            console.log("welcome: Unable to identify user...redirecting to login");
            return res.redirect("/login");
        }

        userDAO.getUserById(req.userId, function(err, user) {

            if (err) return next(err);

            return res.render("dashboard", user);
        });

    };
}

module.exports = SessionHandler;

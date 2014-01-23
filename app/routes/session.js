var UserDAO = require("../data/user-dao").UserDAO,
    SessionDAO = require("../data/session-dao").SessionDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler(db) {
    "use strict";

    var user = new UserDAO(db);
    var session = new SessionDAO(db);

    this.isLoggedInMiddleware = function(req, res, next) {
        var sessionId = req.cookies.session;
        session.getUserId(sessionId, function(err, userId) {

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

        user.validateLogin(userName, password, function(err, user) {

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

            session.startSession(user._id, function(err, sessionId) {

                if (err) return next(err);

                res.cookie("session", sessionId);
                return res.redirect("/dashboard");
            });
        });
    };

    this.displayLogoutPage = function(req, res, next) {

        var sessionId = req.cookies.session;
        session.endSession(sessionId, function(err) {

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
            errors.userNameError = "Invalid userName.";
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
            user.addUser(userName, firstName, lastName, password, email, function(err, user) {

                if (err) {
                    // this was a duplicate
                    if (err.code === "11000") {
                        errors.userNameError = "User name already in use. Please choose another";
                        return res.render("signup", errors);
                    }
                    // this was a different error
                    else {
                        return next(err);
                    }
                }

                session.startSession(user._id, function(err, sessionId) {

                    if (err) return next(err);

                    res.cookie("session", sessionId);
                    return res.redirect("/dashboard");
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

        user.getUserById(req.userId, function(err, user) {

            if (err) return next(err);

            return res.render("dashboard", user);
        });

    };
}

module.exports = SessionHandler;

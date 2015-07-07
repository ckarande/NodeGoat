### Description

Session management is a critical piece of application security. It is broader
risk, and requires developers take care of protecting session id, user
credential secure storage, session duration, and protecting critical session
data in transit.

### Attack Mechanics

**Scenario #1:** Application timeouts aren't set properly. User uses a public computer to access site. Instead of selecting “logout” the user simply closes the browser tab and walks away. Attacker uses the same browser an hour later, and that browser is still authenticated.

**Scenario #2: **Attacker acts as a man-in-middle and acquires user's session id from network traffic. Then uses this authenticated session id to connect to application without needing to enter user name and password.

**Scenario #3: **Insider or external attacker gains access to the system's password database. User passwords are not properly hashed, exposing every users' password to the attacker.

### How Do I Prevent It?

Session management related security issues can be prevented by taking these
measures:

  * User authentication credentials should be protected when stored using hashing or encryption.
  * Session IDs should not be exposed in the URL (e.g., URL rewriting).
  * Session IDs should timeout. User sessions or authentication tokens should get properly invalidated during logout.
  * Session IDs should be recreated after successful login.
  * Passwords, session IDs, and other credentials should not be sent over unencrypted connections.

### Source Code Examples

In the insecure demo app, following issues exists:

### 1. Protecting user credentials

password gets stored in database in plain text . Here is related code in `data
/user-dao.js` `addUser()`method:

    
    
    // Create user document
    var user = {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        password: password //received from request param
    };
                            

To secure it, handle password storage in a safer way by using one way
encryption using salt hashing as below:

    
    
    // Generate password hash
    var salt = bcrypt.genSaltSync();
    var passwordHash = bcrypt.hashSync(password, salt);
    
    // Create user document
    var user = {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        password: passwordHash
    };
                            

This hash password can not be decrypted, hence more secure. To compare the
password when user logs in, the user entered password gets converted to hash
and compared with the hash in storage.

    
    
    if (bcrypt.compareSync(password, user.password)) {
        callback(null, user);
    } else {
        callback(invalidPasswordError, null);
    }
                            

Note: The bcrypt module also provides asynchronous methods for creating and
comparing hash.

  

### 2. Session timeout and protecting cookies in transit

The insecure demo application does not contain any provision to timeout user
session. The session stays active until user explicitly logs out.

In addition to that, the app does not prevent cookies being accessed in
script, making application vulnerable to Cross Site Scripting (XSS) attacks.
Also cookies are not prevented to get sent on insecure HTTP connection.

To secure the application:

1. Use session based timeouts, terminate session when browser closes.

    
    
    // Enable session management using express middleware
    app.use(express.cookieParser());
     

2. In addition, sets `HTTPOnly`HTTP header preventing cookies being accessed
by scripts. The application used HTTPS secure connections, and cookies are
configured to be sent only on Secure HTTPS connections by setting
`Secure`flag.

    
    
    app.use(express.session({
        secret: "s3Cur3",
        cookie: {
            httpOnly: true,
            secure: true
        }
    }));
                            

3. When user clicks logout, destroy the session and session cookie

    
    
    req.session.destroy(function() {
        res.redirect("/");
    });
                            

Note: The example code uses `MemoryStore`to manage session data, which is not
designed for production environment, as it will leak memory, and will not
scale past a single process. Use database based storage MongoStore or
RedisStore for production. Alternatively, sessions can be managed using
popular passport module.

### Further Reading

  * [Helmet](https://npmjs.org/package/helmet) Security header middleware collection for express
  * [Seven Web Server HTTP Headers that Improve Web Application Security for Free](http://recxltd.blogspot.sg/2012/03/seven-web-server-http-headers-that.html)
  * [Passport](http://passportjs.org/guide/authenticate/) authentication middleware
  * [CWE-384: Session Fixation](http://en.wikipedia.org/wiki/Session_fixation)

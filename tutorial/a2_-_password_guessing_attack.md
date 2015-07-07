## A2 - 2 Password Guessing Attacks
### Description
Implementing a robust minimum password criteria (minimum length and
complexity) can make it difficult for attacker to guess password.

### Attack Mechanics

The attacker can exploit this vulnerability by brute force password guessing,
more likely using tools that generate random passwords.

### How Do I Prevent It?

**Password length**

Minimum passwords length should be at least eight (8) characters long.
Combining this length with complexity makes a password difficult to guess
and/or brute force.

**Password complexity**

Password characters should be a combination of alphanumeric characters.
Alphanumeric characters consist of letters, numbers, punctuation marks,
mathematical and other conventional symbols.

**Username/Password Enumeration**

Authentication failure responses should not indicate which part of the
authentication data was incorrect. For example, instead of "Invalid username"
or "Invalid password", just use "Invalid username and/or password" for both.
Error responses must be truly identical in both display and source code

**Additional Measures**

  * For additional protection against brute forcing, enforce account disabling after an established number of invalid login attempts (e.g., five attempts is common). The account must be disabled for a period of time sufficient to discourage brute force guessing of credentials, but not so long as to allow for a denial-of-service attack to be performed.
  * Authentication failure responses should not indicate which part of the authentication data was incorrect. For example, instead of "Invalid username" or "Invalid password", just use "Invalid username and/or password" for both. Error responses must be truly identical in both display and source code
  * Only send non-temporary passwords over an encrypted connection or as encrypted data, such as in an encrypted email. Temporary passwords associated with email resets may be an exception. Enforce the changing of temporary passwords on the next use. Temporary passwords and links should have a short expiration time.

### Source Code Example

The demo application doesn't enforce strong password. In routes/session.js
`validateSignup()`method, the regex for password enforcement is simply

    
    var PASS_RE = /^.{1,20}$/;

A stronger password can be enforced using the regex below, which requires at
least 8 character password with numbers and both lowercase and uppercase
letters.

    
    var PASS_RE =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

Another issue, in routes/session.js, the `handleLoginRequest()`enumerated
whether password was incorrect or user doesn't exist.This information can be
valuable to an attacker with brute forcing attempts. This can be easily fixed
using a generic error message such as "Invalid username and/or password".

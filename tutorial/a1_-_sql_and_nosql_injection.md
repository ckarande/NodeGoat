##  A1 - 2 SQL and NoSQL Injection

### Description

SQL and NoSQL injections enable an attacker to inject code into the query that
would be executed by the database. These flaws are introduced when software
developers create dynamic database queries that include user supplied input.

### Attack Mechanics

Both SQL and NoSQL databases are vulnerable to injection attack. Here is an
example of equivalent attack in both cases, where attacker manages to retrieve
admin user's record without knowing password:

##### 1. SQL Injection

Lets consider an example SQL statement used to authenticate the user with
username and password

    
    SELECT * FROM accounts WHERE username = '$username' AND password = '$password'

If this statement is not prepared or properly handled when constructed, an
attacker may be able to supply `admin' --`in the username field to access the
admin user's account bypassing the condition that checks for the password. The
resultant SQL query would looks like:

    
    SELECT * FROM accounts WHERE username = 'admin' -- AND password = ''

  

##### 2. NoSQL Injection

The equivalent of above query for NoSQL MongoDB database is:

    
    db.accounts.find({username: username, password: password});

While here we are no longer dealing with query language, an attacker can still
achieve the same results as SQL injection by supplying JSON input object as
below:

    
    
    {
        "username": "admin",
        "password": {$gt: ""}
    }
                            

In MongoDB, `$gt`selects those documents where the value of the field is
greater than (i.e. &gt;) the specified value. Thus above statement compares
password in database with empty string for greatness, which returns `true`.

The same results can be achieved using other comparison operator such as
`$ne`.

### How Do I Prevent It?

Here are some measures to prevent SQL / NoSQL injection attacks, or minimize
impact if it happens:

  * Prepared Statements: For SQL calls, use prepared statements instead of building dynamic queries using string concatenation.
  * Input Validation: Validate inputs to detect malicious values. For NoSQL databases, also validate input types against expected types
  * Least Privilege: To minimize the potential damage of a successful injection attack, do not assign DBA or admin type access rights to your application accounts. Similarly minimize the privileges of the operating system account that the database process runs under.




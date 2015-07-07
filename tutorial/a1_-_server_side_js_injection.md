##  A1 - 1 Server Side JS Injection

### Description

When `eval()`, `setTimeout()`, `setInterval()`, `Function()`are used to
process user provided inputs, it can be exploited by an attacker to inject and
execute malicious JavaScript code on server.

### Attack Mechanics

Web applications using the JavaScript `eval()`function to parse the incoming
data without any type of input validation are vulnerable to this attack. An
attacker can inject arbitrary JavaScript code to be executed on the server.
Similarly `setTimeout()`, and `setInterval()`functions can take code in string
format as a first argument causing same issues as `eval()`.

This vulnerability can be very critical and damaging by allowing attacker to
send various types of commands.


**Denial of Service Attack:**

{%youtube%}krOx9QWwcYw{%endyoutube%}

An effective denial-of-service attack can be executed simply by sending the
commands below to `eval()`function:

    
    while(1)

This input will cause the target server's event loop to use 100% of its
processor time and unable to process any other incoming requests until process
is restarted.

An alternative DoS attack would be to simply exit or kill the running process:

    
    process.exit()

or

    
    process.kill(process.pid) 

**File System Access**   

Another potential goal of an attacker might be to read the contents of files
from the server. For example, following two commands list the contents of the
current directory and parent directory respectively:

    
    res.end(require('fs').readdirSync('.').toString())
    
    res.end(require('fs').readdirSync('..').toString()) 

Once file names are obtained, an attacker can issue the command below to view
the actual contents of a file:

    
    res.end(require('fs').readFileSync(filename))

An attacker can further exploit this vulnerability by writing and executing
harmful binary files using `fs`and `child_process`modules.

### How Do I Prevent It?

To prevent server-side js injection attacks:

  * Validate user inputs on server side before processing
  * Do not use `eval()`function to parse user inputs. Avoid using other commands with similar effect, such as `setTimeOut()`, `setInterval()`, and `Function()`. 
  * For parsing JSON input, instead of using `eval()`, use a safer alternative such as `JSON.parse()`. For type conversions use type related `parseXXX()`methods. 
  * Include `"use strict"`at the beginning of a function, which enables [ strict mode ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)within the enclosing function scope.

### Source Code Example

In `routes/contributions.js`, the `handleContributionsUpdate()`function
insecurely uses `eval()`to covert user supplied contribution amounts to
integer.

    
    
            // Insecure use of eval() to parse inputs
            var preTax = eval(req.body.preTax);
            var afterTax = eval(req.body.afterTax);
            var roth = eval(req.body.roth);
                                

This makes application vulnerable to SSJS attack. It can fixed simply by using
`parseInt()`instead.

    
    
            //Fix for A1 -1 SSJS Injection attacks - uses alternate method to eval
            var preTax = parseInt(req.body.preTax);
            var afterTax = parseInt(req.body.afterTax);
            var roth = parseInt(req.body.roth);
                                

In addition, all functions begin with `use strict`pragma.

### Further Reading

  * [“ServerSide JavaScript Injection: Attacking NoSQL and Node.js"](https://media.blackhat.com/bh-us-11/Sullivan/BH_US_11_Sullivan_Server_Side_WP.pdf) a whitepaper by Bryan Sullivan.

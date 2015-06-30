Web applications using the JavaScript `eval()`function to parse the incoming
data without any type of input validation are vulnerable to this attack. An
attacker can inject arbitrary JavaScript code to be executed on the server.
Similarly `setTimeout()`, and `setInterval()`functions can take code in string
format as a first argument causing same issues as `eval()`.

This vulnerability can be very critical and damaging by allowing attacker to
send various types of commands.

**Denial of Service Attack:**

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
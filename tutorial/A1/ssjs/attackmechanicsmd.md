Web applications using the JavaScript `eval()`function to parse the incoming
data without any type of input validation are vulnerable to this attack. An
attacker can inject arbitrary JavaScript code to be executed on the server.
Similarly `setTimeout()`, and `setInterval()`functions can take code in string
format as a first argument causing same issues as `eval()`.

This vulnerability can be very critical and damaging by allowing attacker to
send various types of commands.
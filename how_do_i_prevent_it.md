To prevent server-side js injection attacks:

  * Validate user inputs on server side before processing
  * Do not use `eval()`function to parse user inputs. Avoid using other commands with similar effect, such as `setTimeOut()`, `setInterval()`, and `Function()`. 
  * For parsing JSON input, instead of using `eval()`, use a safer alternative such as `JSON.parse()`. For type conversions use type related `parseXXX()`methods. 
  * Include `"use strict"`at the beginning of a function, which enables [ strict mode ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode)within the enclosing function scope.
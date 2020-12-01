# What is a factorion
A factorion is a number `n` where the sum of the factorial of digits is equal to `n`. For example:
```
40585 => 4! + 0! + 5! + 8! + 5! => 24 + 1 + 120 + 40320 + 120 = 40585 :checkmark:
```

# Ok, so what is this file
This file is a brute force lazy "proof" which finds all factorions less than 99M - the factorial of a single digit in base 10 is ~3M, so each new digit would only add ~3M to the sum. That's only 7 digits (plus one for roll-over).

I stumbled on factorions on reddit and didn't do any research (d'oh) and decided to write a quick thing to find factorions. I was going to do a general proof of max limit too, but as I was doing my proof I decided to actually look this stuff up and the maximum limit for factorions was proven already (of course).

# Adventures in debugging and performance
So I actually slapped this code together (without memoization) and threw it in Chrome, and Chrome seemed to get to 88k and die. I think it's because of throttling at the VM level that may be going on. The code doesn't take up that much memory (functions, 10-digit cache, factorion result cache), so I was pretty sure there wasn't a memory leak. Regardless, Chrome stopped responding after 20 or 30 seconds of running this, so I thought maybe it was just computing too much (?) so I added memoization to also just speed up operations. No dice. Went over to node and everything ran (had console logs to display where I was in processing).

By the way, performance for 99,999,999 checks:
- with cache: 571,158 ms
- no cache: 612,215 ms

I imagine this is because the operations are pretty simple (most complicated is `10!`), so total time save in the order of 7%. With some fancier value manipulation I could probably also cache the pieces of a value:
```
9940585 => 9 * sumCacheCheck(940585)
```

This, however would present problems with numbers like 203:
```
203 => 2 * sumCacheCheck(03) => 2 * sumCacheCheck(3) // wrong
```

Would need to preserve the 0 (because 0! = 1, which would otherwise lead to a lot off off-by-one errors and possible false positives). I've done this in the past using strings but casting numbers to strings seems pretty slow:
```
let numberString = i.toString();
let currentNumber = parseInt(numberString.shift());
let rest = numberString.join('');
let sum;
if (typeof cache[rest] !== 'undefined') {
  sum = cache[rest]
} else {
  sum = calculateFactorialSum(rest);
}
sum *= i;
```
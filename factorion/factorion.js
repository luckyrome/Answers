/**
 * Calculate the factorial of a number
 *
 * @param {Number} n target to calculate factorial for
 * @return 1 * ... * (n-1) * n, or 1 if n is < 2
 */
const factorialActual = function(n) {
  if (n < 0) {
    // this is imaginary. too crazy for a simple javascript experiment
    throw new Exception("WHAT");
  }
  let result = 1;
  if (n === 0 || n === 1) {
    return result;
  }
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

/**
 * Memoizes a simple function. Assumes one arg
 * 
 * @param {Function} f target function to cache
 * @return memoized function
 */
const memoize = function(f) {
  let cache = {};
  return function(arg) {
    if (typeof cache[arg] !== 'undefined') {
      return cache[arg];
    }
    console.log("Calculating results for arg " + arg);
    cache[arg] = factorialActual(arg);
    return cache[arg];
  };
};

const factorial = memoize(factorialActual);

/**
 * Determines whether or not an integer is a factorion.
 * A factorion is an integer which is equal to the sum of factorials of its digits.
 *
 * @param {Number} n target to validate
 */
const validateFactorion = function(n) {
  if (n < 1) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i <= Math.log10(n); i++) {
    // cut off stuff to the right
    let current = n / Math.pow(10, i);
    // cut off stuff to the left
    current = Math.floor(current % 10);
    
    sum += factorial(current);
  }
  return sum === n;
};

let checkEmAll = function() {
  let factorions = [];
  for (let i = 0; i < 999999999; i++) {
    if (validateFactorion(i)) {
      factorions.push(i);
    }
  }
  console.log("Found the following factorions less than 99,999,999", factorions);
};

// quick tests for known values
console.assert(validateFactorion(40585) === true);
console.assert(validateFactorion(100) === false);

// Found the following factorions less than 99,999,999 [ 1, 2, 145, 40585 ]
let startTime = Date.now();
checkEmAll();
let endTime = Date.now();
let totalTime = endTime - startTime;
console.log("start " + startTime + " end " + endTime + " total diff " + (endTime - startTime), totalTime);
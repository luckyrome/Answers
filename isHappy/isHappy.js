/**
 * Simple reinventing the wheel. Returns true if value is contained in array
 *
 * @param array the array being searched
 * @param value the value we're searching for
 * @return boolean true if the array contains the value, false otherwise
 */
window.arrayContains = function (array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}

/**
 * Finds "Happy Numbers"
 *
 * A happy number is a number where if one takes the squares of the sums of the number's digits
 * recursively, that value will eventually equal 1 (one). 
 * e.g: 7 => 7*7 == 49 => 4*4 + 9*9 == 97 => 9*9 + 7*7 == 130 => 1*1 + 3*3 + 0*0 == 10 => 1*1 + 0*0 == 1
 * This method returns true if the input is a happy number and false otherwise.
 * 
 * @param input the number we're starting with
 * @param prev an array with the previous values (to track for looping - if the sequence loops, there is no end)
 * @return boolean true if the number's digit square-sum eventually equals 1(one), false otherwise.
 */
window.isHappy = function (input, prev) {
    var prevArray = prev;
    
    if (typeof prevArray == 'undefined') {
        prevArray = [];
    }

    if (arrayContains(prevArray, input)) {
        return false;
    }
    sum = 0;
    
    // This is the Math I want
    // also, had to convert Math.log to Math.log-base10 because Math.log is the natural log
    for (var i = 0; i <= Math.floor(Math.log(input) / Math.log(10)); i++ ) {

        //this part is "cut off right side" with the input/pow, then "cut off left side" with mod 10. Had to floor because Math.pow converts int into float
        var singleDigit = Math.floor(input / Math.pow(10,i)) % 10;
        sum += Math.pow(singleDigit, 2);
    }
    if (sum == 1) {
        return true;
    } else {
        prevArray.push(input);
        return window.isHappy(sum, prevArray);
    }
}

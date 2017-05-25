/**
 * 
 */

Array.prototype.contains = function(elem) {
	for (var i in this){
		if (this[i] == elem) return true;
	}
	return false;
}

if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
	    'use strict';
	    if (this == null) {
	    	throw new TypeError('can\'t convert ' + this + ' to object');
	    }
	    var str = '' + this;
	    count = +count;
	    if (count != count) {
	    	count = 0;
	    }
	    if (count < 0) {
	    	throw new RangeError('repeat count must be non-negative');
	    }
	    if (count == Infinity) {
	    	throw new RangeError('repeat count must be less than infinity');
	    }
	    count = Math.floor(count);
	    if (str.length == 0 || count == 0) {
	    	return '';
	    }
	    // Ensuring count is a 31-bit integer allows us to heavily optimize the
	    // main part. But anyway, most current (August 2014) browsers can't handle
	    // strings 1 << 28 chars or longer, so:
	    if (str.length * count >= 1 << 28) {
	    	throw new RangeError('repeat count must not overflow maximum string size');
	    }
	    var rpt = '';
	    for (;;) {
	    	if ((count & 1) == 1) {
	    		rpt += str;
	    	}
	    	count >>>= 1;
	    	if (count == 0) {
	    		break;
	    	}
	    	str += str;
	    }
	    // Could we try:
	    // return Array(count + 1).join(this);
	    return rpt;
	}
}

/*Roman Numeral to Integer Conversion*/

function roman_numeral_to_integer(number){
	var conversion_dict = {'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1};
	var md = ['M', 'D'];
	var cl = ['C', 'L'];
	var xv = ['X', 'V'];
		
	var roman_numeral = number.toUpperCase();
	var result_int = 0;
	var previous = null;
	var last_added = 0;
	for (var num in roman_numeral){
		var numeral = roman_numeral[num];
		if (numeral in conversion_dict){
			if ((md.contains(numeral) && previous == "C") || (cl.contains(numeral) && previous == "X") || (xv.contains(numeral) && previous == "I")){
				result_int -= last_added;
				last_added = conversion_dict[numeral] - conversion_dict[previous];
				result_int += last_added;
				previous = numeral;
			}
			else {
				result_int += conversion_dict[numeral];
				previous = numeral;
				last_added = conversion_dict[numeral];
			}
		}
		else {
			return "ERROR: " + roman_numeral + " is not a valid set of roman numerals";
		}
	}
	return result_int;
}

function RomanToIntConversion(){
	$("button#rnToInt-btn").on('click', function(){
		var roman_numeral = document.getElementById("rnToInt-input").value;
		var output = document.getElementById("rnToInt-output");
		output.innerHTML = roman_numeral_to_integer(roman_numeral);
	});
}

$("button#rnToInt-btn").on('click', RomanToIntConversion());

/*Integer to Roman Numeral Conversion*/

function integer_to_roman_numeral(number){
	var num_conversion_dict = {1000: 'M', 500: 'D', 100: 'C', 50: 'L', 10: 'X', 5: 'V', 1: 'I'};
	var int_num = number;
	var powers = [1000, 100, 10, 1];
	var result_rn = '';
	if (number > 3999) {
		return "ERROR: " + number + " is too large to be converted to Roman Numerals. Must be less than 3999. Try again";
	}


	for(var pow = 0; pow < powers.length; pow++) {
		var p = powers[pow];
		var div_num = Math.floor(int_num/p);
		if (div_num < 1) {
			continue;
		}
		else {
			if (p == 1000) {
				result_rn += num_conversion_dict[p].repeat(div_num);
			}
			else {
				if (div_num == 9){
					result_rn += num_conversion_dict[p] + num_conversion_dict[10*p];
				}
				else if (div_num > 5){
					result_rn += num_conversion_dict[5*p] + num_conversion_dict[p].repeat(div_num-5);
				}
				else if (div_num == 5){
					result_rn += num_conversion_dict[5*p];
				}
				else if (div_num == 4){
					result_rn += num_conversion_dict[p] + num_conversion_dict[5*p];
				} 
				else {
					result_rn += num_conversion_dict[p].repeat(div_num);
				}
			}
			int_num = int_num % p
		}
	}
	return result_rn;
}

function IntToRomanConversion(){
	$("button#intToRn-btn").on('click', function(){
		var inty = document.getElementById("intToRn-input").value;
		var output = document.getElementById("intToRn-output");
		output.innerHTML = integer_to_roman_numeral(inty);
	});
}

$("button#intToRn-btn").on('click', IntToRomanConversion());

/*Binary to Integer Conversion*/

function binary_to_integer(bits) {
	var bit_string = bits;
	var io = new Array('1', '0');
	var bit_pos = bit_string.length;
	var result_int = 0;
	
	for (var i = 0; i < bit_string.length; i++){
		bit_pos--;
		
		if (bit_string[i] == '1'){
			result_int += Math.pow(2, bit_pos);
		}
		else if (bit_string[i] == '0'){
			continue;
		}
		else {
			return "ERROR: " + bits + " is an invalid bit string. Try again.";
		}
	}
	return result_int;
}

function BinaryToIntConversion() {
	$("button#binToInt-btn").on('click', function(){
		var binary = document.getElementById("binToInt-input").value;
		var output = document.getElementById("binToInt-output");
		output.innerHTML = binary_to_integer(binary);
	});
}

$("button#binToInt-btn").on('click', BinaryToIntConversion());

/*Integer to Binary Conversion*/

function integer_to_binary(int) {
	var result_string = '';
	var comp_int = Math.abs(int);
	if (int == 0){
		return '0';
	}

	while (comp_int > 0){
		var bit = comp_int % 2;
		result_string = bit.toString() + result_string;
		comp_int = Math.floor(comp_int / 2);
	}
	if (int < 0) {
		result_string = '1-' + result_string;
	}
	else {
		result_string = '0-' + result_string;
	}
	return result_string;
}

function IntToBinaryConversion() {
	$("button#intToBin-btn").on('click', function(){
		var int = document.getElementById("intToBin-input").value;
		var output = document.getElementById("intToBin-output");
		output.innerHTML = integer_to_binary(int);
	});
}

$("button#intToBin-btn").on('click', IntToBinaryConversion());


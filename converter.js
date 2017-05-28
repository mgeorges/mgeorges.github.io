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

function Converter(fromType, toType, value) {
	this.fromType = fromType;
	this.toType = toType;
	this.value = value;
	this.positive = true;
	this.note = '';
	this.error = '';
	this.convert = function() {
		if (this['is_' + this.fromType]()){
			if (this.fromType == this.toType){
				return this.setSign(this.value);
			}
			else {
				return this[this.fromType + '_to_' + this.toType]();
			}
		}
		else {
			return this.error;
		}
	}
	this.setSign = function(result) {
		if (this.positive) {
			if (this.toType == 'binary'){
				return '0-' + result;
			}
			return result;
		}
		else if (this.toType == 'integer') {
			return -Math.abs(result);
		}
		else if (this.toType == 'binary') {
			return '1-' + result;
		}
		else {
			return '-' + result;
		}
	}
}

Converter.prototype.is_integer = function() {
	var num_val = Number(this.value);
	if (num_val) {
		//Set sign to positive or negative
		if (num_val != Math.abs(num_val)) {
			num_val = Math.abs(num_val);
			this.positive = false;
		}
		if (num_val != Math.floor(num_val)){
			if (this.positive) {
				this.note = 'Number rounded down to nearest integer: ' + Math.floor(num_val).toString()+'. ';
			}
			else {
				this.note = 'Number rounded up to nearest integer: ' + -Math.floor(num_val).toString()+'. ';
			}
		}
		this.value = Math.floor(num_val);
		return true;
	}
	else {
		this.error = 'ERROR: ' + this.value + ' is not a valid input. Try Again';
		return false;
	}
}

Converter.prototype.is_roman_numeral = function() {
	var roman_numeral_list = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];

	var temp_val = null;
	if (this.value[0] == '-'){
		this.positive = false;
		temp_val = this.value.slice(1).toUpperCase();
	}
	else {
		temp_val = this.value.toUpperCase();
	}

	for (var index = 0; index < temp_val.length; index++){
		if (!(roman_numeral_list.contains(temp_val[index]))){
			this.error = 'ERROR: '+ this.value + ' is not a valid set of roman numerals';
			return false;
		}
	}
	this.value = temp_val;
	return true;
}

Converter.prototype.is_binary = function() {
	var temp_val = this.value;
	var io = ['1', '0'];
	if (this.value.length >= 3){
		if (this.value.slice(0, 2) == '1-') {
			this.positive = false;
			temp_val = this.value.slice(2);
		}
		else if (this.value.slice(0, 2) == '0-') {
			 temp_val = this.value.slice(2);
		}
	}
	for (var index = 0; index < temp_val.length; index++) {
		if (!(io.contains(temp_val[index]))){
			this.error = "ERROR: " + this.value + " is an invalid bit string. Try again.";
			return false;
		}
	}
	this.value = temp_val;
	return true;
}

Converter.prototype.roman_numeral_to_integer = function(){
	var conversion_dict = {'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1};
	var md = ['M', 'D'];
	var cl = ['C', 'L'];
	var xv = ['X', 'V'];
		
	var roman_numeral = this.value.toUpperCase();
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
	if (this.positive) {
		return result_int;
	}
	else {
		return -Math.abs(result_int);
	}
}

Converter.prototype.integer_to_roman_numeral = function(){
	var num_conversion_dict = {1000: 'M', 500: 'D', 100: 'C', 50: 'L', 10: 'X', 5: 'V', 1: 'I'};
	var int_num = Number(this.value);
	var powers = [1000, 100, 10, 1];
	var result_rn = '';
	if (this.value > 3999) {
		return "ERROR: " + this.value + " is too large to be converted to Roman Numerals. Must be less than 3999. Try again";
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
			int_num = int_num % p;
		}
	}
	if (this.positive) {
		return result_rn;
	}
	else {
		return '-' + result_rn;
	}
}
	
Converter.prototype.binary_to_integer = function() {
	var bit_string = this.value;
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
			return "ERROR: " + this.value + " is an invalid bit string. Try again.";
		}
	}
	if (this.positive){
		return result_int;
	}
	else {
		return -Math.abs(result_int);
	}
}
	
Converter.prototype.integer_to_binary = function() {
	var result_string = '';
	var comp_int = this.value;
	console.log(this.value);
	if (this.value == 0){
		return '0';
	}

	while (comp_int > 0){
		var bit = comp_int % 2;
		result_string = bit.toString() + result_string;
		comp_int = Math.floor(comp_int / 2);
	}

	if (this.positive) {
		result_string = '0-' + result_string;
	}
	else {
		result_string = '1-' + result_string;
	}
	this.note += 'The preceding bit indicates 1 if negative and 0 if positive.\n';
	return result_string;
}

Converter.prototype.binary_to_roman_numeral = function() {
	this.value = this.binary_to_integer();
	if (this.is_integer()){
		return this.integer_to_roman_numeral();
	}
	else {
		this.error = "ERROR: Something went wrong"
		return this.error;
	}
}

Converter.prototype.roman_numeral_to_binary = function() {
	this.value = this.roman_numeral_to_integer();
	if (this.is_integer()){
		return this.integer_to_binary();
	}
	else {
		this.error = "ERROR: Something went wrong"
		return this.error;
	}
}

Converter.prototype.html_display = function(result) {
	var display_html = "";
	if (this.note) {
		display_html += "<p class='note'>" + this.note + "</p>";
	}
	if (this.error){
		display_html += "<p class='answer center error'>" + result + "</p>";
	}
	else {
		if (this.toType == 'roman_numeral') {
			display_html += "<p class='answer roman center'>" + result + "</p>";
		}
		else {
			display_html += "<p class='answer center'>" + result + "</p>";
		}
	}
	return display_html;
}



$(document).ready(function(){

	$("button#convert").on('click', function(){
		var from_type = document.getElementById('fromType').value;
		var to_type = document.getElementById('toType').value;
		var val = document.getElementById('value').value;
		var output = document.getElementById('converter-output');

		var conv = new Converter(from_type, to_type, val);
		var result = conv.convert();
		output.innerHTML = conv.html_display(result);
	});
});

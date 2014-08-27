// ==========================================================================
// Project:   Derailleur.Torrent
// Copyright: ©2009 Kevin Glowacz
// ==========================================================================

/*
 *   Converts file & folder byte size values to more
 *   readable values (B, KB, MB, GB or TB).
 *
 *   @param integer bytes
 *   @returns string
 */
Math.formatBytes = function(bytes) {
  var size, unit;

  // Terabytes (TB).
  if ( bytes >= 1000000000000 ) {
    size = bytes / 1000000000000;
    unit = 'TB';
  }

  // Gigabytes (GB).
  else if ( bytes >= 1000000000 ) {
    size = bytes / 1000000000;
    unit = 'GB';
  }

  // Megabytes (MB).
  else if ( bytes >= 1000000 ) {
    size = bytes / 1000000;
    unit = 'MB';
  }

  // Kilobytes (KB).
  else if ( bytes >= 1000 ) {
    size = bytes / 1000;
    unit = 'KB';
  }

  // The file is less than one KB
  else {
    size = bytes;
    unit = 'B';
  }

  if (size !== 0) { size = Number(size).toPrecision(3); }

  return size + ' ' + unit;
};

/*
 *   Converts seconds to more readable units (hours, minutes etc).
 *
 *   @param integer seconds
 *   @returns string
 */
Math.formatSeconds = function(seconds)
{
  var result, days, hours, minutes;

  days = Math.floor(seconds / 86400);
  hours = Math.floor((seconds % 86400) / 3600);
  minutes = Math.floor((seconds % 3600) / 60);
  seconds = Math.floor((seconds % 3600) % 60);

  if (days > 0 && hours === 0){
    result = days + ' ' + 'days';
  }
  else if (days > 0 && hours > 0){
    result = days + ' ' + 'days' + ' ' + hours + ' ' + 'hr';
  }
  else if (hours > 0 && minutes === 0){
    result = hours + ' ' + 'hr';
  }
  else if (hours > 0 && minutes > 0){
    result = hours + ' ' + 'hr' + ' ' + minutes + ' ' + 'min';
  }
  else if (minutes > 0 && seconds === 0){
    result = minutes + ' ' + 'min';
  }
  else if (minutes > 0 && seconds > 0){
    result = minutes + ' ' + 'min' + ' ' + seconds + ' ' + 'sec';
  }
  else{
    result = seconds + ' ' + 'sec';
  }

  return result;
};

/*
 *   Round a float to a specified number of decimal
 *   places, stripping trailing zeroes
 *
 *   @param float floatnum
 *   @param integer precision
 *   @returns float
 */
Math.roundWithPrecision = function(floatnum, precision) {
    return Math.round ( floatnum * Math.pow ( 10, precision ) ) / Math.pow ( 10, precision );
};


/*
 *   Given a numerator and denominator
 *
 *   @param float
 *   @param float
 *   @returns string
 */
Math.ratio = function(numerator, denominator) {
	var result = Math.floor(100 * numerator / denominator) / 100;

	if(isNaN(result)) { result = 0; }
	if(result==="Infinity") { result = "&infin;"; }
	if((result % 1) === 0) { result += '.00'; }

	return result;
};

/*
 *   Converts total and left until done to a percenage value
 *
 *   @param float
 *   @param float
 *   @returns float
 */
Math.formatPercent = function(total, left_until_done) {
  if(!total) { return 0; }
  if(!left_until_done && left_until_done !== 0) { return 0; }
  if (left_until_done === 0) { return 100; }

  return Number((Math.floor((total - left_until_done) * 10000 / total) / 100).toFixed(2));
};

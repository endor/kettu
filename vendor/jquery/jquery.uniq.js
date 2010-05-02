/** jQuery.uniq
* Author: Florent Vaucelle (florentvaucelle@gmail.com)
* 
* Get uniq values from an Array
* Data type is respected
* Usage: jQuery.uniq(anArray)
* 
* Requirement: jQuery >= 1.3
*/

;(function($) {
  $.uniq = function(notUniqArray) {
    // Check that we were given an array
    // If not, return the object
    if (!$.isArray(notUniqArray)) return notUniqArray
    
    // Add each array value as a key in a map
    var map = {}
    for (var index in notUniqArray) {
      value = notUniqArray[index]
      // Store type_value as a map key,
      // unless 5 and '5' would be the same as a map key
      map[typeof value + '_' + value] = value
    }
    
    // Build a new array with each map keys
    var uniqValues = []
    for (var key in map) {
      uniqValues.push(map[key])
    }
    
    return uniqValues
  };
})(jQuery);
var Validator = function() {};

Validator.prototype = {
  has_errors: function() {
    return this.errors.length > 0;
  },
  
  validate: function(object) {
    this.errors = [];
    for(validation in this.schema) {
      switch(validation) {
        case 'presence_of':
          this.validate_presence_of(object, this.schema[validation]);
          break;
        case 'numericality_of':
          this.validate_numericality_of(object, this.schema[validation]);
          break;
        case 'inclusion_of':
          this.validate_inclusion_of(object, this.schema[validation]);
          break;
      }
    }
  },
  
  validate_presence_of: function(object, fields) {
    var context = this;
    fields = this.arrayfy_fields(fields);

    $.each(fields, function() {
      var field = object[this];
      if(typeof(field) == 'undefined') {
        context.errors.push({'field': this, 'message': context.error_messages['presence_of']})
      }      
    });
  },
  
  validate_numericality_of: function(object, fields) {
    var context = this;
    fields = this.arrayfy_fields(fields);

    $.each(fields, function() {
      if(this == '[object Object]') {
        if(object[this['field']] == undefined) {
          context.errors.push({'field': this['field'], 'message': context.error_messages['numericality_of']});
        } else {
          var field = object[this['field']].toString();
          if(!field.match(/^\d+$/) || field > this['max']) {
            context.errors.push({'field': this['field'], 'message': context.error_messages['numericality_of']});
          }          
        }
      } else {
        if(object[this] == undefined) {
          context.errors.push({'field': this, 'message': context.error_messages['numericality_of']});
        } else {
          var field = object[this].toString();
          if(!field.match(/^\d+$/)) {
            context.errors.push({'field': this, 'message': context.error_messages['numericality_of']});
          }          
        }
      }
    });
  },
  
  validate_inclusion_of: function(object, field) {
    var content = object[field['field']];
    var included = false;

    $.each(field['in'], function() {
      if(this == content) {
        included = true;
      }
    });
    if(!included) {
      this.errors.push({'field': field['field'], 'message': this.error_messages['inclusion_of']});
    }
  },
  
  arrayfy_fields: function(fields) {
    if(!$.isArray(fields)) {
      return [fields];
    } else {
      return fields;
    }
  },
  
  schema: {},
  errors: [],
  
  error_messages: { 
    presence_of: 'should not be empty', 
    numericality_of: 'is not a valid number',
    inclusion_of: 'is not in the list of a valid values'
  }
};
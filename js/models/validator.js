/*global kettu, _*/

kettu.Validator = function() {};

kettu.Validator.prototype = {
  has_errors: function() {
    return this.errors.length > 0;
  },

  validate: function(object) {
    this.errors = [];
    for(var validation in this.schema) {
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

    _.each(fields, function(field_id) {
      var field = object[field_id];
      if(typeof(field) == 'undefined') {
        context.errors.push({'field': field_id, 'message': context.error_messages['presence_of']});
      }
    });
  },

  validate_numericality_of: function(object, fields) {
    var context = this;
        fields = this.arrayfy_fields(fields);

    _.each(fields, function(field_id) {
      if(field_id == '[object Object]') {
        if(object[field_id['field']] === undefined) {
          context.errors.push({'field': field_id['field'], 'message': context.error_messages['numericality_of']});
        } else {
          var field = object[field_id['field']].toString();
          if(!field.match(/^\d+$/) || field > field_id['max']) {
            context.errors.push({'field': field_id['field'], 'message': context.error_messages['numericality_of']});
          }
        }
      } else {
        if(object[field_id] === undefined || object[field_id] === null) {
          context.errors.push({'field': field_id, 'message': context.error_messages['numericality_of']});
        } else {
          if(!object[field_id].toString().match(/^\d+$/)) {
            context.errors.push({'field': field_id, 'message': context.error_messages['numericality_of']});
          }
        }
      }
    });
  },

  validate_inclusion_of: function(object, field) {
    var content = object[field['field']],
        included = _.reduce(field['in'], function(included, item) {
          return included || item == content;
        }, false);

    if(!included) {
      this.errors.push({'field': field['field'], 'message': this.error_messages['inclusion_of']});
    }
  },

  arrayfy_fields: function(fields) {
    return _.flatten([fields]);
  },

  schema: {},
  errors: [],

  error_messages: {
    presence_of: 'should not be empty',
    numericality_of: 'is not a valid number',
    inclusion_of: 'is not in the list of a valid values'
  }
};

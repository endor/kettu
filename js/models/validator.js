kettu.Validator = function() {};

kettu.Validator.prototype = {
  has_errors: function() {
    return this.errors.length > 0;
  },

  validate: function(object) {
    this.errors = [];

    _.each(this.schema, function(value, key) {
      switch(key) {
        case 'presence_of':
          this.validate_presence_of(object, this.schema.presence_of);
          break;
        case 'numericality_of':
          this.validate_numericality_of(object, this.schema.numericality_of);
          break;
        case 'inclusion_of':
          this.validate_inclusion_of(object, this.schema.inclusion_of);
          break;
      }
    }.bind(this));
  },

  validate_presence_of: function(object, fields) {
    fields = this.arrayfy_fields(fields);

    _.each(fields, function(field_id) {
      var field = object[field_id];

      if(typeof(field) === 'undefined') {
        this.errors.push({'field': field_id, 'message': this.error_messages.presence_of});
      }
    }.bind(this));
  },

  validate_numericality_of: function(object, fields) {
    fields = this.arrayfy_fields(fields);

    _.each(fields, function(field_id) {
      if(_.isObject(field_id)) {
        if(object[field_id.field] === undefined) {
          this.errors.push({'field': field_id.field, 'message': this.error_messages.numericality_of});
        } else {
          var field = object[field_id.field].toString();
          if(!field.match(/^\d+$/) || field > field_id.max) {
            this.errors.push({'field': field_id.field, 'message': this.error_messages.numericality_of});
          }
        }
      } else {
        if(object[field_id] === undefined || object[field_id] === null) {
          this.errors.push({'field': field_id, 'message': this.error_messages.numericality_of});
        } else {
          if(!object[field_id].toString().match(/^\d+$/)) {
            this.errors.push({'field': field_id, 'message': this.error_messages.numericality_of});
          }
        }
      }
    }.bind(this));
  },

  validate_inclusion_of: function(object, field) {
    var content = object[field.field],
        included = _.reduce(field['in'], function(included, item) {
          return included || item === content;
        }, false);

    if(!included) {
      this.errors.push({'field': field.field, 'message': this.error_messages.inclusion_of});
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

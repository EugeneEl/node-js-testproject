const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: {
    type: 'string',
    default: '',
  },
  name: {
    type: 'string',
    default: '',
  },
  eventDescription: {
    type: 'string',
    default: '',
  },
  startDate: {
    type: 'date',
    default: null,
  },
  endDate: {
    type: 'date',
    default: null,
  },
  userID: {
    type: 'string',
    default: null,
  },
});

eventSchema.methods.publicKeys = function() {
  return {
    id: this.id,
    name: this.name,
    eventDescription: this.eventDescription,
    startDate: this.startDate,
    endDate: this.endDate,
    userID: this.userID,
  };
};

exports.eventModel = mongoose.model('Events', eventSchema);

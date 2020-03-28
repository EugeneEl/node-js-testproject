const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: 'string',
    default: '',
  },
  connectToTelegramID: {
    type: 'string',
    default: '',
  },
  email: {
    type: 'string',
    default: '',
  },
  password: {
    type: 'string',
    default: '',
  },
  name: {
    type: 'string',
    default: '',
  },
  gender: {
    type: 'string',
    default: '',
  },
  country: {
    type: 'string',
    default: '',
  },
  city: {
    type: 'string',
    default: '',
  },
  phone: {
    type: 'string',
    default: '',
  },
  description: {
    type: 'string',
    default: '',
  },
});

userSchema.methods.publicKeys = function() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    token: this.token,
    gender: this.gender,
    country: this.country,
    city: this.city,
    phone: this.phone,
    description: this.description,
  };
};

exports.userModel = mongoose.model('User', userSchema);

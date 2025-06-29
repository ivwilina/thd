const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    ref: 'Employee',
    required: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  _id: false
});

// Instance methods as defined in UML
logSchema.methods.getLogDetails = function() {
  return `${this.action} by ${this.employeeId} at ${this.timestamp}`;
};

// Static methods as defined in UML
logSchema.statics.createLog = async function(logData) {
  const log = new this(logData);
  return await log.save();
};

logSchema.statics.getLog = async function(id) {
  return await this.findById(id).populate('employeeId');
};

logSchema.statics.updateLog = async function(id, updateData) {
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return !!result;
};

logSchema.statics.deleteLog = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

logSchema.statics.getAllLogs = async function() {
  return await this.find({}).populate('employeeId');
};

logSchema.statics.getLogsByEmployee = async function(employeeId) {
  return await this.find({ employeeId }).populate('employeeId');
};

module.exports = mongoose.model('Log', logSchema);

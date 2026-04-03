const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String
}, { _id: false });

const documentSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  contactNumber: String,
  email: String,
  summary: String,
  qualifications: [String],
  certifications: [String],
  professionalExperience: [experienceSchema],
  skills: [String],
  languages: [String],
  hobbies: [String],
  researchStatement: String,
  documents: [documentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);

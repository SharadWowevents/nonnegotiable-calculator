const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  
  // 1. Self
  fajr: { type: Boolean, default: false },
  zuhr: { type: Boolean, default: false },
  asr: { type: Boolean, default: false },
  maghrib: { type: Boolean, default: false },
  isha: { type: Boolean, default: false },
  tahajjud: { type: Boolean, default: false },
  zikrDone: { type: Boolean, default: false },
  quranMinutes: { type: Number, default: '' },
  bookName: { type: String, default: '' },
  bookPages: { type: Number, default: '' },
  readingMinutes: { type: Number, default: '' },
  exerciseMinutes: { type: Number, default: '' },
  
  // 2. Marketing
  contentCreated: { type: Boolean, default: false },
  referralPlanDone: { type: Boolean, default: false },
  drsVisited: { type: Number, default: '' },
  patientsReferred: { type: Number, default: '' },
  instagramPosts: { type: Number, default: '' },
  gmbReviews: { type: Number, default: '' },
  
  // 3. Sales
  outpatients: { type: Number, default: '' },
  surgicalCasesDay: { type: Number, default: '' },
  surgeriesPerformedSales: { type: Number, default: '' },
  nonSurgicalInpatients: { type: Number, default: '' },
  
  // 4. Delivery
  surgeriesPerformedDelivery: { type: Number, default: '' },
  reviewsTaken: { type: Number, default: '' },
  testimonialsTaken: { type: Number, default: '' },
  
  // 5. Finance
  finOpd: { type: Number, default: '' },
  finLab: { type: Number, default: '' },
  finPharmacy: { type: Number, default: '' },
  finSurgical: { type: Number, default: '' },
  finNonSurgical: { type: Number, default: '' },
  
  // 6. AI
  learning: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);
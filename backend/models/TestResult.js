const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const testResultSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
        patientUniqueId: { type: String, required: true },
        sampleID: { type: mongoose.Schema.Types.ObjectId, ref: "Sample", required: true },
        uploadedBy: { type: String, required: true },
        dateTested: { type: Date, required: true },
        resultFile: { type: String, required: true },
        diagnosis: { type: String },
        prescription: { type: String },
        //   status: { type: String, enum: ["Draft", "Doctor Review", "Published"], required: true },

        // NEW FIELDS
        testType: { type: String },  // e.g., "Chemistry", "Hematology"
        testRun: { type: [String], required: true }, // e.g., "Blood Sugar", "Lipid Panel"  
        bloodSugarLevel: { type: Number },  // Store blood sugar level if applicable
        bloodPressure: {
            systolic: { type: Number, default: null },
            diastolic: { type: Number, default: null }
        },
        turnaroundTime: { type: Number },  // Hours taken from sample collection to result publication
        reviewedBy: { type: String },  // Doctor who reviewed the test

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TestResult', testResultSchema);

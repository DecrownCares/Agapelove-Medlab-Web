const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Function to generate a unique Sample ID
const generateSampleId = async function () {
    const lastSample = await Sample.findOne().sort({ sampleId: -1 });
    const lastNumber = lastSample ? parseInt(lastSample.sampleId.replace(/\D/g, "")) : 1000;
    return `AMLADTID${lastNumber + 1}`;
};

const sampleSchema = new Schema(
    {
        sampleId: {
            type: String,
            unique: true,
        },
        patientId: {
            type: String,
            required: true,
        },
        owner: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },
        sampleType: {
            type: String,
            required: true,
        },
        collectionDate: {
            type: Date,
            required: true,
        },
        testType: { 
            type: String, 
            required: true 
        },
        testRun: {
            type: String,
            required: true,
        },
        selectedTests: [
            {
                name: String,
                price: Number
            }
        ],
        contactInfo: {
            email: { type: String, default: "N/A" },
            phone: { type: String, default: "N/A" },
            address: { type: String, default: "N/A" },
        },
        status: {
            type: String,
            enum: ["Pending", "Doctor Review", "Processed", "Deleted", "Cancelled"],
            default: "Pending",
        },
        referral: {
            type: String,
            default: "Self",
        },
        billing: {
            totalBill: { type: Number, required: true },
            amountPaid: { type: Number, required: true, default: 0 },
            balance: { type: Number, required: true, default: 0 },
            fullPaymentConfirmation: { type: String, default: "" },
        },
        resultFile: { 
            type: String, 
            default: null 
        },
        paymentConfirmedBy: {
            type: String,
            default: "N/A",
        },
        registeredBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Auto-generate Sample ID before saving
sampleSchema.pre("save", async function (next) {
    if (!this.sampleId) {
        this.sampleId = await generateSampleId();
    }
    next();
});

const Sample = mongoose.model("Sample", sampleSchema);
module.exports = Sample;

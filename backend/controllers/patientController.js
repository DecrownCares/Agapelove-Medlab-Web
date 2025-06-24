const Patients = require('../models/Patients');
const bcrypt = require('bcrypt');
const emailService = require('../services/emailService');
const TestResult = require('../models/TestResult');
const Message = require('../models/messages');
const Notification = require('../models/Notification');
const Staffs = require('../models/users');
const Appointment = require('../models/Appointments');
const Sample = require("../models/MedicalRecords");


const getPatientProfile = async (req, res) => {
    try {
      console.log('Authenticated user:', req.user); // Debugging line
      const patientId = req.user._id;
  
      if (!patientId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const user = await Patients.findById(patientId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
   
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        message: 'Error fetching user',
        error: error.message,
      });
    }
  };
  
  
  const updatePatientProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Extract user ID from token
        const updates = req.body; // Get the updated fields from request
  
        // Find the user and update the necessary fields
        const updatedUser = await Patients.findByIdAndUpdate(userId, updates, { new: true });
  
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
  
        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  
  
  const uploadAvatar = async (req, res) => {
    try {
      // Ensure file was uploaded 
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Update user's avatar in the database
      const patientId = req.user._id;
      const imagePath = `/uploads/${req.file.filename}`; // Path to the uploaded file
  
      const user = await Patients.findByIdAndUpdate(
        patientId,
        { imageUrl: imagePath },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Image uploaded successfully', imageUrl: user.imageUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ message: 'Error uploading avatar', error: error.message });
    }
  }
  
  
  const getLoginHistory = async (req, res) => {
    try {
        const user = await Patients.findById(req.user._id, 'loginHistory');
        if (!user) return res.status(404).json({ success: false, message: "Patient not found" });
  
        res.json({ success: true, history: user.loginHistory });
    } catch (error) {
        console.error("Error fetching login history:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
  };


  const getPatientById = async (req, res) => {
    try {
        console.log("Received params:", req.params);
  
        const { labPatientId } = req.params;
        console.log("Searching for patient with ID:", labPatientId);
  
        const patient = await Patients.findOne({ labPatientId: labPatientId })
            .populate({
                path: "testResults",
                select: "_id resultFile dateTested uploadedBy diagnosis prescription sampleID",
                populate: [
                    {
                        path: "uploadedBy",
                        model: "Staffs",
                        select: "fullName",
                    },
                    {
                        path: "sampleID",
                        model: "Sample",
                        select: "sampleId status", // Ensure status is included
                    }
                ]
            })
            .populate({
                path: "notifications",
                select: "message createdAt",
            })
            .populate({
                path: "messages",
                select: "sender content createdAt",
            })
            .populate({
                path: "medicalRecords",
                select: "sampleId testRun collectionDate registeredBy status",
            });

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Modify testResults to include the sample status as the test status
        const testResultsWithStatus = patient.testResults.map(result => ({
            ...result.toObject(),
            status: result.sampleID ? result.sampleID.status : "Doctor Review" // Default to "Pending"
        }));

        // Send updated testResults with status field included
        res.status(200).json({ 
            ...patient.toObject(), 
            testResults: testResultsWithStatus 
        });

    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
}; 


  const getResults = async (req, res) => {
    try {
        const patientId = req.user._id;
        
        const results = await Patients.findById(patientId)
            .populate({
                path: "testResults",
                // options: { sort: { createdAt: -1 } },
                select: "_id resultFile dateTested createdAt uploadedBy diagnosis prescription sampleID",
                populate: [
                    { 
                        path: "uploadedBy",
                        model: "Staffs",
                        select: "fullName",
                    },
                    {
                        path: "sampleID",
                        model: "Sample",
                        select: "sampleId status", // Ensure status is included
                    }
                ],
                
            });

        if (!results) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Filter testResults to include only those where sampleID.status is "Processed"
        const filteredResults = results.testResults.filter(result => 
            result.sampleID && result.sampleID.status === "Processed"
        );

        // Send only the filtered test results
        res.json({ ...results.toObject(), testResults: filteredResults });

    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Server error" });
    }
};


  module.exports = {
    getPatientProfile,
    updatePatientProfile,
    uploadAvatar,
    getLoginHistory,
    getPatientById,
    getResults,
  };


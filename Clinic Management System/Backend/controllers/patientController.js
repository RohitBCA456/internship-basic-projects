import { Patient } from "../models/patientModel.js";
import { Token } from "../models/tokenModel.js";
import { Prescription } from "../models/prescriptionModel.js";
import { Bill } from "../models/billModel.js";

let tokenCounter = 1;

const generateTokenNumber = async () => {
  const latestToken = await Token.findOne().sort({ createdAt: -1 });
  if (latestToken) {
    const lastNumber = parseInt(latestToken.tokenNumber.split("-")[1], 10);
    tokenCounter = lastNumber + 1;
  }
  return `T-${String(tokenCounter).padStart(3, "0")}`;
};

export const registerPatient = async (req, res) => {
  try {
    let { name, age, contact, gender } = req.body;
    console.log("registerPatient data coming from frontend: ", req.body);

    name = name.toLowerCase().trim();
    gender = gender.toLowerCase().trim();

    if (!name || !age || !contact || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Step 1: Create patient without token
    const newPatient = await Patient.create({
      name,
      age,
      contact,
      gender,
    });

    const tokenNumber = await generateTokenNumber();

    const newToken = await Token.create({
      tokenNumber,
      patientId: newPatient._id,
    });

    newPatient.token = newToken._id;
    await newPatient.save();

    res.status(201).json({
      success: true,
      message: "Patient registered successfully.",
      data: {
        patient: newPatient,
        token: newToken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const seePatientsHistory = async (req, res) => {
  try {
    const patients = await Patient.find().populate("token").sort({ createdAt: 1 });

    const result = [];

    for (const patient of patients) {
      // Get bills
      const bills = await Bill.find({ patientId: patient._id });
      if (bills.length === 0) continue; // Only include patients who have a bill

      // Get prescriptions separately
      const prescriptions = await Prescription.find({ patientId: patient._id });

      result.push({
        patient,
        bills,
        prescriptions,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getAllPatientsByPrescription = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: 1 });

    const withPrescription = [];
    const withoutPrescription = [];

    for (const patient of patients) {
      const prescriptions = await Prescription.find({ patientId: patient._id });
      const token = await Token.findOne({ patientId: patient._id });

      const patientData = {
        ...patient.toObject(),
        token,
      };

      if (prescriptions.length > 0) {
        withPrescription.push({
          patient: patientData,
          prescriptions,
        });
      } else {
        withoutPrescription.push(patientData);
      }
    }

    res.status(200).json({
      success: true,
      withPrescription,
      withoutPrescription,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

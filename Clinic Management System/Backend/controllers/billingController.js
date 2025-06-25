import { Prescription } from "../models/prescriptionModel.js";
import { Bill } from "../models/billModel.js";
import { Patient } from "../models/patientModel.js";

export const generateBill = async (req, res) => {
  try {
    const { patientId, services, amount } = req.body;

    if (!patientId || !services || !Array.isArray(services) || services.length === 0 || !amount) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    const bill = await Bill.create({ patientId, services, amount });

    res.status(201).json({
      success: true,
      message: "Bill generated successfully.",
      data: bill,
    });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getBillsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const bills = await Bill.find({ patientId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getPatientsWithPrescriptionNoBill = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate("patientId");
    const bills = await Bill.find();

    const billedPatientIds = new Set(bills.map(b => b.patientId.toString()));

    const filteredPatients = prescriptions
      .filter(p => !billedPatientIds.has(p.patientId._id.toString()))
      .map(p => p.patientId);

    const uniquePatients = Array.from(
      new Map(filteredPatients.map(p => [p._id.toString(), p])).values()
    );

    res.status(200).json({ success: true, data: uniquePatients });
  } catch (err) {
    console.error("Error fetching filtered patients:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

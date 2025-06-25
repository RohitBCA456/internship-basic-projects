import { Patient } from "../models/patientModel.js";
import { Token } from "../models/tokenModel.js";
import { Prescription } from "../models/prescriptionModel.js";

export const getPatientByToken = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findOne({ tokenNumber: tokenId }).populate(
      "patientId"
    );
    if (!token || !token.patientId) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Patient not found with given token.",
        });
    }

    res.status(200).json({ success: true, data: token.patientId });
  } catch (error) {
    console.error("Error fetching patient by token:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, notes } = req.body;
    const doctorId = req.user?._id;

    if (!patientId || !doctorId || !medicines || medicines.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing." });
    }

    const newPrescription = await Prescription.create({
      patientId,
      doctorId,
      medicines,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Prescription saved successfully.",
      data: newPrescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

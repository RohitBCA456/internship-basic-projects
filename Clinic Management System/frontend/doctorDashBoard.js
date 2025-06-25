const seePatientsBtn = document.getElementById("seePatientsBtn");
const logoutBtn = document.getElementById("logoutBtn");

const patientTableSection = document.getElementById("patientTableSection");
const patientTableBody = document.getElementById("patientTableBody");

const prescriptionFormSection = document.getElementById("prescriptionFormSection");
const prescriptionForm = document.getElementById("prescriptionForm");
const medicinesInput = document.getElementById("medicines");
const notesInput = document.getElementById("notes");

let patients = [];
let selectedPatient = null;
let doctorId = null; // You should fetch and set this from /auth/getCurrentUser if needed

// Handle see all new patients
seePatientsBtn.onclick = async () => {
  prescriptionFormSection.classList.add("hidden");
  patientTableSection.classList.remove("hidden");

  try {
    const res = await fetch("http://localhost:5000/patient/getPatientsByPrescription", {
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      patients = data.withoutPrescription || [];
      renderPatients();
    } else {
      alert("Failed to fetch patients.");
    }
  } catch (err) {
    console.error("Error fetching patients:", err);
    alert("Error fetching patients.");
  }
};

// Render patients without prescription
function renderPatients() {
  patientTableBody.innerHTML = "";
  patients.forEach((p, index) => {
    const tokenId = p.token?.tokenNumber || "N/A";

    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.contact}</td>
        <td>${tokenId}</td>
        <td><button onclick="addPrescription(${index})">Add Prescription</button></td>
      </tr>`;
    patientTableBody.innerHTML += row;
  });
}

// Show prescription form
window.addPrescription = (index) => {
  selectedPatient = patients[index];
  patientTableSection.classList.add("hidden");
  prescriptionFormSection.classList.remove("hidden");
};

// Handle prescription form submit
prescriptionForm.onsubmit = async (e) => {
  e.preventDefault();
  const medicines = medicinesInput.value.trim();
  const notes = notesInput.value.trim();

  if (!medicines || !selectedPatient?._id) {
    return alert("Medicines are required.");
  }

  try {

    const res = await fetch("http://localhost:5000/prescription/createPrescriptions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: selectedPatient._id,
        medicines,
        notes,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`Prescription added for ${selectedPatient.name}`);
      prescriptionForm.reset();
      prescriptionFormSection.classList.add("hidden");
      selectedPatient = null;
      seePatientsBtn.click(); // Refresh patient list
    } else {
      alert("Failed to submit prescription.");
    }
  } catch (err) {
    console.error("Error submitting prescription:", err);
    alert("Server error.");
  }
};

// Logout function
logoutBtn.onclick = async () => {
  try {
    const res = await fetch("http://localhost:5000/user/logout", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      alert("Logged out successfully.");
      window.location.href = "login.html";
    } else {
      alert("Logout failed.");
    }
  } catch (err) {
    console.error("Logout error:", err);
    alert("Logout error.");
  }
};

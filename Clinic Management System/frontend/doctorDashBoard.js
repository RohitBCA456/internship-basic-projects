const seePatientsBtn = document.getElementById("seePatientsBtn");
const logoutBtn = document.getElementById("logoutBtn");

const patientTableSection = document.getElementById("patientTableSection");
const patientTableBody = document.getElementById("patientTableBody");

const prescriptionFormSection = document.getElementById("prescriptionFormSection");
const prescriptionForm = document.getElementById("prescriptionForm");
const medicinesInput = document.getElementById("medicines");
const notesInput = document.getElementById("notes");

let patients = [
  { name: "Rohit", age: 28, gender: "Male", contact: "1234567890" },
  { name: "Sita", age: 34, gender: "Female", contact: "9876543210" },
];
let selectedPatient = null;

seePatientsBtn.onclick = () => {
  prescriptionFormSection.classList.add("hidden");
  patientTableSection.classList.remove("hidden");
  renderPatients();
};

logoutBtn.onclick = () => {
  alert("Logging out...");
  // Redirect to login if needed
};

function renderPatients() {
  patientTableBody.innerHTML = "";
  patients.forEach((p, index) => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.contact}</td>
        <td><button onclick="addPrescription(${index})">Add Prescription</button></td>
      </tr>`;
    patientTableBody.innerHTML += row;
  });
}

window.addPrescription = (index) => {
  selectedPatient = patients[index];
  patientTableSection.classList.add("hidden");
  prescriptionFormSection.classList.remove("hidden");
};

prescriptionForm.onsubmit = (e) => {
  e.preventDefault();
  const medicines = medicinesInput.value;
  const notes = notesInput.value;

  alert(`Prescription submitted for ${selectedPatient.name}\nMedicines: ${medicines}\nNotes: ${notes}`);
  
  prescriptionForm.reset();
  prescriptionFormSection.classList.add("hidden");
  selectedPatient = null;
};

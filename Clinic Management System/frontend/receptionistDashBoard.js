// DOM Element References
const registerBtn = document.getElementById("registerBtn");
const seePatientsBtn = document.getElementById("seePatientsBtn");
const seeHistoryBtn = document.getElementById("seeHistoryBtn");
const logoutBtn = document.getElementById("logoutBtn");
const generateBillBtn = document.getElementById("generateBillBtn");

const formSection = document.getElementById("registerForm");
const tableSection = document.getElementById("patientTableSection");
const historySection = document.getElementById("patientHistorySection");
const billingSection = document.getElementById("billingSection");
const createBillForm = document.getElementById("createBillForm");

const patientForm = document.getElementById("patientForm");
const patientTableBody = document.getElementById("patientTableBody");
const historyTableBody = document.getElementById("historyTableBody");
const billTableBody = document.getElementById("billTableBody");

const billForm = document.getElementById("billForm");
const billServicesInput = document.getElementById("billServices");
const billAmountInput = document.getElementById("billAmount");

const billModal = document.getElementById("billModal");
const modalTokenContent = document.getElementById("modal-token-content");

// Data Storage
let patients = [];
let billHistory = []; // Stores patients for whom tokens are generated
let bills = [];       // Stores completed bills
let selectedBillPatient = null;

// Register View
registerBtn.onclick = () => {
  formSection.classList.remove("hidden");
  tableSection.classList.add("hidden");
  historySection.classList.add("hidden");
  billingSection.classList.add("hidden");
  createBillForm.classList.add("hidden");
};

// See All Patients
seePatientsBtn.onclick = () => {
  formSection.classList.add("hidden");
  tableSection.classList.remove("hidden");
  historySection.classList.add("hidden");
  billingSection.classList.add("hidden");
  createBillForm.classList.add("hidden");
  renderPatients();
};

// See Patient History
seeHistoryBtn.onclick = () => {
  formSection.classList.add("hidden");
  tableSection.classList.add("hidden");
  historySection.classList.remove("hidden");
  billingSection.classList.add("hidden");
  createBillForm.classList.add("hidden");
  renderHistory();
};

// Generate Bill View
generateBillBtn.onclick = () => {
  formSection.classList.add("hidden");
  tableSection.classList.add("hidden");
  historySection.classList.add("hidden");
  createBillForm.classList.add("hidden");
  billingSection.classList.remove("hidden");
  renderBillList();
};

// Logout
logoutBtn.onclick = () => {
  alert("Logging out...");
  // You can add redirect or session clear logic here
};

// Handle Form Submission
patientForm.onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const contact = document.getElementById("contact").value;

  patients.push({ name, age, gender, contact });
  patientForm.reset();
  alert("Patient Registered!");
};

// Render All Patients Table
function renderPatients() {
  patientTableBody.innerHTML = "";
  patients.forEach((p, index) => {
    const row = `
      <tr>
        <td data-label="Name">${p.name}</td>
        <td data-label="Age">${p.age}</td>
        <td data-label="Gender">${p.gender}</td>
        <td data-label="Contact">${p.contact}</td>
        <td data-label="Action">
          <button onclick="openModal(${index})">Generate Token</button>
        </td>
      </tr>`;
    patientTableBody.innerHTML += row;
  });
}

// Show Token Modal & Save to History
function openModal(index) {
  billModal.classList.remove("hidden");

  const tokenId = `T-${String(index + 1).padStart(3, "0")}`;
  const p = patients[index];

  // Save to history if not already present
  const exists = billHistory.find(h => h.tokenId === tokenId);
  if (!exists) {
    billHistory.push({ ...p, tokenId });
  }

  const content = `
    <strong>Token for:</strong><br>
    Name: ${p.name}<br>
    Age: ${p.age}<br>
    Gender: ${p.gender}<br>
    Contact: ${p.contact}<br>
    Token ID: ${tokenId}<br>
  `;
  modalTokenContent.innerHTML = content;
}

// Close Modal
function closeModal() {
  billModal.classList.add("hidden");
}

// Download Dummy Token as PDF
function downloadBill() {
  const blob = new Blob(["Token Receipt (Dummy Content)"], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "token_receipt.pdf";
  link.click();
  closeModal();
}

// Print Token Info
function printBill() {
  const printContent = modalTokenContent.innerHTML;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<html><head><title>Print Token</title></head><body>${printContent}</body></html>`);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
}

// Render Patient History Table
function renderHistory() {
  historyTableBody.innerHTML = "";
  billHistory.forEach(p => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.contact}</td>
        <td>${p.tokenId}</td>
      </tr>`;
    historyTableBody.innerHTML += row;
  });
}

// Render Unbilled Patients for Bill Creation
function renderBillList() {
  billTableBody.innerHTML = "";

  const unbilled = billHistory.filter(p =>
    !bills.find(b => b.tokenId === p.tokenId)
  );

  unbilled.forEach((p, index) => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.contact}</td>
        <td><button onclick="openBillForm(${index})">Create Bill</button></td>
      </tr>
    `;
    billTableBody.innerHTML += row;
  });
}

// Show Create Bill Form
function openBillForm(index) {
  const unbilled = billHistory.filter(p =>
    !bills.find(b => b.tokenId === p.tokenId)
  );
  selectedBillPatient = unbilled[index];

  billingSection.classList.add("hidden");
  createBillForm.classList.remove("hidden");
}

// Handle Bill Form Submission
billForm.onsubmit = (e) => {
  e.preventDefault();
  const services = billServicesInput.value;
  const amount = billAmountInput.value;

  bills.push({
    ...selectedBillPatient,
    services,
    amount
  });

  alert(`Bill generated for ${selectedBillPatient.name}`);
  billForm.reset();
  createBillForm.classList.add("hidden");
  billingSection.classList.remove("hidden");
  renderBillList();
};

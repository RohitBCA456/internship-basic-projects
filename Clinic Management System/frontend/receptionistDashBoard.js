// DOM References
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

const recordModal = document.getElementById("recordModal");
const recordModalContent = document.getElementById("recordModalContent");

let patientList = [];
let selectedBillPatient = null;

// Navigation Buttons
registerBtn.onclick = () => {
  formSection.classList.remove("hidden");
  tableSection.classList.add("hidden");
  historySection.classList.add("hidden");
  billingSection.classList.add("hidden");
  createBillForm.classList.add("hidden");
};

seePatientsBtn.onclick = async () => {
  formSection.classList.add("hidden");
  tableSection.classList.remove("hidden");
  historySection.classList.add("hidden");
  billingSection.classList.add("hidden");
  createBillForm.classList.add("hidden");
  await renderPatients();
};

seeHistoryBtn.onclick = () => {
  formSection.classList.add("hidden");
  tableSection.classList.add("hidden");
  historySection.classList.remove("hidden");
  billingSection.classList.add("hidden");
  createBillForm.classList.add("hidden");
  renderHistory();
};

generateBillBtn.onclick = () => {
  formSection.classList.add("hidden");
  tableSection.classList.add("hidden");
  historySection.classList.add("hidden");
  createBillForm.classList.add("hidden");
  billingSection.classList.remove("hidden");
  renderBillList();
};


// logout functionality for user(receptionist & doctor)
logoutBtn.onclick = async () => {
  const response = await fetch("http://localhost:5000/user/logout", {
    method: "GET",
    credentials: "include",
  });

  if (response.ok) {
    alert("logout successfully.");
    window.location.href = "login.html";
  } else {
    alert("something went wrong while logging out.");
  }
};

// Patient Registration
patientForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const contact = document.getElementById("contact").value.trim();

  if (!name || !age || !gender || !contact)
    return alert("All fields are required.");

  try {
    const res = await fetch("http://localhost:5000/patient/registerPatient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, gender, contact }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Patient registered successfully!");
      patientForm.reset();
      formSection.classList.add("hidden");
    } else alert(data.message || "Registration failed.");
  } catch (err) {
    alert("Server error.");
  }
};

// Render Patients Without Prescription
async function renderPatients() {
  patientTableBody.innerHTML = "";
  try {
    const res = await fetch(
      "http://localhost:5000/patient/getPatientsByPrescription"
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const patients = data.withoutPrescription || [];
    if (patients.length === 0)
      return (patientTableBody.innerHTML = `<tr><td colspan="5">All patients have prescriptions.</td></tr>`);

    patients.forEach((p) => {
      const row = `<tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.contact}</td>
        <td>${p?.token?.tokenNumber || "Not generated"}</td>
      </tr>`;
      patientTableBody.innerHTML += row;
    });

    patientList = patients;
  } catch (err) {
    alert("Failed to fetch patients.");
  }
}

// Render Patient History
async function renderHistory() {
  historyTableBody.innerHTML = "";
  try {
    const res = await fetch("http://localhost:5000/patient/getPatientHistory");
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const entries = data.data;
    if (entries.length === 0) {
      historyTableBody.innerHTML = `<tr><td colspan="6">No history found.</td></tr>`;
      return;
    }

    entries.forEach((entry) => {
      const p = entry.patient;
      const viewBtns = `
        <button onclick='showPrescriptionModal(${JSON.stringify(
          entry.prescriptions
        )}, ${JSON.stringify(p)})'>View Prescription</button>
        <button onclick='showBillModal(${JSON.stringify(
          entry.bills
        )}, ${JSON.stringify(p)})'>View Bill</button>
      `;

      const row = `
        <tr>
          <td>${p.name}</td>
          <td>${p.age}</td>
          <td>${p.gender}</td>
          <td>${p.contact}</td>
          <td>${p?.token?.tokenNumber || "Not generated"}</td>
          <td>${viewBtns}</td>
        </tr>
      `;

      historyTableBody.innerHTML += row;
    });
  } catch (err) {
    alert("Failed to load history.");
  }
}

// Print and Download Functions
function printRecord() {
  const wrapper = document
    .getElementById("recordModalContent")
    .querySelector("[data-patient]");
  const win = window.open("", "_blank");
  win.document.write(
    `<html><head><title>Print</title></head><body>${wrapper.innerHTML}</body></html>`
  );
  win.document.close();
  win.print();
}

//download the pdf (prescription or bill)
function downloadRecord() {
  const content = document.getElementById("recordModalContent");
  const wrapper = content.querySelector("[data-patient]");
  const name = wrapper?.getAttribute("data-patient") || "record";
  const type = wrapper?.getAttribute("data-type") || "";
  const filename = `${name.replace(/\s+/g, "_")}${type ? "_" + type : ""}.pdf`;

  const opt = {
    margin: 0.5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().from(wrapper).set(opt).save();
}

// Show Modal (prescription)
function showPrescriptionModal(prescriptions, patient) {
  const html = prescriptions
    .map(
      (pre, i) => `
    <div class="record-box">
      <h4>Prescription ${i + 1}</h4>
      <p><strong>Notes:</strong> ${pre.notes}</p>
      <p><strong>Medicines:</strong></p>
      <ol>${pre.medicines.map((med) => `<li>${med}</li>`).join("")}</ol>
    </div>`
    )
    .join("");

  showRecordModal(
    `Prescription(s) for ${patient.name}`,
    html,
    patient.name,
    "prescription"
  );
}

// show modal (bill)
function showBillModal(bills, patient) {
  const html = bills
    .map(
      (b, i) => `
    <div class="record-box">
      <h4>Bill ${i + 1}</h4>
      <p><strong>Services:</strong></p>
      <ul>${b.services.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p><strong>Amount:</strong> ₹${b.amount}</p>
    </div>`
    )
    .join("");

  showRecordModal(`Bill(s) for ${patient.name}`, html, patient.name, "bill");
}

// show modal (bill or prescription with details)
function showRecordModal(
  title,
  contentHTML,
  patientName = "record",
  type = ""
) {
  recordModalContent.innerHTML = `
    <div data-patient="${patientName}" data-type="${type}">
      <span class="close-btn" onclick="closeRecordModal()">×</span>
      <h3>${title}</h3>
      <div>${contentHTML}</div>
      <div class="modal-buttons">
        <button onclick="downloadRecord()">Download PDF</button>
        <button onclick="printRecord()">Print</button>
      </div>
    </div>
  `;
  recordModal.classList.remove("hidden");
}

//close the record modal
function closeRecordModal() {
  recordModal.classList.add("hidden");
}

// render patients with prescription but no bill
async function renderBillList() {
  billTableBody.innerHTML = "";
  try {
    const res = await fetch(
      "http://localhost:5000/bill/getPatientsWithoutBill"
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const patients = data.data;
    if (patients.length === 0) {
      billTableBody.innerHTML = `<tr><td colspan="6">No patients available for billing.</td></tr>`;
      return;
    }

    patients.forEach((p) => {
      billTableBody.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>${p.age}</td>
          <td>${p.gender}</td>
          <td>${p.contact}</td>
          <td>
            <button onclick='fetchPrescriptionAndShow(${JSON.stringify(
              p
            )})'>View Prescription</button>
            <button onclick='openBillFormFromFetched(${JSON.stringify(
              p
            )})'>Generate Bill</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    alert("Failed to load billing list.");
    console.error(err);
  }
}

//shows the prescription of the patient
async function fetchPrescriptionAndShow(patient) {
  try {
    const res = await fetch(
      `http://localhost:5000/prescription/${patient._id}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showPrescriptionModal(data.data, patient);
  } catch (err) {
    alert("Failed to fetch prescription.");
  }
}

// opens the bill form for the patient
function openBillFormFromFetched(patient) {
  selectedBillPatient = patient;
  billingSection.classList.add("hidden");
  createBillForm.classList.remove("hidden");
}

// enter the details in the bill and submit
billForm.onsubmit = async (e) => {
  e.preventDefault();
  const services = billServicesInput.value.split(",").map((s) => s.trim());
  const amount = billAmountInput.value;

  if (!selectedBillPatient || !services.length || !amount) {
    return alert("All fields are required.");
  }

  try {
    const res = await fetch("http://localhost:5000/bill/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: selectedBillPatient._id,
        services,
        amount,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Bill generated for ${selectedBillPatient.name}`);
      billForm.reset();
      createBillForm.classList.add("hidden");
      billingSection.classList.remove("hidden");
      renderBillList();
    } else {
      alert(data.message || "Failed to generate bill.");
    }
  } catch (err) {
    alert("Server error while generating bill.");
  }
};

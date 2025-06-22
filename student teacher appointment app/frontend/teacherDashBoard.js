async function logout() {
  try {
    const response = await fetch(
      "http://localhost:2000/teacher/logoutTeacher",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Logged out successfully");
      localStorage.clear();
      window.location.href = "login.html";
    } else {
      alert(data.message || "Logout failed: " + data.message);
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("An error occurred during logout.");
  }
}

async function fetchAppointments() {
  const section = document.getElementById("appointmentSection");
  const body = document.getElementById("appointmentBody");

  // Hide approved section
  document.getElementById("approvedSection").style.display = "none";

  section.style.display = "block";
  body.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:2000/appointment/seeAppointments",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("Appointments response:", data);

    if (response.ok && Array.isArray(data.appointments)) {
      const pendingAppointments = data.appointments.filter(
        (a) => a.status === "pending"
      );

      if (pendingAppointments.length === 0) {
        body.innerHTML = `<tr><td colspan="3">No pending appointments.</td></tr>`;
        return;
      }

      pendingAppointments.forEach((appointment) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${appointment.studentId?.name || "Unknown"}</td>
          <td>${appointment.subject || "N/A"}</td>
          <td class="action-icons">
            <i class="fas fa-check-circle" style="color:green" onclick="showConfirmOptions(this, '${
              appointment._id
            }', '${appointment.studentId._id}')"></i>
            <i class="fas fa-times-circle" style="color:red" data-student-id="${
              appointment.studentId._id
            }"
             onclick="rejectAppointment('${appointment._id}', this)"
  >          </i>
          </td>
        `;

        body.appendChild(row);
      });
    } else {
      alert(data.message || "Unauthorized or failed to fetch appointments.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Something went wrong while fetching appointments.");
  }
}

function showConfirmOptions(iconEl, appointmentId, studentId) {
  const parent = iconEl.parentElement;
  parent.innerHTML = `
    <div class="dropdown">
      <input type="date" id="date-${appointmentId}" />
      <input type="time" id="time-${appointmentId}" />
      <button class="btn primary-btn" data-student-id="${studentId}" onclick="confirmAppointment('${appointmentId}', this)">Confirm</button>
    </div>
  `;
}

async function rejectAppointment(appointmentId, iconElement) {
  const studentId = iconElement.getAttribute("data-student-id");

  const response = await fetch(
    `http://localhost:2000/teacher/appointmentController`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        appoitmentStatus: false,
        studentId,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    const row = iconElement.closest("tr");
    row.remove();
  } else {
    alert("Failed to reject: " + data.message);
  }
}

async function confirmAppointment(appointmentId, btnElement) {
  const date = document.getElementById(`date-${appointmentId}`).value;
  const time = document.getElementById(`time-${appointmentId}`).value;

  if (!date || !time) {
    alert("Please enter both date and time.");
    return;
  }

  // Assuming you have studentId stored somewhere, like in a data attribute
  const studentId = btnElement.getAttribute("data-student-id");

  const response = await fetch(
    `http://localhost:2000/teacher/appointmentController`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        appoitmentStatus: true, // 🟢 correct spelling
        studentId,
        date,
        time,
      }),
    }
  );

  if (response.ok) {
    const row = btnElement.closest("tr");
    row.remove();
  } else {
    const data = await response.json();
    alert("Failed to confirm: " + data.message);
  }
}

async function fetchApprovedAppointments() {
  const section = document.getElementById("approvedSection");
  const body = document.getElementById("approvedBody");

  // Hide pending section
  document.getElementById("appointmentSection").style.display = "none";

  section.style.display = "block";
  body.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:2000/appointment/seeAppointments",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok && Array.isArray(data.appointments)) {
      const approved = data.appointments.filter(
        (app) => app.status === "confirmed"
      );

      if (approved.length === 0) {
        body.innerHTML = `<tr><td colspan="4">No approved appointments.</td></tr>`;
        return;
      }

      approved.forEach((appointment) => {
        const rawDate = new Date(appointment.date);
        const formattedDate = rawDate.toLocaleDateString("en-CA");

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${appointment.studentId?.name || "Unknown"}</td>
          <td>${formattedDate}</td>
          <td>${appointment.timeSlot || "N/A"}</td>
          <td>${appointment.status}</td>
        `;
        body.appendChild(row);
      });
    } else {
      alert(data.message || "Failed to fetch approved appointments.");
    }
  } catch (error) {
    console.error("Error fetching approved appointments:", error);
    alert("An error occurred while loading approved appointments.");
  }
}

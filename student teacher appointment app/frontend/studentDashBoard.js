async function logout() {
  try {
    const response = await fetch(
      "http://localhost:2000/student/logoutStudent",
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

async function searchTeacher() {
  const searchQuery = document.getElementById("searchInput").value;
  const response = await fetch("http://localhost:2000/student/searchTeacher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ subject: searchQuery }),
  });

  const data = await response.json();
  console.log("Search response:", data);

  if (response.ok) {
    const resultsContainer = document.getElementById("resultsContainer");
    if (!resultsContainer) {
      console.error("Element with ID 'resultsContainer' not found.");
      return;
    }

    resultsContainer.innerHTML = ""; // Clear previous results
    const teachers = data.data;
    teachers.forEach((teacher) => {
      const teacherDiv = document.createElement("div");
      teacherDiv.className = "teacher-card";
      teacherDiv.setAttribute("data-id", teacher._id); // ADD THIS LINE
      teacherDiv.innerHTML = `
  <h3>${teacher.name}</h3>
  <p><strong>Subject:</strong> ${teacher.subject || teacher.department}</p>
  <div class="card-buttons">
    <button class="btn appointment-btn" onclick="bookAppointment('${
      teacher._id
    }')">Send Appointment</button>
    <button class="btn message-btn" onclick="sendMessage('${
      teacher._id
    }')">Send Message</button>
  </div>
`;
      resultsContainer.appendChild(teacherDiv);

      resultsContainer.appendChild(teacherDiv);
    });
  } else {
    alert(data.message || "Error searching for teachers.");
    document.getElementById("searchInput").value = "";
  }
}

async function bookAppointment(teacherId) {
  try {
    const response = await fetch(
      "http://localhost:2000/appointment/sendAppointment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ teacherId }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Appointment request sent successfully.");
      document.getElementById("searchInput").value = "";
      // Remove the teacher card from the UI
      const teacherCard = document.querySelector(`[data-id='${teacherId}']`);
      if (teacherCard) {
        teacherCard.remove();
      }
    } else {
      alert(data.message || "Failed to send appointment request.");
    }
    const teacherCard = document.querySelector(`[data-id='${teacherId}']`);
    if (teacherCard) {
      teacherCard.remove();
    }
  } catch (error) {
    console.error("Appointment error:", error);
    alert("An error occurred while sending the appointment.");
  }
}

async function seeAppointments() {
  try {
    const response = await fetch(
      "http://localhost:2000/appointment/seeAppointments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("Appointments response:", data);

    if (response.ok) {
      const appointmentsContainer = document.getElementById(
        "appointmentsContainer"
      );
      appointmentsContainer.innerHTML = ""; // Clear previous appointments

      data.appointments.forEach((appointment) => {
        const teacherName = appointment.teacherId?.name || "Unknown";

        const appointmentDiv = document.createElement("div");
        appointmentDiv.className = "appointment-card";
        appointmentDiv.innerHTML = `
      <h3>Appointment with ${teacherName}</h3>
      <p><strong>Date:</strong> ${appointment.date || "Not set"}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot || "Not set"}</p>
      <p><strong>Status:</strong> ${appointment.status}</p>
    `;
        appointmentsContainer.appendChild(appointmentDiv);
      });
    } else {
      alert(data.message || "Error fetching appointments.");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    alert("An error occurred while fetching appointments.");
  }
}

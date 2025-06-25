document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-card");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        credentials: "include", // VERY IMPORTANT to allow cookies to be saved
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");

        console.log(data.role);

        if (data?.role === "receptionist") {
          window.location.href = "receptionistDashBoard.html";
        } else {
          window.location.href = "doctorDashBoard.html";
        }
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});

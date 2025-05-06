// Initialize EmailJS
(function () {
  emailjs.init("PUBLIC_KEY");
})();

document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const serviceID = "SERVICE_ID"; 
    const templateID = "TEMPLATE_ID";
    emailjs
      .sendForm(serviceID, templateID, this)

      .then(() => {
        alert("Message sent successfully!");
        this.reset(); // Clear the form
      })
      .catch((err) => {
        alert("Failed to send message. Please try again.");
        console.error("EmailJS Error:", err);
      });
  });

// GSAP Animations
gsap.from(".navbar", {
  y: -100,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});

gsap.from(".nav-links li", {
  y: -20,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  stagger: 0.2,
  delay: 0.3,
});

gsap.from(".hero-content", {
  opacity: 0,
  y: 50,
  duration: 1.5,
  ease: "power2.out",
});

gsap.from(".hero h2", {
  opacity: 0,
  x: -100,
  duration: 1,
  delay: 0.5,
  ease: "power2.out",
});

gsap.from(".hero p", {
  opacity: 0,
  x: 100,
  duration: 1,
  delay: 0.8,
  ease: "power2.out",
});

gsap.from(".query-form", {
  opacity: 0,
  y: 50,
  duration: 1.5,
  delay: 1,
  ease: "power2.out",
});

// GSAP Hover Effect
gsap.utils.toArray(".input-field").forEach((input) => {
  input.addEventListener("focus", () => {
    gsap.to(input, {
      borderColor: "#00bcd4",
      boxShadow: "0 0 8px rgba(0, 188, 212, 0.6)",
      duration: 0.3,
    });
  });

  input.addEventListener("blur", () => {
    gsap.to(input, {
      borderColor: "#ddd",
      boxShadow: "none",
      duration: 0.3,
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
          gsap.registerPlugin(ScrollTrigger);
        
          // Navbar animation
          gsap.from(".navbar", {
            y: -60,
            duration: 1,
            opacity: 0,
            ease: "bounce.out"
          });
        
          // Animating each section on scroll
          gsap.utils.toArray("section").forEach((section) => {
            gsap.from(section, {
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse", // Play on scroll into view, reverse when out of view
              },
              opacity: 0,
              y: 50,
              duration: 1,
              ease: "power2.out"
            });
          });
        
          // Toggle certificate images
          document.querySelectorAll(".toggle-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              const img = document.getElementById(btn.dataset.target);
              img.classList.toggle("visible");
            });
          });
        });
        
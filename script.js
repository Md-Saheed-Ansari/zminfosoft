// Mobile Navigation Toggle 
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');
const navLinkss = document.querySelectorAll('.nav-list a'); // all menu links

if (mobileMenu && navList) {
    // Toggle menu open/close
    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('show');
        mobileMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinkss.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('show');
            mobileMenu.classList.remove('open');
        });
    });
}

// Navbar Squeeze
const header = document.querySelector(".sticky");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }

});


// nav list active
// Select all sections and nav links
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-list li a");
const footer = document.querySelector("#addresses");

function setActiveLink() {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200; // adjust for header height
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  // 👉 Extra: Highlight HOME when at top
  if (window.scrollY < 10) {
    current = "home";
  }

   if (footer) {
    const footerTop = footer.offsetTop + 800 ; // same offset as sections
    if (scrollY >= footerTop) {
      current = ""; // clear active
    }
  }

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (
      (link.getAttribute("href") === "#" + current) || 
      (current === "home" && link.id === "home")
    ) {
      link.classList.add("active");
    }
  });
}

// Run on scroll
window.addEventListener("scroll", setActiveLink);

// Run on click instantly
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});



// Ensure the menu resets properly when resizing
let resizeTimeout;
let BREAKPOINT;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > BREAKPOINT) {
            navList.classList.remove('show');
            navList.classList.add('desktop-visible');
            mobileMenu.classList.remove('open');
        } else {
            navList.classList.remove('desktop-visible');
        }
    }, 100); // Delay resize processing for better performance
});



document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".hero-slider .slide");
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    function startSlider() {
        showSlide(currentIndex); // show first slide
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 7000);
    }

    startSlider();
});



document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".service");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class based on ID
                if (entry.target.id.includes("service1") || entry.target.id.includes("service4") || entry.target.id.includes("service7")) {
                    entry.target.classList.add("slide-left");
                } else if (entry.target.id.includes("service2") || entry.target.id.includes("service5")) {
                    entry.target.classList.add("slide-bottom");
                } else {
                    entry.target.classList.add("slide-right");
                }
                observer.unobserve(entry.target); // Stop observing after animation starts
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    elements.forEach(element => observer.observe(element));
});


document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".product-card");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class based on ID
                if (entry.target.id.includes("product1") || entry.target.id.includes("product4") || entry.target.id.includes("product7")) {
                    entry.target.classList.add("slide-left");
                } else if (entry.target.id.includes("product2") || entry.target.id.includes("product5") || entry.target.id.includes("product8")) {
                    entry.target.classList.add("slide-bottom");
                } else {
                    entry.target.classList.add("slide-right");
                }
                observer.unobserve(entry.target); // Stop observing after animation starts
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    elements.forEach(element => observer.observe(element));
});


document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".stat");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class based on ID
                if (entry.target.id.includes("stat1")) {
                    entry.target.classList.add("slide-left");
                } else if (entry.target.id.includes("stat3")) {
                    entry.target.classList.add("slide-bottom");
                } else {
                    entry.target.classList.add("slide-right");
                }
                observer.unobserve(entry.target); // Stop observing after animation starts
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    elements.forEach(element => observer.observe(element));
});




// Email Validation Function
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Phone Number Validation Function
function validatePhone(phone) {
    const regex = /^\d{10}$/; // Accepts 10 to 15 digit numbers
    return regex.test(phone);
}

// Form Submit Handler
document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const business = document.getElementById("business").value.trim();
    const message = document.getElementById("message").value.trim();
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const API_BASE = window.APP_CONFIG.BACKEND_URL;

    // Basic Field Validation
    if (!name || !email || !phone || !business || !message) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    if (!validateEmail(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }

    if (!validatePhone(phone)) {
        showToast("Please enter a valid phone number only 10 digits.", "error");
        return;
    }

    // Disable the button while processing
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const response = await fetch(`${API_BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName: name, email, phone, business, message }),
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.message || "Message sent successfully!", "success");
            document.getElementById("contact-form").reset();
        } else {
            showToast(result.message || "Failed to send message. Please try again.", "success");
        }
    } catch (error) {
        showToast("Something went wrong. Please try again later.", "error");
    }

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = "SUBMIT";
});


// popup

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const iconContainer = toast.querySelector(".toast-icon");
  const messageContainer = toast.querySelector(".toast-message");

  // Set icon SVG
   const icons = {
    success: `
      <svg fill="#ffffff" viewBox="0 0 16 16">
        <path d="M16 2L6 14L0 8l2-2 4 4L14 0z"/>
      </svg>
    `,
    error: `
      <svg fill="#ffffff" viewBox="0 0 16 16">
        <path d="M1.41 1.41L8 8l6.59-6.59L16 2 9.41 8.59 16 15.17l-1.41 1.41L8 10.41l-6.59 6.59L0 15.17 6.59 8.59 0 2z"/>
      </svg>
    `
  };

  // Apply content
  iconContainer.innerHTML = icons[type];
  messageContainer.textContent = message;

  // Clear existing classes
  toast.className = "";
  toast.classList.add("show");

  // Add class based on type
  if (type === "success") {
    toast.classList.add("toast-success");
  } else if (type === "error") {
    toast.classList.add("toast-error");
  }

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show", "toast-success", "toast-error");
  }, 3000);
}


// Gallery Image Section
const images = document.querySelectorAll(".carousel img");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;
let interval;

// Show first image
images[index].classList.add("active");

// Function to show image
function showImage() {
  images.forEach((img) => img.classList.remove("active"));
  images[index].classList.add("active");
}

// Auto change every 4 seconds
function startAuto() {
  interval = setInterval(() => {
    index = (index + 1) % images.length;
    showImage();
  }, 4000);
}

// Stop auto
function stopAuto() {
  clearInterval(interval);
}

// Next button
nextBtn.addEventListener("click", () => {
  stopAuto();
  index = (index + 1) % images.length;
  showImage();
  startAuto();
});

// Previous button
prevBtn.addEventListener("click", () => {
  stopAuto();
  index = (index - 1 + images.length) % images.length;
  showImage();
  startAuto();
});

// Pause on hover
document.querySelector(".wrapper").addEventListener("mouseover", stopAuto);
document.querySelector(".wrapper").addEventListener("mouseleave", startAuto);

// Start automatic slideshow on load
startAuto();




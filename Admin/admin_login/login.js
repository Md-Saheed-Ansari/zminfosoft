// Admin/admin-login/login.js
const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const username = formData.get("username");
  const password = formData.get("password");
  const API_BASE = window.APP_CONFIG.BACKEND_URL;

  try {
    const response = await fetch(`${API_BASE}/api/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("📬 Server response:", data);

    if (response.ok) {
      localStorage.setItem("token", data.token);
      sessionStorage.setItem("toastMessage", "Admin Login Successfully!");
      sessionStorage.setItem("toastType", "success");
      window.location.href = "/Admin/admin-dashboard/dashboard.html"; 
      showToast("Admin Login Successfully!", "success");
    } else {
      showToast(data.message || "Login failed", "error");
    }
  } catch (err) {
    showToast("Something went wrong. Please try again.", "error");
  }
});


// Check for toast message from previous page
window.addEventListener("DOMContentLoaded", () => {
  const message = sessionStorage.getItem("toastMessage");
  const type = sessionStorage.getItem("toastType");

  if (message) {
    showToast(message, type || "success");

    // Clear it so it doesn't show again
    sessionStorage.removeItem("toastMessage");
    sessionStorage.removeItem("toastType");
  }
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


// --- Tab switching ---
document.querySelectorAll("#dashboardTabs button").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".dashboard-section").forEach(section => section.classList.add("d-none"));
    document.querySelector(this.dataset.target).classList.remove("d-none");
    document.querySelectorAll("#dashboardTabs button").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
  });
});

// --- On load ---
let allEmployees = [];

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "/Admin/admin_login/login.html";

  fetchMessages(token);
  fetchEmployees(token);
});

// --- View Messages ---
function fetchMessages(token) {
  const container = document.getElementById("messagesList");
  const API_BASE = window.APP_CONFIG.BACKEND_URL;
  container.innerHTML = `<div class="text-center my-3"><div class="spinner-border text-primary"></div></div>`;

  fetch(`${API_BASE}/api/admin/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      container.innerHTML = data.map(msg => `
        <div class="card mb-2 position-relative">
          <div class="card-body">
<div class="d-flex justify-content-between align-items-center">
  <h5 class="mb-0">${msg.name}</h5>
  <div class="d-flex align-items-center">
    ${!msg.isRead ? `<span class="badge bg-success me-2">NEW</span>` : ``}
    ${!msg.isRead ? `<button class="btn btn-sm btn-outline-primary" onclick="markMessageAsRead('${msg._id}')">Mark as Read</button>` : ``}
  </div>
</div>
            <p class="mb-1"><strong>Email:</strong> ${msg.email}</p>
            <p class="mb-1"><strong>Phone:</strong> ${msg.phone}</p>
            <p class="mb-1"><strong>Business Type:</strong> ${msg.business}</p>
            <p class="mb-0">${msg.message}</p>
          </div>
        </div>
      `).join('');
    });
}
                           
function markMessageAsRead(id) {
  const token = localStorage.getItem("token");
  const API_BASE = window.APP_CONFIG.BACKEND_URL;

  fetch(`${API_BASE}/api/admin/messages/${id}/mark-read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(() => {
    fetchMessages(token);
    showNotification("Message marked as read", "info");
  }).catch(err => {
    showNotification("Failed to mark as read", "danger");
  });
}





// --- Employee Management ---
function fetchEmployees(token) {
  const API_BASE = window.APP_CONFIG.BACKEND_URL;

  fetch(`${API_BASE}/api/admin/employees`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      allEmployees = data; // Save original list for searching
      renderEmployeeList(data);
    });
}


function renderEmployeeList(data) {
  const container = document.getElementById("employeeList");
  container.innerHTML = data.map(emp => `
    <div class="card mb-2" id="employeeCard_${emp._id}">
      <div class="card-body d-flex justify-content-between flex-wrap">
        <div>
          <h5>${emp.name}</h5>
          <p><strong>Role:</strong> ${emp.role}</p>
          <p><strong>Email:</strong> ${emp.email}</p>
          <p><strong>Phone:</strong> ${emp.phone}</p>
          <p><strong>Salary:</strong> ₹${emp.salary}</p>
        </div>
        <div class="text-end">
          <button class="btn btn-sm btn-warning" onclick="editEmployee('${emp._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp._id}')">Delete</button>
        </div>
      </div>
      <!-- Edit Form (Initially hidden) -->
      <div class="card-body" id="editForm_${emp._id}" style="display: none;">
        <input type="text" id="editName_${emp._id}" value="${emp.name}" class="form-control mb-2">
        <input type="text" id="editRole_${emp._id}" value="${emp.role}" class="form-control mb-2">
        <input type="email" id="editEmail_${emp._id}" value="${emp.email}" class="form-control mb-2">
        <input type="text" id="editPhone_${emp._id}" value="${emp.phone}" class="form-control mb-2">
        <input type="number" id="editSalary_${emp._id}" value="${emp.salary}" class="form-control mb-2">
        <button class="btn btn-sm btn-success" onclick="saveEmployeeChanges('${emp._id}')">Save</button>
        <button class="btn btn-sm btn-secondary" onclick="cancelEdit('${emp._id}')">Cancel</button>
      </div>
    </div>
  `).join('');
}




// --- Create Employee ---
function createEmployee() {
  const token = localStorage.getItem("token");
  const name = document.getElementById("employeeName").value;
  const role = document.getElementById("employeeRole").value;
  const email = document.getElementById("employeeEmail").value;
  const phone = document.getElementById("employeePhone").value;
  const salary = document.getElementById("employeeSalary").value;
  const API_BASE = window.APP_CONFIG.BACKEND_URL;

  if (!name || !role || !email || !phone || !salary) {
    return showNotification("All fields are required", "danger");
  }

  fetch(`${API_BASE}/api/admin/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, role, email, phone, salary: Number(salary) })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to add employee");
    return res.json();
  })
  .then(() => {
    fetchEmployees(token); // Re-fetch the employee list
    resetCreateForm(); // Clear the form after successful addition
    document.getElementById("addEmployeeForm").style.display = "none";
    showNotification("Employee added successfully!", "success");
  })
  .catch(err => {
    showNotification("Failed to add employee", "danger");
  });
}

function resetCreateForm() {
  document.getElementById("employeeName").value = "";
  document.getElementById("employeeRole").value = "";
  document.getElementById("employeeEmail").value = "";
  document.getElementById("employeePhone").value = "";
  document.getElementById("employeeSalary").value = "";
}


// --- Delete Employee ---
function deleteEmployee(id) {
  const token = localStorage.getItem("token");
  const API_BASE = window.APP_CONFIG.BACKEND_URL;
  
  if (confirm("Are you sure you want to delete this employee?")) {
    fetch(`${API_BASE}/api/admin/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      fetchEmployees(token);
      showNotification("Employee deleted", "success");
    });
  }
}


// --- Edit Employee ---
let editEmpId = null;

function editEmployee(id) {
  const editForm = document.getElementById(`editForm_${id}`);
  const employeeCard = document.getElementById(`employeeCard_${id}`);
  editForm.style.display = "block";  // Show the edit form
  employeeCard.querySelector('.card-body').style.display = "none"; // Hide employee details
}


// --- Save Employee Changes ---
function saveEmployeeChanges(id) {
  const updatedEmployee = {
    name: document.getElementById(`editName_${id}`).value,
    role: document.getElementById(`editRole_${id}`).value,
    email: document.getElementById(`editEmail_${id}`).value,
    phone: document.getElementById(`editPhone_${id}`).value,
    salary: document.getElementById(`editSalary_${id}`).value
  };
  const API_BASE = window.APP_CONFIG.BACKEND_URL;

  fetch(`${API_BASE}/api/admin/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedEmployee),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  }).then(() => {
    // Directly update the employee card without re-fetching everything
    const employeeCard = document.getElementById(`employeeCard_${id}`);
    
    // Restore the original layout structure
    employeeCard.innerHTML = `
      <div class="card-body d-flex justify-content-between flex-wrap">
        <div>
          <h5>${updatedEmployee.name}</h5>
          <p><strong>Role:</strong> ${updatedEmployee.role}</p>
          <p><strong>Email:</strong> ${updatedEmployee.email}</p>
          <p><strong>Phone:</strong> ${updatedEmployee.phone}</p>
          <p><strong>Salary:</strong> ₹${updatedEmployee.salary}</p>
        </div>
        <div class="text-end">
          <button class="btn btn-sm btn-warning" onclick="editEmployee('${id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${id}')">Delete</button>
        </div>
      </div>
      <div class="card-body" id="editForm_${id}" style="display: none;">
        <input type="text" id="editName_${id}" value="${updatedEmployee.name}" class="form-control mb-2">
        <input type="text" id="editRole_${id}" value="${updatedEmployee.role}" class="form-control mb-2">
        <input type="email" id="editEmail_${id}" value="${updatedEmployee.email}" class="form-control mb-2">
        <input type="text" id="editPhone_${id}" value="${updatedEmployee.phone}" class="form-control mb-2">
        <input type="number" id="editSalary_${id}" value="${updatedEmployee.salary}" class="form-control mb-2">
        <button class="btn btn-sm btn-success" onclick="saveEmployeeChanges('${id}')">Save</button>
        <button class="btn btn-sm btn-secondary" onclick="cancelEdit('${id}')">Cancel</button>
      </div>
    `;

    showNotification("Employee details updated successfully!", "success");
  }).catch(err => {
    showNotification("Failed to update employee", "danger");
  });
}





function cancelEdit(id) {
  document.getElementById(`editForm_${id}`).style.display = "none";
  document.getElementById(`employeeCard_${id}`).querySelector('.card-body').style.display = "block";
}



// --- Notification with auto-hide ---
function showNotification(message, type) {
  const area = document.getElementById("notificationArea");
  area.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="tempAlert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  setTimeout(() => {
    const alert = document.getElementById("tempAlert");
    if (alert) alert.remove();
  }, 4000);
}

// --- Logout ---
function logout() {
  localStorage.removeItem("token");
  sessionStorage.setItem("toastMessage", "Admin Logout Successfully!");
  sessionStorage.setItem("toastType", "success");
  window.location.href = "/Admin/admin_login/login.html";
}

// --- Employee Search ---
let searchTimeout;
document.getElementById("employeeSearch").addEventListener("input", function () {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = this.value.toLowerCase();
    const filtered = allEmployees.filter(emp =>
      emp.name.toLowerCase().includes(query) || emp.role.toLowerCase().includes(query)
    );
    renderEmployeeList(filtered);
  }, 300); // Delay of 300ms
});


document.getElementById("addEmployeeButton").addEventListener("click", function () {
  const form = document.getElementById("addEmployeeForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
});

function cancelAddEmployee() {
  document.getElementById("addEmployeeForm").style.display = "none";
  resetCreateForm();
}


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



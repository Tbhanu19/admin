const BASE_URL = "http://127.0.0.1:8000";

function showAdminLogin() {
  document.getElementById("admin-login").classList.remove("hidden");
  document.getElementById("user-login").classList.add("hidden");
}

function showUserLogin() {
  document.getElementById("user-login").classList.remove("hidden");
  document.getElementById("admin-login").classList.add("hidden");
}


async function userLogin(event) {
  event.preventDefault();

  const username = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("User Login:", data);

    if (response.ok) {
      alert("User logged in successfully!");
      localStorage.setItem("token", data.access_token);
      window.location.href = "user_dashboard.html"; 
    } else {
      alert((data.detail || "Invalid credentials"));
    }
  } catch (error) {
    console.error(error);
    alert("Network error: " + error.message);
  }
}

async function adminLogin(event) {
  event.preventDefault();

  const username = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  try {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("Admin Login:", data);

    if (response.ok) {
      alert("Admin logged in successfully!");
      localStorage.setItem("admin_logged_in", "true");
      setTimeout(() => {
        window.location.href = "admin_dashboard.html";
      }, 500);
    } else {
      alert((data.detail || "Invalid admin credentials"));
    }
  } catch (error) {
    alert("Network error: " + error.message);
  }
}

async function loadAdminDashboard() {
  const adminLoggedIn = localStorage.getItem("admin_logged_in");
  if (!adminLoggedIn) {
    alert("Admin not logged in!");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/users`);
    const data = await response.json();

    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    if (response.ok) {
      if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>No registered users found.</td></tr>";
        return;
      }

      data.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.timestamp || "—"}</td>
          <td>${user.login_count || 0}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      alert("Error loading users: " + (data.detail || "Unknown error"));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Failed to connect to backend.");
  }
}

async function createUser(event) {
  event.preventDefault();

  const first_name = document.getElementById("first_name").value.trim();
  const last_name = document.getElementById("last_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!first_name || !last_name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/create_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("User created successfully!");
      document.getElementById("addUserForm").reset();
      loadAdminDashboard(); 
    } else {
      alert(" Failed to create user: " + (data.detail || "Unknown error"));
    }
  } catch (error) {
    console.error("Error creating user:", error);
    alert("Could not connect to backend.");
  }
}

async function logoutAdmin() {
  try {
    await fetch(`${BASE_URL}/admin/logout`, { method: "POST" });
  } catch (error) {
    console.warn("Logout request failed silently:", error);
  }
  localStorage.removeItem("admin_logged_in");
  window.location.href = "index.html";
}


const form = document.getElementById("addUserForm");
if (form) form.addEventListener("submit", createUser);

if (window.location.pathname.endsWith("admin_dashboard.html")) {
  loadAdminDashboard();
}

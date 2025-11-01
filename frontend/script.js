const BASE_URL = "http://127.0.0.1:8000";

function showAdminLogin() {
  document.getElementById("admin-login").classList.remove("hidden");
  document.getElementById("user-login").classList.add("hidden");
}

function showUserLogin() {
  document.getElementById("user-login").classList.remove("hidden");
  document.getElementById("admin-login").classList.add("hidden");
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
    } else {
      alert((data.detail || "Invalid admin credentials"));
    }
  } catch (error) {
    console.error(error);
    alert("Network error: " + error.message);
  }
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
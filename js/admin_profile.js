apiUrl = "http://localhost:3000";

function loadAdminProfile() {
  const userId = sessionStorage.getItem("userId");

  fetch(`${apiUrl}/Users/${userId}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("adminName").textContent = user.name;
      document.getElementById("adminEmail").textContent = user.email;
      document.getElementById("adminPhone").textContent = user.phone;
    });
}

loadAdminProfile();

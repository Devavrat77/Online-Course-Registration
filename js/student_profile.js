apiUrl = "http://localhost:3000";

function loadStudentProfile() {
  const userId = sessionStorage.getItem("userId");

  fetch(`${apiUrl}/Users/${userId}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("studentName").textContent = user.name;
      document.getElementById("studentEmail").textContent = user.email;
      document.getElementById("studentPhone").textContent = user.phone;
    });
}

loadStudentProfile();

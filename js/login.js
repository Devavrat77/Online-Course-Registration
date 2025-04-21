
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  verify();
});

document.getElementById("register").addEventListener("click", function (e) {

  window.location.href = "User_register.html";
});



function verify() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3000/Users")
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {

        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("userName", user.name);
        sessionStorage.setItem("userType", user.usertype);
        sessionStorage.setItem("loggedOut", false);
        if (user.usertype === "admin") {
          // sessionStorage.setItem("adminId", user.id);
          // sessionStorage.setItem("adminName", user.name);
          // sessionStorage.setItem("userTypeAdmin", user.usertype);
          // console.log("admin");
          window.location.href = "Admin.html";
        } else {
          // sessionStorage.setItem("studentId", user.id);
          // sessionStorage.setItem("studentName", user.name);
          // sessionStorage.setItem("userTypeStudent", user.usertype);
          window.location.href = "Student copy.html";
        }
      } else {
        document.getElementById("error").textContent = "Invalid email or password.";
      }
    })
    .catch(err => {
      console.error("Error fetching users:", err);
    });
}

function getUserId() {
  return sessionStorage.getItem("userId");
}

function getUserName() {
  return sessionStorage.getItem("userName");
}

function getUserType() {
  return sessionStorage.getItem("userType");
}

function logout() {
  sessionStorage.clear();
  sessionStorage.setItem("loggedOut", "true");
  window.location.href = "login.html";
}

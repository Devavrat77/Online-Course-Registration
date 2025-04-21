var apiUrlStudent = "http://localhost:3000";
var studentForm = document.getElementById("studentForm");
var userIdInput = document.getElementById("studentId");
var userNameInput = document.getElementById("studentName");
var userEmailInput = document.getElementById("studentEmail");
var userPasswordInput = document.getElementById("studentPassword");
var userPhoneInput = document.getElementById("studentPhone");
var submitBtnStudent = document.getElementById("submitBtnStudent");
var customErrorDiv = document.getElementById("customError");
var searchInputStudent = document.createElement("input");
var editIdStudent = null;
var allUsers = [];
var sortDirectionStudent = 1;

// Search bar setup
searchInputStudent.setAttribute("type", "text");
searchInputStudent.setAttribute("placeholder", "Search by user Name...");
searchInputStudent.classList.add("form-control", "mb-3");
document.querySelector(".table").parentNode.insertBefore(searchInputStudent, document.querySelector(".table"));

searchInputStudent.addEventListener("input", () => {
  const searchTerm = searchInputStudent.value.toLowerCase();
  const filtered = allUsers.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm)
  );
  renderUser(filtered);
});

function fetchAndRenderUser() {
  fetch(`${apiUrlStudent}/Users`)
    .then(res => res.json())
    .then(data => {
      allUsers = data;
      renderUser(data);
    });
}

function renderUser(users) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  users.forEach(stud => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stud.id}</td>
      <td>${stud.name}</td>
      <td>${stud.email}</td>
      <td>${stud.phone}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${stud.id}" href="#studentForm">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${stud.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      loadUsersForEdit(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteUser(id);
    });
  });
}

function validateUserName() {
  if (userNameInput.value.trim().length >= 5) {
    userNameInput.classList.add("is-valid");
    userNameInput.classList.remove("is-invalid");
    return true;
  } else {
    userNameInput.classList.add("is-invalid");
    userNameInput.classList.remove("is-valid");
    return false;
  }
}

function validateUserEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(userEmailInput.value.trim())) {
    userEmailInput.classList.add("is-valid");
    userEmailInput.classList.remove("is-invalid");
    return true;
  } else {
    userEmailInput.classList.add("is-invalid");
    userEmailInput.classList.remove("is-valid");
    return false;
  }
}

function validateUserPassword() {
  const passwordValue = userPasswordInput.value.trim();
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  if (passwordPattern.test(passwordValue)) {
    userPasswordInput.classList.add("is-valid");
    userPasswordInput.classList.remove("is-invalid");
    return true;
  } else {
    userPasswordInput.classList.add("is-invalid");
    userPasswordInput.classList.remove("is-valid");
    return false;
  }
}

function validateUserPhone() {
  const phonePattern =/^[789]\d{9}$/;
  if (phonePattern.test(userPhoneInput.value.trim())) {
    userPhoneInput.classList.add("is-valid");
    userPhoneInput.classList.remove("is-invalid");
    return true;
  } else {
    userPhoneInput.classList.add("is-invalid");
    userPhoneInput.classList.remove("is-valid");
    return false;
  }
}

userNameInput.addEventListener("blur", validateUserName);
userEmailInput.addEventListener("blur", validateUserEmail);
userPasswordInput.addEventListener("blur", validateUserPassword);
userPhoneInput.addEventListener("blur", validateUserPhone);

function validateForm() {
  let isFormValid = true;
  if (!validateUserName()) isFormValid = false;
  if (!validateUserEmail()) isFormValid = false;
  if (!validateUserPassword()) isFormValid = false;
  if (!validateUserPhone()) isFormValid = false;
  if (isEmailAlreadyRegistered()) isFormValid = false;
  if (isPhoneAlreadyRegistered()) isFormValid = false;
  return isFormValid;
}

function isEmailAlreadyRegistered() {
  const email = userEmailInput.value.trim();
  // console.log("Email : "+ email);
  if (allUsers.find(user => user.email === email)) {
      customErrorDiv.innerText ="Email already registered!\n";
      customErrorDiv.classList.add("is-invalid");
      customErrorDiv.classList.remove("is-valid");
      return true;
  } else {
      customErrorDiv.innerText = "";
      customErrorDiv.classList.remove("is-invalid");
      customErrorDiv.classList.add("is-valid");
      return false;
  }
}


function isPhoneAlreadyRegistered() {
  const phone = userPhoneInput.value.trim();
  // console.log("Email : "+ email);
  if (allUsers.find(user => user.phone === phone)) {
      customErrorDiv.innerText +="Phone Number already registered!";
      customErrorDiv.classList.add("is-invalid");
      customErrorDiv.classList.remove("is-valid");
      return true;
  } else {
      customErrorDiv.innerText = "";
      customErrorDiv.classList.remove("is-invalid");
      customErrorDiv.classList.add("is-valid");
      return false;
  }
}
// function validateInstructorName() {
//     if (instructorsNameInput.value.trim().length >= 5) {
//         instructorsNameInput.classList.add("is-valid");
//         instructorsNameInput.classList.remove("is-invalid");
//         return true;
//     } else {
//         instructorsNameInput.classList.add("is-invalid");
//         username.classList.remove("is-valid");
//         return false;
//     }

// }

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const user = {
    userid: userIdInput.value.trim(),
    name: userNameInput.value.trim(),
    email: userEmailInput.value.trim(),
    password: userPasswordInput.value.trim(),
    phone: userPhoneInput.value.trim()
  };

  if (editIdStudent) {
    fetch(`${apiUrlStudent}/Users/${editIdStudent}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    }).then(() => {
      fetchAndRenderUser();
      studentForm.reset();
      editIdStudent = null;
      submitBtnStudent.textContent = "Add Student";
      // clearValidation();
    });
  } else {
    fetch(`${apiUrlStudent}/Users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    }).then(() => {
      fetchAndRenderUser();
      studentForm.reset();
      // clearValidation();
    });
  }
});

function loadUsersForEdit(id) {
  fetch(`${apiUrlStudent}/Users/${id}`)
    .then(res => res.json())
    .then(data => {
      userIdInput.value = data.userid
      userNameInput.value = data.name;
      userEmailInput.value = data.email;
      userPasswordInput.value = data.password;
      userPhoneInput.value = data.phone;
      editIdStudent = id;
      submitBtnStudent.textContent = "Update user";
    });
}

// Sorting logic on Student Name
document.querySelector("th:nth-child(2)").style.cursor = "pointer";
document.querySelector("th:nth-child(2)").addEventListener("click", () => {
    const sorted = [...allUsers].sort((a, b) =>
        a.name.localeCompare(b.name) * sortDirectionStudent
    );
    sortDirectionStudent *= -1;
    renderUser(sorted);
});

document.querySelector("th:nth-child(3)").style.cursor = "pointer";
document.querySelector("th:nth-child(3)").addEventListener("click", () => {
    const sorted = [...allUsers].sort((a, b) =>
        a.email.localeCompare(b.email) * sortDirectionStudent
    );
    sortDirectionStudent *= -1;
    renderUser(sorted);
});

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this USER ?")) {
    fetch(`${apiUrlStudent}/Users/${id}`, {
      method: "DELETE"
    }).then(() => fetchAndRenderUser());
  }
}

fetchAndRenderUser();
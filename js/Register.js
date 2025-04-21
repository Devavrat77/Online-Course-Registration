const apiUrl = "http://localhost:3000";
const form = document.getElementById("userForm");
// const userIdInput = document.getElementById("userId");
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const userPasswordInput = document.getElementById("userPassword");
const userPhoneInput = document.getElementById("userPhone");
const customErrorDiv = document.getElementById("cstm");
const submitBtn = document.getElementById("submitBtn");
let editId = null;
let allUsers = [];
let sortDirection = 1;

document.getElementById("login").addEventListener("click", function (e) {
    
    window.location.href = "login.html";
  });

function fetchAndRenderUser() {
    fetch(`${apiUrl}/Users`)
        .then(res => res.json())
        .then(data => {
            allUsers = data;
            renderUser(data);
        });
}

function renderUser(users) {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${user.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}">
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

function isEmailAlreadyRegistered() {
    const email = userEmailInput.value.trim();
    console.log("Email : "+ email);
    if (allUsers.find(user => user.email === email)) {
        customErrorDiv.innerText = "Email already registered!";
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
  
//   function validateUserPassword() {
//     const passwordValue = userPasswordInput.value.trim();
//     const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
//     if (passwordPattern.test(passwordValue)) {
//       userPasswordInput.classList.add("is-valid");
//       userPasswordInput.classList.remove("is-invalid");
//       return true;
//     } else {
//       userPasswordInput.classList.add("is-invalid");
//       userPasswordInput.classList.remove("is-valid");
//       return false;
//     }
//   }
  
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
//   userPasswordInput.addEventListener("blur", validateUserPassword);
  userPhoneInput.addEventListener("blur", validateUserPhone);
  
  function validateForm() {
    let isFormValid = true;
    if (!validateUserName()) isFormValid = false;
    if (!validateUserEmail()) isFormValid = false;
    // if (!validateUserPassword()) isFormValid = false;
    if (!validateUserPhone()) isFormValid = false;
    return isFormValid;
  }
  

form.addEventListener("submit", function (e) {

    e.preventDefault();
    if (!validateForm()) return;
    if (isEmailAlreadyRegistered()) {
        return false;
    } else {
        const user = {
            // userid: userIdInput.value.trim(),
            name: userNameInput.value.trim(),
            email: userEmailInput.value.trim(),
            password: userPasswordInput.value.trim(),
            phone: userPhoneInput.value.trim()
        };

        if (editId) {
            fetch(`${apiUrl}/Users/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            }).then(() => {
                fetchAndRenderUser();
                form.reset();
                editId = null;
                submitBtn.textContent = "Add Instructor";
                // clearValidation();
            });
        } else {
            fetch(`${apiUrl}/Users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            }).then(() => {
                fetchAndRenderUser();
                form.reset();
                // clearValidation();
            });
        }
    }
});




// fetchAndRenderUser();
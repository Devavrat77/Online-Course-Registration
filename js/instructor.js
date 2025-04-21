var apiUrlInstructor = "http://localhost:3000/Instructors";
var instructorForm = document.getElementById("instructorForm");
var instructorsNameInput = document.getElementById("instructorName");
var instructorExpertiesInput = document.getElementById("instructorExperties");
var instructorEmailInput = document.getElementById("instructorEmail");
var submitBtnInst = document.getElementById("submitBtnInst");
var searchInputInstructor = document.createElement("input");
var editIdInstructor = null;
var allInstructors = [];
var sortDirectionInstructor = 1;

// Search bar setup
searchInputInstructor.setAttribute("type", "text");
searchInputInstructor.setAttribute("placeholder", "Search by Instructor Name...");
searchInputInstructor.classList.add("form-control", "mb-3");
document.querySelector(".table").parentNode.insertBefore(searchInputInstructor, document.querySelector(".table"));

searchInputInstructor.addEventListener("input", () => {
    const searchTerm = searchInputInstructor.value.toLowerCase();
    const filtered = allInstructors.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm)
    );
    renderInstructor(filtered);
});

function fetchAndRenderInstructor() {
    fetch(apiUrlInstructor)
        .then(res => res.json())
        .then(data => {
            allInstructors = data;
            renderInstructor(data);
        });
}

function renderInstructor(instructors) {
    const tbody = document.getElementById("instructorTableBody");
    tbody.innerHTML = "";

    instructors.forEach(inst => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${inst.id}</td>
      <td>${inst.name}</td>
      <td>${inst.email}</td>
      <td>${inst.expertise}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${inst.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${inst.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
        tbody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            loadInstructorForEdit(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteInstructor(id);
        });
    });
}


function validateInstructorName() {
    if (instructorsNameInput.value.trim().length >= 5) {
        instructorsNameInput.classList.add("is-valid");
        instructorsNameInput.classList.remove("is-invalid");
      return true;
    } else {
        instructorsNameInput.classList.add("is-invalid");
        instructorsNameInput.classList.remove("is-valid");
      return false;
    }
  }

  function validateInstructorExperties() {
    if (instructorExpertiesInput.value.trim().length >= 7) {
        instructorExpertiesInput.classList.add("is-valid");
        instructorExpertiesInput.classList.remove("is-invalid");
      return true;
    } else {
        instructorExpertiesInput.classList.add("is-invalid");
        instructorExpertiesInput.classList.remove("is-valid");
      return false;
    }
  }
  
  function validateInstructorEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(instructorEmailInput.value.trim())) {
        instructorEmailInput.classList.add("is-valid");
        instructorEmailInput.classList.remove("is-invalid");
      return true;
    } else {
        instructorEmailInput.classList.add("is-invalid");
        instructorEmailInput.classList.remove("is-valid");
      return false;
    }
  }
  
  instructorsNameInput.addEventListener("blur", validateInstructorName);
  instructorEmailInput.addEventListener("blur", validateInstructorEmail);
  instructorExpertiesInput.addEventListener("blur", validateInstructorExperties);
  
  function validateForm() {
    let isFormValid = true;
    if (!validateInstructorName()) isFormValid = false;
    if (!validateInstructorEmail()) isFormValid = false;
    if (!validateInstructorExperties()) isFormValid = false;
    return isFormValid;
  }

instructorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const instructor = {
        name: instructorsNameInput.value.trim(),
        email: instructorEmailInput.value.trim(),
        expertise: instructorExpertiesInput.value.trim()
    };

    if (editIdInstructor) {
        fetch(`${apiUrlInstructor}/${editIdInstructor}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(instructor)
        }).then(() => {
            fetchAndRenderInstructor();
            instructorForm.reset();
            editIdInstructor = null;
            submitBtnInst.textContent = "Add Instructor";
            // clearValidation();
        });
    } else {
        fetch(apiUrlInstructor, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(instructor)
        }).then(() => {
            fetchAndRenderInstructor();
            instructorForm.reset();
            // clearValidation();
        });
    }
});

function loadInstructorForEdit(id) {
    fetch(`${apiUrlInstructor}/${id}`)
        .then(res => res.json())
        .then(data => {
            instructorsNameInput.value = data.name;
            instructorEmailInput.value = data.email;
            instructorExpertiesInput.value = data.expertise;
            editIdInstructor = id;
            submitBtnInst.textContent = "Update Instructor";
        });
}

// Sorting logic on Category Name
document.querySelector("th:nth-child(2)").style.cursor = "pointer";
document.querySelector("th:nth-child(2)").addEventListener("click", () => {
    const sorted = [...allInstructors].sort((a, b) =>
        a.name.localeCompare(b.name) * sortDirectionInstructor
    );
    sortDirectionInstructor *= -1;
    renderInstructor(sorted);
});

document.querySelector("th:nth-child(4)").style.cursor = "pointer";
document.querySelector("th:nth-child(4)").addEventListener("click", () => {
    const sorted = [...allInstructors].sort((a, b) =>
        a.expertise.localeCompare(b.expertise) * sortDirectionInstructor
    );
    sortDirectionInstructor *= -1;
    renderInstructor(sorted);
});

function deleteInstructor(id) {
    if (confirm("Are you sure you want to delete this category?")) {
        fetch(`${apiUrlInstructor}/${id}`, {
            method: "DELETE"
        }).then(() => fetchAndRenderCategories());
    }
}

fetchAndRenderInstructor();
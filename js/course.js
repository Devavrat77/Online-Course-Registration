var apiUrlCourses = "http://localhost:3000";
var courseForm = document.getElementById("courseForm");
var courseNameInput = document.getElementById("courseName");
var courseDescriptionInput = document.getElementById("courseDescription");
// var courseIdInput = document.getElementById("courseId");
var insturctorIdInput = document.getElementById("instId");
var courseFeeInput = document.getElementById("courseFees");
var submitBtnCourse = document.getElementById("submitBtnCourse");
var searchInputCourse = document.createElement("input");
var editIdCourses = null;
var allCourses = [];
var instructor = [];
var sortDirectionCourse = 1;

// Search bar setup
searchInputCourse.setAttribute("type", "text");
searchInputCourse.setAttribute("placeholder", "Search by Course Name...");
searchInputCourse.classList.add("form-control", "mb-3");
document.querySelector(".table").parentNode.insertBefore(searchInputCourse, document.querySelector(".table"));

searchInputCourse.addEventListener("input", () => {
    const searchTerm = searchInputCourse.value.toLowerCase();
    const filtered = allCourses.filter(cours =>
        cours.coursename.toLowerCase().includes(searchTerm)
    );
    renderCourses(filtered);
});

function fetchAndRenderCourses() {
    fetch(`${apiUrlCourses}/Courses`)
        .then(res => res.json())
        .then(data => {
            allCourses = data;
            renderCourses(data);
        });
}

function renderCourses(courses) {
    const tbody = document.getElementById("coursesTableBody");
    tbody.innerHTML = "";

    courses.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${course.id}</td>
      <td>${course.coursename}</td>
      <td>${course.description}</td>
      <td>${course.fees}</td>
      <td>${(instructor.find(inst => inst.id === course.instructorid))?.name}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${course.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${course.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
        tbody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            loadCourseForEdit(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteCourse(id);
        });
    });
}

function validateCourseName() {
    if (courseNameInput.value.trim().length >= 5) {
        courseNameInput.classList.add("is-valid");
        courseNameInput.classList.remove("is-invalid");
        return true;
    } else {
        courseNameInput.classList.add("is-invalid");
        courseNameInput.classList.remove("is-valid");
        return false;
    }
}

function validateDescription() {
    if (courseDescriptionInput.value.trim().length >= 10) {
        courseDescriptionInput.classList.add("is-valid");
        courseDescriptionInput.classList.remove("is-invalid");
        return true;
    } else {
        courseDescriptionInput.classList.add("is-invalid");
        courseDescriptionInput.classList.remove("is-valid");
        return false;
    }
}

function validateFees() {
    if (courseFeeInput.value.trim() != "") {
        courseFeeInput.classList.add("is-valid");
        courseFeeInput.classList.remove("is-invalid");
        return true;
    } else {
        courseFeeInput.classList.add("is-invalid");
        courseFeeInput.classList.remove("is-valid");
        return false;
    }
}





courseNameInput.addEventListener("blur", validateCourseName);
courseDescriptionInput.addEventListener("blur", validateDescription);
courseFeeInput.addEventListener("blur", validateFees);

function validateForm() {
    let isFormValid = true;
    if (!validateCourseName()) isFormValid = false;
    if (!validateDescription()) isFormValid = false;
    if (!validateFees()) isFormValid = false;
    return isFormValid;
}


courseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const courses = {
        coursename: courseNameInput.value.trim(),
        description: courseDescriptionInput.value.trim(),
        fees: courseFeeInput.value.trim(),
        instructorid: insturctorIdInput.value.trim()
    };

    if (editIdCourses) {
        fetch(`${apiUrlCourses}/Courses/${editIdCourses}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courses)
        }).then(() => {
            fetchAndRenderCourses();
            form.reset();
            editIdCourses = null;
            submitBtnCourse.textContent = "Add Course";
            // clearValidation();
        });
    } else {
        fetch(`${apiUrlCourses}/Courses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courses)
        }).then(() => {
            fetchAndRenderCourses();
            form.reset();
            // clearValidation();
        });
    }
});

function loadCourseForEdit(id) {
    fetch(`${apiUrlCourses}/Courses/${id}`)
        .then(res => res.json())
        .then(data => {
            courseNameInput.value = data.coursename;
            courseDescriptionInput.value = data.description;
            courseFeeInput.value = data.fees;
            insturctorIdInput.value = data.instructorid;
            // insturctorIdInput.textContent = instructor.find(i => i.id == data.instructorid).name;
            editIdCourses = id;
            submitBtnCourse.textContent = "Update Course";
        });
}

// // Sorting logic on Category Name
// document.querySelector("th:nth-child(2)").style.cursor = "pointer";
// document.querySelector("th:nth-child(2)").addEventListener("click", () => {
//     const sorted = [...allInstructors].sort((a, b) =>
//         a.name.localeCompare(b.name) * sortDirectionCourse
//     );
//     sortDirectionCourse *= -1;
//     renderInstructor(sorted);
// });

// document.querySelector("th:nth-child(3)").style.cursor = "pointer";
// document.querySelector("th:nth-child(3)").addEventListener("click", () => {
//     const sorted = [...allInstructors].sort((a, b) =>
//         a.expertise.localeCompare(b.expertise) * sortDirectionCourse
//     );
//     sortDirectionCourse *= -1;
//     renderInstructor(sorted);
// });

function deleteCourse(id) {
    if (confirm("Are you sure you want to delete this category?")) {
        fetch(`${apiUrlCourses}/Courses/${id}`, {
            method: "DELETE"
        }).then(() => fetchAndRenderCourses());
    }
}


function loadInstructors() {
    fetch(`${apiUrlCourses}/Instructors`)
        .then(res => res.json())
        .then(data => {
            instructor = data;
            const instSelect = document.getElementById("instId");
            data.forEach(inst => {
                instSelect.innerHTML += `<option value="${inst.id}">${inst.name}</option>`;
            });
        });
}


loadInstructors();
fetchAndRenderCourses();
// console.log(instructor);
// instructor.forEach(i => console.log(i));


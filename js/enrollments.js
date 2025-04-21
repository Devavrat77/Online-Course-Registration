apiUrl = "http://localhost:3000";
var enrollmentForm = document.getElementById("enrollmentForm");
var studentNameInput = document.getElementById("studentName");
var courseSelect = document.getElementById("courseSelect");
var enrollmentDateInput = document.getElementById("enrollmentDate");
var enrollmentTableBody = document.getElementById("enrollmentTableBody");

var editEnrollmentId = null;
var allCourses = [];
var allEnrollments = [];
var allUsers = [];

function loadCourses() {
    fetch(`${apiUrl}/Courses`)
        .then(res => res.json())
        .then(data => {
            allCourses = data;
            courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
            data.forEach(course => {
                courseSelect.innerHTML += `<option value="${course.id}">${course.coursename}</option>`;
            });
        });
}

function loadUsers() {
    fetch(`${apiUrl}/Users`)
        .then(res => res.json())
        .then(data => {
            allUsers = data;
            loadEnrollments();
        });
}

function loadEnrollments() {
    fetch(`${apiUrl}/Enrollments`)
        .then(res => res.json())
        .then(data => {
            allEnrollments = data;
            renderEnrollments();
        });
}

function renderEnrollments() {
    enrollmentTableBody.innerHTML = "";
    allEnrollments.forEach(enroll => {
        const user = allUsers.find(u => u.id === enroll.userid);
        const course = allCourses.find(c => c.id === enroll.courseid);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${enroll.id}</td>
            <td>${user?.name || "Unknown"}</td>
            <td>${course?.coursename || "Unknown"}</td>
            <td>${enroll.enrollmentdate}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 edit-enroll" data-id="${enroll.id}">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-enroll" data-id="${enroll.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        enrollmentTableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-enroll").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            loadEnrollmentForEdit(id);
        });
    });

    document.querySelectorAll(".delete-enroll").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteEnrollment(id);
        });
    });
}

function loadEnrollmentForEdit(id) {
    const enrollment = allEnrollments.find(e => e.id == id);
    const student = allUsers.find(u => u.id === enrollment.userid);
    if (!enrollment || !student) return;

    studentNameInput.value = student.name;
    courseSelect.value = enrollment.courseid;
    console.log(enrollment.courseid)
    enrollmentDateInput.value = enrollment.enrollmentdate;
    editEnrollmentId = id;
}

function deleteEnrollment(id) {
    if (confirm("Are you sure you want to delete this enrollment?")) {
        fetch(`${apiUrl}/Enrollments/${id}`, {
            method: "DELETE"
        }).then(() => {
            loadEnrollments();
            enrollmentForm.reset();
            editEnrollmentId = null;
        });
    }
}

enrollmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const courseid = courseSelect.value;
    console.log(courseid);
    const enrollmentdate = enrollmentDateInput.value;

    if (!studentNameInput.value || !courseid || !enrollmentdate || !editEnrollmentId) return;

    const updatedEnrollment = {
        ...allEnrollments.find(e => e.id === editEnrollmentId),
        courseid,
        enrollmentdate
    };

    fetch(`${apiUrl}/Enrollments/${editEnrollmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEnrollment)
    }).then(() => {
        loadEnrollments();
        enrollmentForm.reset();
        editEnrollmentId = null;
    });
});

loadCourses();
loadUsers();

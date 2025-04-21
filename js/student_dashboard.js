var apiUrl = "http://localhost:3000";

function loadStudentDashboard() {
  const studentName = sessionStorage.getItem("userName") || "Student";
  const studentId = sessionStorage.getItem("userId");

  document.getElementById("studentName").textContent = studentName;

  Promise.all([
    fetch(`${apiUrl}/Courses`).then(res => res.json()),
    fetch(`${apiUrl}/Instructors`).then(res => res.json()),
    fetch(`${apiUrl}/Enrollments`).then(res => res.json())
  ]).then(([courses, instructors, enrollments]) => {

    document.getElementById("totalCourses").textContent = courses.length;
    document.getElementById("totalInstructors").textContent = instructors.length;

    const myEnrollments = enrollments.filter(e => e.userid == studentId);
    document.getElementById("enrolledCourses").textContent = myEnrollments.length;
  });
}

loadStudentDashboard();

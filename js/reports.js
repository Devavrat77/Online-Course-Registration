apiUrl = "http://localhost:3000";

function loadReports() {
  Promise.all([
    fetch(`${apiUrl}/Courses`).then(res => res.json()),
    fetch(`${apiUrl}/Instructors`).then(res => res.json()),
    fetch(`${apiUrl}/Enrollments`).then(res => res.json())
  ]).then(([courses, instructors, enrollments]) => {

    const courseReportBody = document.getElementById("courseEnrollmentReportBody");
    const instructorCourseBody = document.getElementById("instructorCourseListBody");

    // Course-wise Enrollment Report
    courseReportBody.innerHTML = "";
    courses.forEach(course => {
      const count = enrollments.filter(e => e.courseid === course.id).length;
      courseReportBody.innerHTML += `
        <tr>
          <td>${course.coursename}</td>
          <td>${count}</td>
        </tr>`;
    });

    // Instructor-wise Course List
    instructorCourseBody.innerHTML = "";
    instructors.forEach(instructor => {
      const assignedCourses = courses.filter(c => c.instructorid === instructor.id);
      const courseNames = assignedCourses.map(c => c.coursename).join(", ") || "None";
      instructorCourseBody.innerHTML += `
        <tr>
          <td>${instructor.name}</td>
          <td>${courseNames}</td>
        </tr>`;
    });

  });
}

loadReports();

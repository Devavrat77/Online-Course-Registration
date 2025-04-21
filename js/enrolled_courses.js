//  apiUrl = "http://localhost:3000";
//  enrolledCoursesTableBody = document.getElementById("enrolledCoursesTableBody");

// function loadEnrolledCourses() {
//   const userId = sessionStorage.getItem("userId");
//   Promise.all([
//     fetch(`${apiUrl}/Courses`).then(res => res.json()),
//     fetch(`${apiUrl}/Instructors`).then(res => res.json()),
//     fetch(`${apiUrl}/Enrollments`).then(res => res.json())
//   ]).then(([courses, instructors, enrollments]) => {
//     const studentEnrollments = enrollments.filter(e => e.userid == userId);
//     enrolledCoursesTableBody.innerHTML = "";

//     if (studentEnrollments.length === 0) {
//       enrolledCoursesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">No courses enrolled yet!</td></tr>`;
//       return;
//     }

//     studentEnrollments.forEach(e => {
//       const course = courses.find(c => c.id == e.courseid);
//       const instructor = instructors.find(i => i.id == course?.instructorid);
//       const row = `
//         <tr>
//           <td>${e.id}</td>
//           <td>${course?.coursename || "Unknown Course"}</td>
//           <td>${instructor?.name || "Unknown Instructor"}</td>
//           <td>${e.enrollmentdate}</td>
//         </tr>`;
//       enrolledCoursesTableBody.innerHTML += row;
//     });
//   });
// }

// loadEnrolledCourses();

apiUrl = "http://localhost:3000";
async function fetchEnrolledCourses() {
    const userId = sessionStorage.getItem("userId");
    try {
        const enrollments = await fetch(`${apiUrl}/Enrollments`).then(res => res.json());
        // const enrollments = await response.json();
        const courses = await  fetch(`${apiUrl}/Courses`).then(res => res.json());
        const instructors = await fetch(`${apiUrl}/Instructors`).then(res => res.json());
        let studentEnrollments = enrollments.filter(e => e.userid == userId);
        // enrolledCoursesTableBody.innerHTML = "";

        renderEnrolledCourses(studentEnrollments,courses,instructors);
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
    }
}

function renderEnrolledCourses(studentEnrollments,courses,instructors) {
    const container = document.getElementById('enrolledCoursesContainer');
    container.innerHTML = '';

    if (studentEnrollments.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">You are not enrolled in any courses yet!</div>
            </div>`;
        return;
    }

    studentEnrollments.forEach(e => {
        const course = courses.find(c => c.id == e.courseid);
        const instructor = instructors.find(i => i.id == course?.instructorid);

        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${course.coursename}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Instructor: ${instructor.name}</h6>
                        <p class="card-text mt-2">
                            Fees: ₹${course.fees} <br>
                            Enrolled On: ${new Date(e.enrollmentdate).toLocaleDateString()}
                        </p>
                        <a href="Enroll_Course.html/" class="btn btn-primary mt-auto">View Course</a>
                    </div>
                </div>
            </div>`;
    });
}
fetchEnrolledCourses();
// const apiUrl = "http://localhost:3000";

// function loadDashboard() {
//   Promise.all([
//     fetch(`${apiUrl}/Users`).then(res => res.json()),
//     fetch(`${apiUrl}/Courses`).then(res => res.json()),
//     fetch(`${apiUrl}/Instructors`).then(res => res.json()),
//     fetch(`${apiUrl}/Enrollments`).then(res => res.json())
//   ]).then(([users, courses, instructors, enrollments]) => {
//     document.getElementById("totalStudents").textContent = users.filter(u => u.usertype === "student").length;
//     document.getElementById("totalCourses").textContent = courses.length;
//     document.getElementById("totalInstructors").textContent = instructors.length;

//     const today = new Date().toISOString().split("T")[0];
//     const todaysEnrollments = enrollments.filter(e => e.enrollmentdate === today).length;
//     document.getElementById("enrollmentsToday").textContent = todaysEnrollments;

//     renderCourseChart(courses, enrollments);
//     renderInstructorChart(instructors, enrollments);
//   });
// }

// function renderCourseChart(courses, enrollments) {
//   const labels = courses.map(c => c.coursename);
//   const dataCounts = labels.map(name => enrollments.filter(e => courses.find(c => c.id === e.courseid)?.coursename === name).length);

//   new Chart(document.getElementById('coursePopularityChart'), {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: "Enrollments",
//         data: dataCounts,
//         backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1", "#fd7e14"]
//       }]
//     }
//   });
// }

// function renderInstructorChart(instructors, enrollments) {
//   const labels = instructors.map(i => i.name);
//   const dataCounts = labels.map(name => {
//     const inst = instructors.find(i => i.name === name);
//     return enrollments.filter(e => inst && e.instructorid == inst.id).length;
//   });

//   new Chart(document.getElementById('studentsPerInstructorChart'), {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Students',
//         data: dataCounts,
//         backgroundColor: '#0dcaf0'
//       }]
//     }
//   });
// }

// loadDashboard();
apiUrl = "http://localhost:3000";

function loadDashboard() {
  Promise.all([
    fetch(`${apiUrl}/Users`).then(res => res.json()),
    fetch(`${apiUrl}/Courses`).then(res => res.json()),
    fetch(`${apiUrl}/Instructors`).then(res => res.json()),
    fetch(`${apiUrl}/Enrollments`).then(res => res.json())
  ]).then(([users, courses, instructors, enrollments]) => {

    document.getElementById("totalStudents").textContent = users.filter(u => u.usertype === "student").length;
    document.getElementById("totalCourses").textContent = courses.length;
    document.getElementById("totalInstructors").textContent = instructors.length;

    // Show Total Enrollments instead of Today's
    document.getElementById("enrollmentsTotal").textContent = enrollments.length;

    // If you want to switch back to "Enrollments Today" later, uncomment this:
    // const today = new Date().toISOString().split("T")[0];
    // const todaysEnrollments = enrollments.filter(e => e.enrollmentdate === today).length;
    // document.getElementById("enrollmentsToday").textContent = todaysEnrollments;

    renderCourseChart(courses, enrollments);
    renderInstructorChart(instructors, enrollments, courses);
  });
}

function renderCourseChart(courses, enrollments) {
  const labels = courses.map(c => c.coursename);
  const dataCounts = labels.map(name => enrollments.filter(e => courses.find(c => c.id === e.courseid)?.coursename === name).length);

  new Chart(document.getElementById('coursePopularityChart'), {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: "Enrollments",
        data: dataCounts,
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1", "#fd7e14"]
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// function renderInstructorChart(instructors, enrollments,courses) {
//   const labels = instructors.map(i => i.name);
//   const dataCounts = instructors.map(inst =>
//     enrollments.filter(courses.find(c => c.id == enrollments.courseid).instructorid == inst.id).length
//     // courses.find(c => c.id == enrollments.courseid).instructorid = inst.id
//   );

//   new Chart(document.getElementById('studentsPerInstructorChart'), {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Students',
//         data: dataCounts,
//         backgroundColor: 'rgba(13, 202, 240, 0.8)',
//         borderColor: '#0dcaf0',
//         borderWidth: 2,
//       }]
//     },
//     options: {
//       plugins: { legend: { display: false } },
//       scales: {
//         y: {
//           beginAtZero: true,
//           ticks: { precision: 0 }
//         }
//       },
//       elements: {
//         bar: {
//           borderSkipped: false,
//           borderRadius: 4
//         }
//       }
//     }
//   });
// }
// function renderInstructorChart(instructors, enrollments, courses) {
//   const labels = instructors.map(inst => inst.name);
//   const dataCounts = instructors.map(inst => {
//     return enrollments.filter(enrollment => {
//       const course = courses.find(c => c.id == enrollment.courseid);
//       return course && course.instructorid == inst.id;
//     }).length;
//   });

//   new Chart(document.getElementById('studentsPerInstructorChart'), {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Students',
//         data: dataCounts,
//         backgroundColor: 'rgba(13, 202, 240, 0.8)',
//         borderColor: '#0dcaf0',
//         borderWidth: 2,
//       }]
//     },
//     options: {
//       plugins: { legend: { display: false } },
//       scales: {
//         y: {
//           beginAtZero: true,
//           ticks: { precision: 0 }
//         }
//       },
//       elements: {
//         bar: {
//           borderSkipped: false,
//           borderRadius: 4
//         }
//       }
//     }
//   });
// }

function renderInstructorChart(instructors, enrollments, courses) {
  const labels = instructors.map(inst => inst.name);
  const dataCounts = instructors.map(inst => {
    return enrollments.filter(enrollment => {
      const course = courses.find(c => c.id == enrollment.courseid);
      return course && course.instructorid == inst.id;
    }).length;
  });

  new Chart(document.getElementById('studentsPerInstructorChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Students',
        data: dataCounts,
        backgroundColor: [
          'rgba(13, 202, 240, 0.9)',
          'rgba(0, 123, 255, 0.9)',
          'rgba(40, 167, 69, 0.9)',
          'rgba(255, 193, 7, 0.9)',
          'rgba(220, 53, 69, 0.9)'
        ],
        borderColor: '#333',
        borderWidth: 1,
        hoverOffset: 5, // gives a floating feel
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: {
            color: '#e0e0e0'  // lighter background grid
          }
        },
        x: {
          grid: {
            color: '#f5f5f5'  // subtle horizontal grid
          }
        }
      },
      elements: {
        bar: {
          borderSkipped: false,
          borderRadius: 8, // smooth corner like a 3D block
        }
      }
    }
  });
}



loadDashboard();

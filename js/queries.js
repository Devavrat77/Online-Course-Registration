apiUrl = "http://localhost:3000";

var studentSelect = document.getElementById("studentSelect");
var courseSelect = document.getElementById("courseSelect");
var studentCoursesList = document.getElementById("studentCoursesList");
var courseStudentsList = document.getElementById("courseStudentsList");

var users = [], courses = [], enrollments = [];

function loadData() {
  Promise.all([
    fetch(`${apiUrl}/Users`).then(res => res.json()),
    fetch(`${apiUrl}/Courses`).then(res => res.json()),
    fetch(`${apiUrl}/Enrollments`).then(res => res.json())
  ]).then(([usersData, coursesData, enrollmentsData]) => {
    users = usersData.filter(u => u.usertype === "student");
    courses = coursesData;
    enrollments = enrollmentsData;

    studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
    users.forEach(u => {
      studentSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });

    courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
    courses.forEach(c => {
      courseSelect.innerHTML += `<option value="${c.id}">${c.coursename}</option>`;
    });
  });
}

function showCoursesForStudent() {
  const userId = studentSelect.value;
  studentCoursesList.innerHTML = "";
  if (!userId) return alert("Please select a student!");

  const userEnrollments = enrollments.filter(e => e.userid == userId);
  if (userEnrollments.length === 0) {
    studentCoursesList.innerHTML = `<li class="list-group-item text-danger">No courses found for this student.</li>`;
  } else {
    userEnrollments.forEach(e => {
      const course = courses.find(c => c.id == e.courseid);
      if (course) {
        studentCoursesList.innerHTML += `<li class="list-group-item">${course.coursename}</li>`;
      }
    });
  }
}

function showStudentsForCourse() {
  const courseId = courseSelect.value;
  courseStudentsList.innerHTML = "";
  if (!courseId) return alert("Please select a course!");

  const courseEnrollments = enrollments.filter(e => e.courseid == courseId);
  if (courseEnrollments.length === 0) {
    courseStudentsList.innerHTML = `<li class="list-group-item text-danger">No students enrolled for this course.</li>`;
  } else {
    courseEnrollments.forEach(e => {
      const user = users.find(u => u.id == e.userid);
      if (user) {
        courseStudentsList.innerHTML += `<li class="list-group-item">${user.name}</li>`;
      }
    });
  }
}

loadData();

var apiUrl = "http://localhost:3000";
var form = document.getElementById("enrollForm");
var studentIdInput = document.getElementById("studentId");
var courseSelect = document.getElementById("courseSelect");
var instructorSelect = document.getElementById("instructorSelect");
var courseFeesInput = document.getElementById("courseFees");
// const enrollmentTableBody = document.getElementById("enrollmentTableBody");
studentId = sessionStorage.getItem("userId");
studentIdInput.value = sessionStorage.getItem("userName");
var courses = [];
var instructors = [];

function fetchAll() {
  fetch(`${apiUrl}/Courses`).then(res => res.json()).then(data => {
    courses = data;
    courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
    data.forEach(c => courseSelect.innerHTML += `<option value="${c.id}">${c.coursename}</option>`);
  });

  fetch(`${apiUrl}/Instructors`).then(res => res.json()).then(data => {
    instructors = data;
  });
}


courseSelect.addEventListener("change", () =>{
  const selectedCourseId = courseSelect.value;
  const selectedCourse = courses.find(c => c.id == selectedCourseId);
  if(selectedCourse){
    courseFeesInput.value = selectedCourse.fees;
    const instructor = instructors.find(inst => inst.id==selectedCourse.instructorid);
    instructorSelect.value = instructor.name;
  }else{
    courseFeesInput.value="";
    instructorSelect.value="";
  }
});



form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!studentId || !courseSelect.value || !instructorSelect.value) return alert("Please complete all selections!");

  const enrollment = {
    userid: studentId,
    courseid: courseSelect.value,
    enrollmentdate: new Date().toISOString().split("T")[0]
  };

  fetch(`${apiUrl}/Enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrollment)
  }).then(() => {
    // fetchEnrollments();
    form.reset();
    courseFeesInput.value = "";
  });
});

fetchAll();

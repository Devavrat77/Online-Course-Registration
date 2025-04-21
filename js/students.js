const studentApiUrl = "http://localhost:3000/Users";

function loadStudents() {
  fetch(studentApiUrl)
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById('studentTableBody');
      tableBody.innerHTML = "";
      data.forEach(student => {
        tableBody.innerHTML += `
          <tr>
            <td>${student.userid}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.usertype}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editStudent('${student.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}

function setupStudentForm() {
  const form = document.getElementById('studentForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
      userid: document.getElementById('userid').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      phone: parseInt(document.getElementById('phone').value),
      usertype: document.getElementById('usertype').value
    };

    const studentId = form.getAttribute('data-editing-id');

    if (studentId) {
      fetch(`${studentApiUrl}/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(() => {
        alert('Student Updated!');
        form.reset();
        form.removeAttribute('data-editing-id');
        loadStudents();
      });
    } else {
      fetch(studentApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(() => {
        alert('Student Added!');
        form.reset();
        loadStudents();
      });
    }
  });
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    fetch(`${studentApiUrl}/${id}`, { method: 'DELETE' })
      .then(() => {
        alert('Student Deleted!');
        loadStudents();
      });
  }
}

function editStudent(id) {
  fetch(`${studentApiUrl}/${id}`)
    .then(res => res.json())
    .then(student => {
      document.getElementById('userid').value = student.userid;
      document.getElementById('name').value = student.name;
      document.getElementById('email').value = student.email;
      document.getElementById('password').value = student.password;
      document.getElementById('phone').value = student.phone;
      document.getElementById('usertype').value = student.usertype;
      document.getElementById('studentForm').setAttribute('data-editing-id', id);
    });
}

function initPage() {
  loadStudents();
  setupStudentForm();
}

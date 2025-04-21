function loadPage(page) {
    fetch(page)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            document.getElementById("main-content").innerHTML = html;
            loadPageScript(page);
        })
        .catch(error => {
            document.getElementById("main-content").innerHTML = `<p class='text-danger'>Error loading page: ${error.message}</p>`;
        });
}

function loadPageScript(page) {
    let scriptPath = '';

    switch (page) {
        case 'Courses.html':
            scriptPath = 'js/courses.js';
            break;
        case 'Instructors.html':
            scriptPath = 'js/instructors.js';
            break;
        case 'Student_Registration.html':
            scriptPath = 'js/students.js';
            break;
    }

    if (scriptPath) {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.onload = () => {
            if (typeof initPage === 'function') initPage();
        };
        document.body.appendChild(script);
    }
}

const frm = document.getElementsByTagName(form);

frm.addEventListener("submit", function(e){
    e.preventDefault();
    // frm.reset();
})

function setSubject(index) {
    let subjects = document.getElementById('subjects');

    let subject = JSON.parse(subjects.options[index].value);

    let idInput = document.getElementById('id');
    let nameInput = document.getElementById('name');
    let workloadInput = document.getElementById('workload');
    let professorSelect = document.getElementById('professor');

    idInput.value = subject.id;
    nameInput.value = subject.name;
    workloadInput.value = subject.workload;

    for (var opt, j = 0; opt = professorSelect.options[j]; j++) {
        if (JSON.parse(opt.value).id === subject.professor.id) {
            professorSelect.selectedIndex = j;
            break;
        }
    }
}

function changeSubject() {
    let subjects = document.getElementById('subjects');

    setSubject([subjects.selectedIndex]);
}

function getSubjects(callback) {
    fetch('http://localhost:3000/api/users')
    .then(response => {
        response.json()
        .then(json => {
            let professors = document.getElementById('professor');
            professors.innerHTML = '';

            json.forEach(user => {
                if (user.roles.find(role => role.name === 'Professor')) {
                    let professorOption = document.createElement('option');

                    professorOption.value = JSON.stringify(user);
                    professorOption.text = `${user.id} - ${user.name}`;

                    professors.appendChild(professorOption);
                }
            });

            fetch('http://localhost:3000/api/subjects')
            .then(response => {
                response.json()
                .then(json => {
                    let subjects = document.getElementById('subjects');
                    subjects.innerHTML = '';

                    json.forEach(subject => {
                        let subjectOption = document.createElement('option');
        
                        subjectOption.value = JSON.stringify(subject);
                        subjectOption.text = `${subject.id} - ${subject.name}`;
        
                        subjects.appendChild(subjectOption);
                    });

                    callback();
                });
            });
        });
    });
}

function createSubject() {
    let professors = document.getElementById('professor');

    let body = {
        name: String(document.getElementById('name').value),
        workload: Number(document.getElementById('workload').value),
        professor: {
            id: Number(JSON.parse(professors.options[professors.selectedIndex].value).id)
        }
    };

    fetch('http://localhost:3000/api/subjects', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(response => {
        getSubjects(() => changeSubject(0));

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })    
}

function updateSubject() {
    let professors = document.getElementById('professor');

    let body = {
        name: String(document.getElementById('name').value),
        workload: Number(document.getElementById('workload').value),
        professor: {
            id: Number(JSON.parse(professors.options[professors.selectedIndex].value).id)
        }
    };

    fetch('http://localhost:3000/api/subjects/' + document.getElementById('id').value, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(body)
    })
    .then(response => {
        getSubjects(() => changeSubject(0));

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })
}

function deleteSubject() {
    fetch('http://localhost:3000/api/subjects/' + document.getElementById('id').value, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
    })
    .then(response => {
        getSubjects(() => changeSubject(0));

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })
}

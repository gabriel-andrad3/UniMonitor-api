let subjects = [];
let professors = [];

async function getSubjects() {
    let table = document.getElementById('subjects');

    subjects = await api.subjects.get();
    sortById(subjects);

    await getProfessors();

    table.innerHTML  = '';

    subjects.forEach(subject => {
        let row = table.insertRow();

        let idCell = row.insertCell();
        idCell.innerHTML  = `<b>${subject.id}</b>`;

        let nameCell = row.insertCell();
        nameCell.innerHTML  = subject.name;

        let professorCell = row.insertCell();
        professorCell.innerHTML  = subject.professor.name;

        let workloadCell = row.insertCell();
        workloadCell.innerHTML  = subject.workload + ' horas';

        let actionsCell = row.insertCell();
        
        let editButton = document.createElement('button');
        editButton.classList.add('icon');
        editButton.classList.add('blue');
        editButton.innerHTML  = '<i class="fas fa-pencil-alt"></i>';
        editButton.onclick = () => showEditSubjectModal(subject);

        actionsCell.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('icon');
        deleteButton.classList.add('red');
        deleteButton.innerHTML  = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteSubject(subject);

        actionsCell.appendChild(deleteButton);
    });
}

async function getProfessors() {
    let users = await api.users.get();
    professors = users.filter(user => user.roles.filter(role => role.name === 'Professor').length > 0);
    sortById(professors);

    let select = document.getElementById('professor');
    select.innerHTML = '';

    professors.forEach(professor => {
        let option = document.createElement('option');

        option.value = professor.id;
        option.text = professor.name;
        
        select.appendChild(option);
    });

    select.selectedIndex = 0;
}

async function saveSubject() {
    let form = document.getElementById('form');

    let subject = {
        name: form.elements['name'].value,
        professor: {
            id: Number(form.elements['professor'].value)
        },
        workload: Number(form.elements['workload'].value)
    };

    let subjectId = form.elements['id'].value;

    try {
        if (subjectId === '') {
            await api.subjects.post(subject);
            setSuccess('Disciplina criada com sucesso!');
        }
        else {
            await api.subjects.put(subjectId, subject);
            setSuccess('Disciplina atualizada com sucesso!');
        }
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getSubjects();
        hideModal();
    }
}

async function deleteSubject(subject) {
    try {
        await api.subjects.delete(subject.id);
        setSuccess('Disciplina deletada com sucesso!');
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getSubjects();
    }
}

function showEditSubjectModal(subject) {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'EDITAR DISCIPLINA';

    let form = document.getElementById('form');

    form.elements['id'].value = subject.id;
    form.elements['name'].value = subject.name;
    form.elements['professor'].value = subject.professor.id;
    form.elements['workload'].value = subject.workload;
}

function showCreateSubjectModal() {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'NOVA DISCIPLINA';

    let form = document.getElementById('form');

    form.elements['id'].value = '';
    form.elements['name'].value = '';
    form.elements['professor'].selectedIndex = 0;
    form.elements['workload'].value = '';
}

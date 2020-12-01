let monitorings = [];
let subjects = [];
let monitors = [];

async function getMonitorings() {
    let table = document.getElementById('monitorings');

    monitorings = await api.monitorings.get();
    sortById(monitorings);

    await getSubjects();
    await getMonitors();

    table.innerHTML  = '';

    monitorings.forEach(monitoring => {
        let row = table.insertRow();

        let idCell = row.insertCell();
        idCell.innerHTML  = `<b>${monitoring.id}</b>`;

        let subjectCell = row.insertCell();
        subjectCell.innerHTML  = monitoring.subject.name;

        let monitorCell = row.insertCell();
        monitorCell.innerHTML  = monitoring.monitor.name;

        let actionsCell = row.insertCell();
        
        let editButton = document.createElement('button');
        editButton.classList.add('icon');
        editButton.classList.add('blue');
        editButton.innerHTML  = '<i class="fas fa-pencil-alt"></i>';
        editButton.onclick = () => showEditMonitoringModal(monitoring);

        actionsCell.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('icon');
        deleteButton.classList.add('red');
        deleteButton.innerHTML  = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteMonitoring(monitoring);

        actionsCell.appendChild(deleteButton);
    });
}

async function getSubjects() {
    let subjects = await api.subjects.get();
    sortById(subjects);

    let select = document.getElementById('subject');
    
    subjects.forEach(subject => {
        let option = document.createElement('option');

        option.value = subject.id;
        option.text = subject.name;
        
        select.appendChild(option);
    });

    select.selectedIndex = 0;
}

async function getMonitors() {
    let users = await api.users.get();
    monitors = users.filter(user => user.roles.filter(role => role.name === 'Monitor').length > 0);
    sortById(monitors);

    let select = document.getElementById('monitor');
    
    monitors.forEach(monitor => {
        let option = document.createElement('option');

        option.value = monitor.id;
        option.text = monitor.name;
        
        select.appendChild(option);
    });

    select.selectedIndex = 0;
}

async function saveMonitoring() {
    let form = document.getElementById('form');

    let monitoring = {
        subject: {
            id: Number(form.elements['subject'].value)
        },
        monitor: {
            id: Number(form.elements['monitor'].value)
        }
    };

    let monitoringId = form.elements['id'].value;

    try {
        if (monitoringId === '') {
            await api.monitorings.post(monitoring);
            setSuccess('Monitoria criada com sucesso!');
        }
        else {
            await api.monitorings.put(monitoringId, monitoring);
            setSuccess('Monitoria atualizada com sucesso!');
        }
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getMonitorings();
        hideModal();
    }
}

async function deleteMonitoring(monitoring) {
    try {
        await api.monitorings.delete(monitoring.id);
        setSuccess('Monitoria deletada com sucesso!');
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getMonitorings();
    }
}

function showEditMonitoringModal(subject) {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'EDITAR MONITORIA';

    let form = document.getElementById('form');

    form.elements['id'].value = subject.id;
    form.elements['subject'].value = subject.subject.id;
    form.elements['monitor'].value = subject.monitor.id;
}

function showCreateMonitoringModal() {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'NOVA MONITORIA';

    let form = document.getElementById('form');

    form.elements['id'].value = '';
    form.elements['subject'].selectedIndex = 0;
    form.elements['monitor'].selectedIndex = 0;
}

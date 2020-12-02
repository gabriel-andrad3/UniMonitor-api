let appointments = [];
let monitorings = [];
let schedules = [];

async function getAppointments() {
    let date = document.getElementById('date');

    date.valueAsDate = new Date();

    appointments = await api.appointments.get();
    sortById(appointments);

    await getMonitorings();
    await getSchedules();
}

async function getMonitorings() {
    monitorings = await api.monitorings.get();
    sortById(monitorings);

    let select = document.getElementById('monitorings');

    select.innerHTML = '';
    
    monitorings.forEach(monitoring => {
        let option = document.createElement('option');

        option.value = monitoring.id;
        option.text = monitoring.subject.name;
        
        select.appendChild(option);
    });

    select.selectedIndex = -1;

    select.onchange = () => showAppointments();
}

async function getSchedules() {
    schedules = await api.schedules.get();
    sortById(schedules);
}

async function showAppointments() {
    let select = document.getElementById('monitorings');
    let monitoringId = Number(select.options[select.selectedIndex].value);

    let date = document.getElementById('date').value;

    let monitoringAppointments = appointments.filter(x => x.schedule.monitoring.id === monitoringId);
    console.log(monitoringAppointments);
    // && (new Date(x.begin)).getDate() === new Date(date).getDate()
    console.log(monitoringAppointments[0]);
    console.log(new Date(monitoringAppointments[0].begin));
    console.log(new Date(date + 'T00:00:00.000Z'));

    let monitoringSchedulesDate = schedules.filter(x => x.monitoring.id === monitoringId && translateWeekday(x.weekday) === translateWeekdayFromIndex(new Date(date).getDay()));
    console.log(monitoringSchedulesDate);

    let monitor = document.getElementById('monitoring-monitor');
    monitor.value = monitoring.monitor.name;

    let table = document.getElementById('schedules');

    table.innerHTML = '';

    schedulesToShow.forEach(schedule => {
        let row = table.insertRow();

        let weekdayCell = row.insertCell();
        weekdayCell.innerHTML  = schedule.weekday;

        let scheduleCell = row.insertCell();
        scheduleCell.innerHTML  = `${schedule.begin} - ${schedule.end}`;

        let actionsCell = row.insertCell();
        
        let editButton = document.createElement('button');
        editButton.classList.add('icon');
        editButton.classList.add('blue');
        editButton.innerHTML  = '<i class="fas fa-pencil-alt"></i>';
        editButton.onclick = () => showEditScheduleModal(schedule);

        actionsCell.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('icon');
        deleteButton.classList.add('red');
        deleteButton.innerHTML  = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteSchedule(schedule);

        actionsCell.appendChild(deleteButton);
    });
}

async function saveSchedule() {
    let form = document.getElementById('form');

    let schedule = {
        begin: form.elements['begin'].value,
        end: form.elements['end'].value,
        weekday: form.elements['weekday'].value,
        monitoring: {
            id: Number(monitorings.options[monitorings.selectedIndex].value)
        }
    };

    let scheduleId = form.elements['id'].value;

    try {
        if (scheduleId === '') {
            await api.schedules.post(schedule);
            setSuccess('Horário criado com sucesso!');
        }
        else {
            await api.schedules.put(scheduleId, schedule);
            setSuccess('Horário atualizado com sucesso!');
        }
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getSchedules();
        hideModal();
    }
}

async function deleteSchedule(schedule) {
    try {
        await api.schedules.delete(schedule.id);
        setSuccess('Horário deletado com sucesso!');
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getSchedules();
    }
}

function showEditScheduleModal(schedule) {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'EDITAR HORÁRIO';

    let form = document.getElementById('form');

    console.log(schedule);

    form.elements['monitor'].value = schedule.monitoring.monitor.name;
    form.elements['subject'].value = schedule.monitoring.subject.name;
    form.elements['weekday'].value = schedule.weekday;
    form.elements['begin'].value = schedule.begin;
    form.elements['end'].value = schedule.end;
}

function showCreateScheduleModal() {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'NOVO HORÁRIO';

    let monitor = document.getElementById('monitoring-monitor');

    let form = document.getElementById('form');

    let monitorings = document.getElementById('monitorings');
    
    form.elements['monitor'].value = monitor.value;
    form.elements['subject'].value = monitorings.options[monitorings.selectedIndex].text;
    form.elements['weekday'].value = '';
    form.elements['begin'].value = '';
    form.elements['end'].value = '';
}

function fillWeekdaySelect() {
    let select = document.getElementById('weekday');

    select.innerHTML = '';

    weekdays.forEach(weekday => {
        let option = document.createElement('option');

        option.text = translateWeekday(weekday);
        option.value = weekday;

        select.appendChild(option);
    });
}

function fillBeginSelect() {
    let select = document.getElementById('begin');

    fillTimeSelect(select);
}

function fillEndSelect() {
    let select = document.getElementById('end');

    fillTimeSelect(select);
}

function fillTimeSelect(select) {
    const minutes = [00, 30];

    for (hour = 0; hour < 24; hour++) {
        minutes.forEach(minute => {
            let option = document.createElement('option');

            option.text = `${toTimeFormat(hour)}:${toTimeFormat(minute)}`;
            option.value = `${toTimeFormat(hour)}:${toTimeFormat(minute)}:00-03`;

            select.appendChild(option);
        })
    }
}

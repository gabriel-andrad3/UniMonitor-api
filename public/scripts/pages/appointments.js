let appointments = [];
let monitorings = [];
let schedules = [];

async function getAppointments() {
    let date = document.getElementById('date');

    date.valueAsDate = new Date();

    appointments = await api.appointments.get();
    sortById(appointments);
    fixAppointmentsDateTimezone(appointments);

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

    let monitoring = monitorings.find(x => x.id === monitoringId);

    let selectedDate = fixDateTimezone(new Date(document.getElementById('date').value));

    let schedulesOnSelectedDate = schedules.filter(x => x.monitoring.id === monitoringId && translateWeekday(x.weekday) === translateWeekdayFromIndex(selectedDate.getDay()));
    let appointmentsOnSelectedDate = appointments.filter(x => x.schedule.monitoring.id === monitoringId && x.begin.toDateString() === selectedDate.toDateString()); 

    let appointmentsToShow = [];

    schedulesOnSelectedDate.forEach(schedule => {
        let scheduleBeginDateParts = schedule.begin.split(':');

        let scheduleBeginDate = new Date(selectedDate.getTime());
        scheduleBeginDate.setHours(Number(scheduleBeginDateParts[0]));
        scheduleBeginDate.setMinutes(Number(scheduleBeginDateParts[1]));

        let scheduleEndDateParts = schedule.end.split(':');

        let scheduleEndDate = new Date(selectedDate.getTime());
        scheduleEndDate.setHours(Number(scheduleEndDateParts[0]));
        scheduleEndDate.setMinutes(Number(scheduleEndDateParts[1]));

        let date = new Date(scheduleBeginDate.getTime());

        while (date.getTime() < scheduleEndDate.getTime()) {
            let appointment = appointmentsOnSelectedDate.find(x => x.begin.getTime() === date.getTime());

            if (appointment) {
                appointmentsToShow.push({...appointment, avaiable: false });
            }
            else {
                let begin = new Date(date.getTime());
                let end = new Date(date.getTime());
                end.setMinutes(end.getMinutes() + 30);

                appointmentsToShow.push({
                    schedule: schedule,
                    begin: begin,
                    end: end,
                    avaiable: true
                });
            }

            date.setMinutes(date.getMinutes() + 30);
        }
    })

    let monitor = document.getElementById('monitoring-monitor');

    monitor.value = monitoring ? monitoring.monitor.name : '';

    let table = document.getElementById('schedules');

    table.innerHTML = '';

    appointmentsToShow.forEach(appointment => {
        let row = table.insertRow();

        let appointmentCell = row.insertCell();
        appointmentCell.innerHTML  = `${appointment.begin.toLocaleTimeString('pt-BR')} - ${appointment.end.toLocaleTimeString('pt-BR')}`;

        let avaiableCell = row.insertCell();
        avaiableCell.innerHTML  = appointment.avaiable ? 'Disponível' : 'Agendada';

        let studentCell = row.insertCell();
        studentCell.innerHTML  = appointment.student ? appointment.student.name : '';

        let actionsCell = row.insertCell();
        
        if (appointment.begin.getTime() > (new Date()).getTime()) {
            if (appointment.avaiable && userHasRoles(['Student'])) {
                let addButton = document.createElement('button');
                addButton.classList.add('icon');
                addButton.classList.add('blue');
                addButton.innerHTML  = '<i class="fas fa-plus button-icon"></i>';
                addButton.onclick = () => createAppointment(appointment);
        
                actionsCell.appendChild(addButton);
            }
            else if (monitoring.monitor.id === getUser().id || appointment.student.id === getUser().id) {
                let deleteButton = document.createElement('button');
                deleteButton.classList.add('icon');
                deleteButton.classList.add('red');
                deleteButton.innerHTML  = '<i class="fas fa-trash-alt"></i>';
                deleteButton.onclick = () => deleteAppointment(appointment);
        
                actionsCell.appendChild(deleteButton);
            }
        }
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

async function deleteAppointment(appointment) {
    try {
        await api.appointments.delete(appointment.id);
        setSuccess('Agendamento deletado com sucesso!');
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getAppointments();
    }
}

async function createAppointment(appointment) {
    try {
        appointment.student = {
            id: getUser().id
        }

        await api.appointments.post(appointment);
        setSuccess('Agendamento criado com sucesso!');
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getAppointments();
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

function fixAppointmentsDateTimezone(appointments) {
    appointments.forEach(appointment => {
        appointment.begin = new Date(appointment.begin);
        appointment.end = new Date(appointment.end);
    });
}

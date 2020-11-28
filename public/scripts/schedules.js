function setSchedule(index) {
    let schedules = document.getElementById('schedules');

    let schedule = JSON.parse(schedules.options[index].value);

    let idInput = document.getElementById('id');
    let weekdayInput = document.getElementById('weekday');
    let beginInput = document.getElementById('begin');
    let endInput = document.getElementById('end');
    let monitoringSelect = document.getElementById('monitoring');

    idInput.value = schedule.id;
    weekdayInput.value = schedule.weekday;
    beginInput.value = schedule.begin;
    endInput.value = schedule.end;


    for (var opt, j = 0; opt = monitoringSelect.options[j]; j++) {
        if (JSON.parse(opt.value).id === schedule.monitoring.id) {
            monitoringSelect.selectedIndex = j;
            break;
        }
    }
}

function changeSchedule() {
    let schedules = document.getElementById('schedules');

    setSchedule(schedules.selectedIndex);
}

function getSchedules(callback) {
    fetch('http://localhost:3000/api/users')
    .then(response => {
        response.json()
        .then(json => {
            let monitorings = document.getElementById('monitoring');
            monitorings.innerHTML = '';

            json.forEach(user => {
                if (user.roles.find(role => role.name === 'Monitoring')) {
                    let monitoringOption = document.createElement('option');

                    monitoringOption.value = JSON.stringify(user);
                    monitoringOption.text = `${user.id} - ${user.name}`;

                    monitorings.appendChild(monitoringOption);
                }
            });

            fetch('http://localhost:3000/api/schedules')
            .then(response => {
                response.json()
                .then(json => {
                    let schedules = document.getElementById('schedules');
                    schedules.innerHTML = '';                

                    json.forEach(schedule => {
                        let scheduleOption = document.createElement('option');
        
                        scheduleOption.value = JSON.stringify(schedule);
                        scheduleOption.text = `${schedule.id} - ${schedule.name}`;
        
                        schedules.appendChild(scheduleOption);
                    });

                    callback();
                });
            });
        });
    });
}

function createSchedule() {
    let monitorings = document.getElementById('monitoring');

    let body = {
        weekday: String(document.getElementById('weekday').value),
        begin: TimeRanges(document.getElementById('begin').value),
        end: TimeRanges(document.getElementById('end').value),
        monitoring: {
            id: Number(JSON.parse(monitorings.options[monitorings.selectedIndex].value).id)
        }
    };

    fetch('http://localhost:3000/api/schedules', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(response => {
        getSchedules(() => changeSchedule(0));

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })    
}

function updateSchedule() {
    let monitorings = document.getElementById('monitoring');

    let body = {
        weekday: String(document.getElementById('weekday').value),
        begin: TimeRanges(document.getElementById('begin').value),
        end: TimeRanges(document.getElementById('end').value),
        monitoring: {
            id: Number(JSON.parse(monitorings.options[monitorings.selectedIndex].value).id)
        }
    };

    fetch('http://localhost:3000/api/schedules/' + document.getElementById('id').value, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(body)
    })
    .then(response => {
        getSchedules(() => changeSchedule(0));

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })
}

function deleteSchedule() {
    fetch('http://localhost:3000/api/schedules/' + document.getElementById('id').value, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
    })
    .then(response => {
        getSchedules(() => changeSchedule(0));

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })
}

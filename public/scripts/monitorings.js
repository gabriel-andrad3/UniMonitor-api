const { response, json } = require("express");

function createMonitoring() {
    let subjects = document.getElementById('subjects');

    let monitors = document.getElementById('monitors');

    let body = {
        subjects: {
            id: Number(JSON.parse(subjects.options[subjects.selectedIndex].value).id)
        },
        monitors: {
            id: Number(JSON.parse(monitors.options[monitors.selectedIndex].value).id)
        }
    };

    fetch('http://localhost:3000/api/monitorings/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(response => {
        // atualizar tela

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })
}

// parei aqui
function updateMonitoring() {
    let subjects = document.getElementById('subjects');

    let monitors = document.getElementById('monitors');

    let body = {
        subjects: {
            id: Number(JSON.parse(subjects.options[subjects.selectedIndex].value).id)
        },
        monitors: {
            id: Number(JSON.parse(monitors.options[monitors.selectedIndex].value).id)
        }
    };

    fetch('http://localhost:3000/api/monitorings/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(response => {
        // atualizar tela

        response.json().then(json => console.log(json));
    })
    .catch(error => {
        console.log(error);
    })
}
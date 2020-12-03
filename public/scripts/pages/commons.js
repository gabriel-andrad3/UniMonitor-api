window.onclick = function(event) {
    let modal = document.getElementById('modal');

    if (event.target == modal) {
        hideModal();
    }
}

function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function userHasRoles(roles = []) {
    let existentRoles = getUser().roles.filter(role => roles.includes(role.name));

    return existentRoles.length !== 0;
}

function hideLinks() {
    let subjectsLink = document.getElementById('subjects-link');
    subjectsLink.hidden = !userHasRoles(['Admin']);

    let usersLink = document.getElementById('users-link');
    usersLink.hidden = !userHasRoles(['Admin']);

    let monitoringsLink = document.getElementById('monitorings-link');
    monitoringsLink.hidden = !userHasRoles(['Admin', 'Professor']);

    let schedulesLink = document.getElementById('schedules-link');
    schedulesLink.hidden = !userHasRoles(['Admin', 'Professor', 'Monitor', 'Student']);

    let appointmentsLink = document.getElementById('appointments-link');
    appointmentsLink.hidden = !userHasRoles(['Admin', 'Professor', 'Monitor', 'Student']);
}

function hideModal() {
    let modal = document.getElementById('modal');

    modal.style.display = 'none';   
}

function showModal() {
    let modal = document.getElementById('modal');

    modal.style.display = 'block';   
}

function setSuccess(text) {
    let status = document.getElementById('status');

    status.classList.remove('red-background');
    status.classList.add('green-background');
    status.innerText = text;
}

function setError(text) {
    let status = document.getElementById('status');

    status.classList.remove('green-background');
    status.classList.add('red-background');
    status.innerText = text;
}

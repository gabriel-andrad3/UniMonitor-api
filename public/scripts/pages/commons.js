window.onclick = function(event) {
    let modal = document.getElementById('modal');

    if (event.target == modal) {
        hideModal();
    }
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

async function login() {
    let form = document.getElementById('form');

    let register = form.elements['register'].value;
    let password = form.elements['password'].value;

    try {
        let token = await api.sessions.post(register, password);

        localStorage.setItem('token', token);
        localStorage.setItem('user', atob(token.split('.')[1]));

        window.location.href = 'schedules.html';
    }
    catch (error) {
        setError(error);
    }
}

let users = [];
let roles = [];

async function getUsers() {
    let table = document.getElementById('users');

    users = await api.users.get();
    sortById(users);

    users.forEach(user => {
        sortById(user.roles);
    });

    await getRoles();

    table.innerHTML  = '';

    users.forEach(user => {
        let row = table.insertRow();

        let idCell = row.insertCell();
        idCell.innerHTML  = `<b>${user.id}</b>`;

        let registerCell = row.insertCell();
        registerCell.innerHTML  = user.register;

        let nameCell = row.insertCell();
        nameCell.innerHTML  = user.name;

        let rolesCell = row.insertCell();
        rolesCell.innerHTML = user.roles.map(x => translateRoleName(x.name)).join(', ');

        let actionsCell = row.insertCell();
        
        let editButton = document.createElement('button');
        editButton.classList.add('icon');
        editButton.classList.add('blue');
        editButton.innerHTML  = '<i class="fas fa-pencil-alt"></i>';
        editButton.onclick = () => showEditUserModal(user);

        actionsCell.appendChild(editButton);
    });
}

async function getRoles() {
    roles = await api.roles.get();
    sortById(roles);

    let div = document.getElementById('roles');

    div.innerHTML = '';
    
    roles.forEach(role => {
        let container = document.createElement('div');

        container.classList.add('container');

        let checkbox = document.createElement('input');

        checkbox.id = `role-${role.id}`;
        checkbox.name = checkbox.id;
        checkbox.type = 'checkbox';
        checkbox.value = role.id;
        
        let label = document.createElement('label');

        label.for = checkbox.id;
        label.innerHTML = translateRoleName(role.name);
        
        container.appendChild(label);
        container.appendChild(checkbox);

        div.appendChild(container);
    });
}

async function saveUser() {
    let form = document.getElementById('form');

    let user = {
        roles: roles.filter(role => form.elements[`role-${role.id}`].checked)
    };

    console.log(user);

    let userId = form.elements['id'].value;

    try {
        await api.users.put(userId, user);
        setSuccess('Usuário atualizada com sucesso!');
    }
    catch (error) {
        setError(error);
    }
    finally {
        await getUsers();
        hideModal();
    }
}

function showEditUserModal(user) {
    showModal();

    let action = document.getElementById('modal-action');
    action.innerHTML = 'EDITAR USUÁRIO';

    let form = document.getElementById('form');

    form.elements['id'].value = user.id;
    form.elements['name'].value = user.name;
    form.elements['register'].value = user.register;

    roles.forEach(role => {
        form.elements[`role-${role.id}`].checked = user.roles.map(x => x.id).includes(role.id);
    });
}

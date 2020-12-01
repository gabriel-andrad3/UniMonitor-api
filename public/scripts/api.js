const _client = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
})

const api = {
    users: {
        get: async function () {
            try {
                const response = await _client.get('/users');
        
                return response.data;
            }
            catch (error) {
                resolveError(resolveError);
            }
        }
    },
    subjects: {
        get: async function () {
            try {
                const response = await _client.get('/subjects');
        
                return response.data;
            }
            catch (error) {
                resolveError(error);
            }
        },
        post: async function (subject) {
            try {
                const response = await _client.post('/subjects', subject);

                return response.data;
            }
            catch (error) {
                resolveError(error);
            }
        },
        put: async function (id, subject) {
            try {
                const response = await _client.put(`/subjects/${id}`, subject);

                return response.data;
            }
            catch (error) {
                resolveError(error);
            }
        },
        delete: async function (id) {
            try {
                await _client.delete(`/subjects/${id}`);
            }
            catch (error) {
                resolveError(error);
            }
        }
    },
    monitorings: {
        get: async function () {
            try {
                const response = await _client.get('/monitorings');
        
                return response.data;
            }
            catch (error) {
                resolveError(error);
            }
        },
        post: async function (monitoring) {
            try {
                const response = await _client.post('/monitorings', monitoring);

                return response.data;
            }
            catch (error) {
                resolveError(error);
            }
        },
        put: async function (id, monitoring) {
            try {
                const response = await _client.put(`/monitorings/${id}`, monitoring);

                return response.data;
            }
            catch (error) {
                resolveError(error);
            }
        },
        delete: async function (id) {
            try {
                await _client.delete(`/monitorings/${id}`);
            }
            catch (error) {
                resolveError(error);
            }
        }
    }
}

function resolveError(error) {
    if (error.response.data.message) {
        throw Error(error.response.data.message);
    }
    throw Error('unexpected error');
}
const axios = require('axios');

async function getMicrosoftTokenKey(kid) {
    const response = await axios.get('https://login.microsoftonline.com/common/discovery/v2.0/keys');

    const key = response.data.keys.first(key => key.kid === kid);

    if (key)
        return key;

    throw new Error("unable to find key");
}

module.exports = {
    getMicrosoftTokenKey,
}
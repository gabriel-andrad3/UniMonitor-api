const { GeneralError } = require('../utils/errors');

function handleErrors(err, req, res, next) {
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'unexpected error'
    })
}

module.exports = handleErrors;

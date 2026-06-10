const mongoose = require('mongoose');

function sendMessage(res, message, status=200) {
    res.status(status).json({ message: message });
}

function handleServerError(error, res) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
}

function handleCastError(error, res) {
    if (error instanceof mongoose.Error.CastError) {
        res.status(400).json({ message: `Wrong "${error.path}" format.` });
        return true;
    }
    return false;
}

module.exports = { handleServerError, handleCastError, sendMessage };
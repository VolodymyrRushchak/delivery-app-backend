function handleServerError(error, res) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
}

module.exports = { handleServerError };
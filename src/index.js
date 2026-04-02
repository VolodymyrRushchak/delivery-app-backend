const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGODB_URL).
    then(() => console.log('Connected to MongoDB')).
    catch((error) => console.log('Failed to connect to MongoDB: ', error));

app.get('/', (req, res) => {
    res.json({ message: 'It works!' });
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
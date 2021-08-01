const express = require('express');
let database = require('./database');


let users = database.users;
let notes = database.notes;

let userId = 0;

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.end('This is the Home Page')
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/notes', (req, res) => {
    //console.log(req.query.id);
    let userNotes = [];
    notes.map(note => {
        if(req.query.userid === String(note.userid)) {
            userNotes.push(note);
        }
    });

    res.json(userNotes);
});


app.post('/create-account', (req, res) => {
    if(req.body.password === req.body.confirmPassword) {
        users.push({
            userid: userId += 1,
            username: req.body.username,
            password: req.body.password
        });
        res.end(`Usuário cadastrado com sucesso!`);

    } else {
        res.send('As senhas precisam ser iguais');
    }
});

app.post('/create-note', (req, res) => {
    if(req.body.title === null || req.body.text === null) {
        res.end('title and text must be filled')
    } else {
        notes.push({
            userid: req.body.userid,
            title: req.body.title,
            text: req.body.text
        });
        res.end('Note created!')
    }
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
});

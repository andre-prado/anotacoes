const express = require('express');
let database = require('./database');
const jwt = require('jsonwebtoken');
const config = require('./config');


const SECRET = config.secret;

let users = database.users;
let notes = database.notes;
let userId = 1;

const app = express();
app.use(express.json());


function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).end();

        req.userid = decoded.userid;
        next();
    })

}

app.get('/', (req, res) => {
    res.end('This is the Home Page')
});


app.post('/login', (req, res) => {
    users.map(user => {
        if(user.username === req.body.username && user.password === req.body.password) {
            const token = jwt.sign({userid: user.id}, SECRET, {expiresIn: 500});
            return res.json({auth:true, token});
        }

        res.status(401).end('wrong username or password.')
    });
});


app.get('/users', verifyJWT, (req, res) => {
    res.json(users);
});


app.get('/notes', verifyJWT, (req, res) => {
    let userNotes = [];
    notes.map(note => {
        if(req.query.userid === String(note.userid)) {
            userNotes.push(note);
        }
    });
    if(userNotes.length === 0)
        res.end('There is no notes.')
    else     
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

app.post('/create-note', verifyJWT, (req, res) => {
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

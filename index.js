require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

const People = require('./models/people');

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>');
// });

app.get('/info', (request, response) => {
  const phonebookEntries = persons.length;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${phonebookEntries} people</p></br><p>${date}</p>`
  );
});

// app.get('/api/persons', (request, response) => {
//   response.json(persons);
// });

app.get('/api/persons', (request, response) => {
  People.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * 999999));
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name and/or Number is missing',
    });
  }

  let nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({
      error: 'Name already exists in the phonebook',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

// const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

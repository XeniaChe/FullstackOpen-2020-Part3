const express = require('express');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use(express.static('build'));

const morgan = require('morgan');
morgan.token('data', (req, res) => JSON.stringify(req.body));
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :data'
	)
);

//Connecting to MongoDB
require('dotenv').config();
const Person = require('./models/peopleModel');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

//Fetch all people
app.get('/api/persons', (req, res) => {
	Person.find({}).then((people) => res.json(people));
});

app.get('/api/info', (req, res) => {
	const info = {
		content: `This phonebook has  info for ${persons.length} people`,
		date: new Date()
	};

	res.send(`<p>${info.content}</p> <p>${info.date}</p>`);
});

//Fetch sinfle person
app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then((person) => res.json(person));
});

app.delete('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	persons = persons.filter((el) => el.id !== id);
	res.status(204).end();
});

const generateID = () => {
	return Math.floor(Math.random() * Math.floor(persons.length * 100 || 100));
};

app.post('/api/persons', (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(409).json({ error: 'some contact data is missing' });
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number
	});

	newPerson.save().then((savedPerson) => res.json(savedPerson));
});

const unknownEndPoint = (req, res) => {
	req.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndPoint);

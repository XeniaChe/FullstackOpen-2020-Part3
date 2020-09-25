const express = require('express');
const app = express();
app.use(express.json());

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456'
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523'
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345'
	},
	{
		id: 4,
		name: 'Mary Poppendick',
		number: '39-23-6423122'
	}
];

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

app.get('/api/info', (req, res) => {
	const info = {
		content: `This phonebook has  info for ${persons.length} people`,
		date: new Date()
	};

	res.send(`<p>${info.content}</p> <p>${info.date}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	// console.log(req.params);

	const person = persons.find((el) => el.id === id);

	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	persons = persons.filter((el) => el.id !== id);
	res.status(204).end();
});

app.use(express.json());

const generateID = () => {
	return Math.floor(Math.random() * Math.floor(persons.length * 100 || 100));
};

app.post('/api/persons', (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(404).json({ error: 'some contact data is missing' });
	}

	const newPerson = {
		id: generateID(),
		name: body.name,
		number: body.number
	};

	persons = persons.concat(newPerson);

	res.json(newPerson);
});

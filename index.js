/* eslint-disable prefer-destructuring */
const express = require('express');

const app = express();
const cors = require('cors');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

const morgan = require('morgan');

morgan.token('data', (req, res) => JSON.stringify(req.body));
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :data'
	)
);

// Connecting to MongoDB
require('dotenv').config();
const Person = require('./models/peopleModel');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Fetch all people
app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((people) => res.json(people))
		.catch((error) => next(error));
});

app.get('/api/info', (req, res, next) => {
	Person.estimatedDocumentCount()
		.then((count) => {
			if (count) {
				const info = {
					count,
					date: new Date()
				};
				res.send(
					`<p>This phonebook has  info for ${info.count} people</p> <p>${info.date}</p>`
				);
			} else {
				res.send('This phonebook is empty');
			}
		})
		.catch((error) => next(error));
});

// Fetch single person
app.get('/api/persons/:id', (req, response, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then((result) => {
			console.log('Object deleted');
			res.status(204).end();
		})
		.catch((error) => next(error));
});

// eslint-disable-next-line consistent-return
app.post('/api/persons', (req, res, next) => {
	const body = req.body;
	console.log(body);

	if (!body.name || !body.number) {
		return res.status(409).json({ error: 'some contact data is missing' });
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number
	});

	newPerson
		.save()
		.then((savedPerson) => res.json(savedPerson))
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body;

	const updatePerson = {
		name: body.name,
		number: body.number
	};

	Person.findByIdAndUpdate(req.params.id, updatePerson, {
		new: true,
		runValidators: true,
		context: 'query'
	})
		.then((updatedPerson) => res.json(updatedPerson))
		.catch((error) => next(error));
});

// UnknownEndpoin middleware
const unknownEndPoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndPoint);

// Handler for requests with error
// eslint-disable-next-line consistent-return
const errorHandler = (error, req, res, next) => {
	console.error(error.message);
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' });
	}
	if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

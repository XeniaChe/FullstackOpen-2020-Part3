const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;
console.log(`Connecting to ${url} DB`);
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then((res) => {
		console.log(`connected to DB ${url}`);
	})
	.catch((error) => {
		console.log('Did not connect to DB:', error.message);
	});

const personSchema = new mongoose.Schema({
	name: String,
	number: String
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Person', personSchema);

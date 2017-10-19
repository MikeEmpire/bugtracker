import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import webpack from 'webpack';
import config from './webpack.config';
import mongoose from 'mongoose';
import Bug from './models/bugs';

const app = express();
const router = express.Router();
const compiler = webpack(config);
const PORT = 3000;

var mongodb = 'mongodb://mikeolie:Encarta100@ds161584.mlab.com:61584/kamblog';

mongoose.Promise = global.Promise;
mongoose.connect(mongodb, {
	useMongoClient: true,
	promiseLibrary: require('bluebird')
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	public: config.output.publicPath
}));

app.use(express.static('static'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

router.get('/', (req, res) => {
	res.json({message: 'API Initialized!'})
});

router.route('/bugs')
	.get((req, res) => {
		// Bug.find({priority: 'P1' }, function(err, bug) {
		// 	if (err) console.log(err);
		// 	console.log(bug)
		// 	res.json(bug);
		// });
		// Bug.find(function(err, bugs) {
		// 	if (err) return res.send(err);
		// 	res.json(bugs)
		// })
		const filter = {};
		console.log(req.query);
		if (req.query.status && req.query.priority) {
			filter.status = req.query.status;
			filter.priority = req.query.priority;
			console.log(`the priority is ${filter.priority} & the status is ${filter.status}`);
			Bug.find({
				priority: filter.priority
			}).
			where('status').
			equals(filter.status).
			exec((err, bug) => {
				if (err) console.log(bug);
				console.log(bug);
				res.json(bug);
			})
		} else if (req.query.status) {
			filter.status = req.query.status;
			console.log(`the status is ${filter.status}`);
			Bug.find({
				status: filter.status
			}, (err, bug) => {
				if (err) console.log(bug);
				console.log(bug);
				res.json(bug);
			})
		} else if (req.query.priority) {
			filter.priority = req.query.priority;
			console.log(`the priority is ${filter.priority}`)
			Bug.find({
				priority: filter.priority
			}, (err, bug) => {
				if (err) console.log(bug);
				console.log(bug);
				res.json(bug);
			})
		} else {
			console.log('no query');
		}
	})
	.post((req, res) => {
		console.log(req.body)
		var newBug = new Bug();
		newBug.id = req.body.id;
		newBug.owner = req.body.owner;
		newBug.title = req.body.title;
		newBug.priority = req.body.priority;
		newBug.status = req.body.status;

		newBug.save(err => {
			if (err)
			res.send(err);
		})
	});

router.route('/addbugs')
	.get((req, res) => {
		Bug.collection.insert(bugs, onInsert);
		res.send('Seeded database!');
	});

let bugs = [
	{priority: 'P1', status: 'Closed', owner: 'Big Mike', title: 'Nav link crashed'},
	{priority: 'P2', status: 'Open', owner: 'Michael', title: 'Scroll magic disabled'}
]

function onInsert(err, docs) {
    if (err) {
        console.log(err);
    } else {
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}

app.use('/api', router);

app.get('/', (res) => {
	res.send(path.join(__dirname, './static/index.html'));
})

app.listen(PORT, () => {
	console.log(`You are listening on Port:${PORT}`);
})

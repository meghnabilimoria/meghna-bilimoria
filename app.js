//app.js : Meghna Bilimoria - 301127778 - 8th Oct 2020, 21st Oct 2020.
// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const mongo = require('mongodb').MongoClient;
var assert = require('assert');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess; 
var url = 'mongodb+srv://meghna:7654321@cluster0.a482q.mongodb.net/NodeExpressJS?retryWrites=true&w=majority';
// Static Files to set path of public
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))
app.use('/fonts', express.static(__dirname + 'public/fonts'))

//Set Template engine partials
app.use(expressLayouts)
app.set('layout', './layouts/main')

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://meghna:7654321@cluster0.a482q.mongodb.net?retryWrites=true&w=majority";
//"mongodb+srv://<user>:<password>@<cluster-url>?w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var nameSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    phone: String
});
var User = mongoose.model("User", nameSchema);

var loginSchema = new mongoose.Schema({
    name: String,
    password:String
});
var Login = mongoose.model("Login", loginSchema);

async function showData(resultArray, callback) {
    try {
        //var 
        await client.connect();
        const database = client.db("NodeExpressJS");
        const collection = database.collection("Contact");
        const result = await collection.find({}).toArray(function (err, result) {
            if (result != undefined && result.length > 0) {
                result.forEach(function (doc, err) {
                    resultArray.push(doc);
                    // console.log(doc);
                }, function () {
                    db.close();
                    console.log(resultArray);

                });
            }
            callback();
        });
    } finally {
        //await client.close();
    }
}

async function insertData(myData) {
    try {
        await client.connect();
        const database = client.db("NodeExpressJS");
        const collection = database.collection("Contact");
        const result = await collection.insertOne(myData);
        console.log(
            `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
        );
    } finally {
        await client.close();
    }
}
app.post('/insert', function (req, res) {
    debugger;
    var myData = new User(req.body);
    console.log(myData);
    insertData(myData).catch(console.dir);
})

async function updateData(id, myData) {
    try {
        await client.connect();
        const database = client.db("NodeExpressJS");
        const collection = database.collection("Contact");
        const result = await collection.findOneAndUpdate({ _id: id }, myData, { upsert: true });
        console.log(
            `${result} document(s) were updated`,
        );
    } finally {
        await client.close();
    }
}
app.post('/edit', function (req, res) {
    debugger;
    var myData = new User(req.body);
    console.log("hellooss ");
    console.log(myData._id + myData);
    updateData(myData._id, myData).catch(console.dir);
    var resultArray = [];
    showData(resultArray, function () { res.render('dashboard', { title: 'Dashboard', page: 'dashboard', items: resultArray }); }).catch(console.dir);
})


async function deleteData(id, callback) {
    try {
        await client.connect();
        const database = client.db("NodeExpressJS");
        const collection = database.collection("Contact");
        console.log("starr");
        const result = await collection.deleteOne({ _id: id }, function (err, obj) {
            if (err) throw err;
            console.log("end1");
            callback();
            //  await client.close();
        });
        console.log("end");
        return;
    } finally {
        //  await client.close();
    }
}
app.get('/dashboard', (req, res) => {
    try{
    if(sess.username) {
    var resultArray = [];
    showData(resultArray, function () { res.render('dashboard', { title: 'Dashboard', page: 'dashboard', items: resultArray }); }).catch(console.dir);
    }
    else{
        res.end("Please login first");
        res.render('login', { title: 'Login', page: 'login',msg:"Please login first" })
    }
}
catch{
    res.render('login', { title: 'Login', page: 'login',msg:"Please login first" })
}
})
app.post('/delete', function (req, res) {
    debugger;
    //console.log("Id is " + req.params.id);
    var myData = new User(req.body);
    console.log(myData._id + myData);
    deleteData(myData._id, function () {
        var resultArray = [];
        showData(resultArray, function () { res.render('dashboard', { title: 'Dashboard', page: 'dashboard', items: resultArray }); }).catch(console.dir);
    }).catch(console.dir);

})

// Navigation
// home page
app.get('', (req, res) => {
    res.render('index', { text: 'Hey', title: 'Home', page: 'home' })
})
app.get('/home', (req, res) => {
    res.render('index', { title: 'Home', page: 'home' })
})
// about
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me', page: 'about' })
    // res.sendFile(__dirname + '/views/404.html')
})
// project
app.get('/project', (req, res) => {
    res.render('project', { title: 'My Projects', page: 'project' })
})

// video
app.get('/video', (req, res) => {
    res.render('video', { title: 'My Videos', page: 'video' })
})
// service
app.get('/service', (req, res) => {
    res.render('service', { title: 'My Services', page: 'service' })
})
// contact
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Me', page: 'contact' })
})
// login
app.get('/login', (req, res) => {
    sess = req.session;
	if(sess.username) {
		return res.redirect('/dashboard');
	}
    res.render('login', { title: 'Login', page: 'login' })
})
app.post('/login', (req, res) => {
    sess = req.session;
	sess.username = req.body.username;
	res.end('done');
})
app.get('/logout',(req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
	});

});

// Dashboard



// Listen on Port 
app.listen(port, () => console.info(`App listening on port ${port}`))
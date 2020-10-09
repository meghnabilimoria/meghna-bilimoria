//app.js : Meghna Bilimoria - 301127778 - 8th Oct 2020.
// Imports
const express = require('express')
const expressLayouts=require('express-ejs-layouts')
const app = express()
const port = process.env.PORT || 8000


// Static Files to set path of public
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))
app.use('/fonts', express.static(__dirname + 'public/fonts'))

//Set Template engine partials
app.use(expressLayouts)
app.set('layout','./layouts/main')

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Navigation
// home page
app.get('', (req, res) => {
    res.render('index', { text: 'Hey',title:'Home',page:'home' })
})
app.get('/home', (req, res) => {
    res.render('index', { title:'Home',page:'home'})
})
// about
app.get('/about', (req, res) => {
    res.render('about', { title:'About Me',page:'about' })
  // res.sendFile(__dirname + '/views/404.html')
})
// project
app.get('/project', (req, res) => {
    res.render('project', { title:'My Projects',page:'project' })
})

// video
app.get('/video', (req, res) => {
    res.render('video', { title:'My Videos',page:'video' })
})
// service
app.get('/service', (req, res) => {
    res.render('service', { title:'My Services',page:'service' })
})
// contact
app.get('/contact', (req, res) => {
    res.render('contact', { title:'Contact Me',page:'contact' })
})


// Listen on Port 
app.listen(port, () => console.info(`App listening on port ${port}`))

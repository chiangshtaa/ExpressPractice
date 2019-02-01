const Joi = require('joi');
const path = require('path');
const express = require('express');
const app = express();

const request = require('request');

app.use(express.json()); // allows express to use middleware

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/here', (req, res) => {
  request('http://jsonplaceholder.typicode.com/posts', (err, response, body) => {
    if (err) {
      throw err;
    }
    res.send(body);
  })
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FROM TUTORIAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// hhtp methods
// app.get();
// app.post();
// app.put();
// app.delete();


// takes in 2 arguments.  path (url) and callback function
app.get('/', (req, res) => {
  res.send('Hello World!');
})



const courses = [
  { id: 1, name: 'course 1' },
  { id: 2, name: 'course 2' },
  { id: 3, name: 'course 3' },
]
// get courses
app.get('/api/courses', (req, res) => {
  // grab something from database usually
  res.send(courses);
})

// get single course with id
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) { // status 404 if not found
    return res.status(404).send('The course with the given ID was not found');
  }
  res.send(course);
})

// route parameters for essential or required values (req.params)
// ? are query string parameters (?sortBy=name) => { sortBy: 'name' } for req.query
app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.params);
  // res.send(req.query);
})



// how to respond to HTTP POST requests (create new course)
// use Postman to test post requests
app.post('/api/courses', (req, res) => {

  const result = validateCourse(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  // if (!req.body.name || req.body.name.length < 3) {
  //   // status code 400 = bad request
  //   res.status(400).send('Name is required and should be minimum of 3 characters');
  //   return;
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})



// Update resources
app.put('/api/courses/:id', (req, res) => {
  // If course does not exist, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('The course with the given ID was not found');
  }

  // if invalid request, return 404
  const result = validateCourse(req.body);
  // const { error } = validateCourse(req.body); // destructuring way

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  // Update course
  course.name = req.body.name;
  res.send(course);
})

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema);
}


app.delete('/api/courses/:id', (req, res) => {
  // If course does not exist, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('The course with the given ID was not found');
  }

  // Delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
})



// cant rely on 3000 to be available all the time
// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})
//The primary purpose of this controller is to respond to post requests against the '/test' route/endpoint.
//Post requests to this endpoint are performed when a user submits their code for evaluation to determine if they passed the corresponding tests
var jsStringEscape = require('js-string-escape');
var mongoose = require('mongoose');
var Algo = mongoose.model('algorithmSchema');
var fs = require('fs');
var cmd = require('node-cmd');


//Function to write the mocha tests (test.js) for a given game to a 'data' folder on the server.
const writeTestToFile = (test, functionName) => {
  /*The below line adds necessary 'require' statements that are necessary to execute the mocha tests. 
  This includes mocha, chai, and the js file for the code submission by the user  lol*/
  fs.writeFileSync('./server/data/test.js', `var ${functionName.split("").reverse().slice(2).reverse().join("")} = require('./submission.js')\nvar chai = require('chai'); \nvar mocha = require('mocha');\n`);
  fs.appendFileSync('./server/data/test.js', test);
  console.log('The Test file has been saved!');
}

//Function to write the user code submission (submission.js) for a given game to a 'data' folder on the server.
const writeSubmissionToFile = (submission, functionName) => {
  /*The below line adds an exports statement to the submission file, so that the code can be tested by the tests in test.js. 
  This includes mocha, chai, and the js file for the code submission by the user */
  fs.writeFileSync('./server/data/submission.js', 'module.exports = ');
  fs.appendFileSync('./server/data/submission.js', submission);
  console.log('The Submission file has been saved!');
}

//Function to handle a request to evaluate a user code submission against the tests for the corresponding algorithm
exports.getSubmissionEvaluation = (req, res) => {

  /*
  var submission = bubbleSort.bubbleSort.func
  var functionName = 'bubbleSort';
  */

  // console.log(req.body);
  // JSC - possibly need to grab time and length data here as well 
  //pulling data off of request body
  var submission = req.body.value || '';
  var test = req.body.testSuite;
  var algoId = req.body.algo;

  console.log('ALGO ID: ' + algoId);
  console.log('test: ' +  test);
  console.log('submission: ' + submission);

  //Using the algo ID from the request, we get the function name, call functions to write the test and submission files, and run the mocha executable against the tests for the algorithm (along with the user code submission)
  Algo.findById(algoId, (error, algo) => {
    if (error) { throw error; }
    var functionName = algo.functionName;

    writeTestToFile(test, functionName);
    writeSubmissionToFile(submission, functionName);

    /*
      Given that the server is running in the server folder, 
      we change directory to the data folder and run mocha
      Pre-requisite: Mocha must be installed globally in order for this to work
      ("npm install -g mocha").
    */
    cmd.get('cd server/data && mocha', (error, data, stderr) => {
      // console.log("DATA", data)

      // SAM 11/14/2017 - I initially wrote this but Mocha throws an error if the tests fail.
      // Good for us to review
      
      // if (error) { return res.status(400).send(error); }

      //JSC - need to add time(seconds left), and length data into this object for total points calculation

      // RegExp to find the number of tests that are passing and failing;
      console.log('data', data);
      var regPassing = /passing/.exec(data) || false;
      var passing = regPassing ? data[regPassing.index - 2] : '0';
      passing = Number(data[regPassing.index - 3]) ? data[regPassing.index - 3] + passing : passing;

      var regFailing = /failing/.exec(data) || false;
      var failing = regFailing ? data[regFailing.index - 2] : '0';
      failing = Number(data[regFailing.index - 3]) ? data[regFailing.index - 3] + failing : failing;

      // console.log(error);
      // Create object to return back for the post request
      var returnObj = {
        passing: passing, 
        failing: failing,
        testResults: data || error.toString() // This is a printout from mocha with the details of the passing and failing tests
      }; 

      res.send(returnObj);
    });
  });
}
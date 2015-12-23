function signupUser(form)
{
	console.log("userid: " + form.userid.value);
	console.log("pswrd1: " + form.pswrd1.value);
	console.log("pswrd2: " + form.pswrd2.value);
 /*check the input values*/
 if(form.pswrd1.value != form.pswrd2.value)
  {
	alert("Passwords do not match!");/*displays error message*/
  }
 else{
	console.log("Doing Require.");
	var MongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	console.log("Done Assert.");
	var url = 'mongodb://localhost:27017/test';
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server.");
		db.close();
	});
 }
}

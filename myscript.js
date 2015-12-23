function check(form)/*function to check userid & password*/
{
 /*the following code checkes whether the entered userid and password are matching*/
 //if(form.userid.value == "myuserid" && form.pswrd.value == "password")
 var x = 'a';
 if(x == 'a')
  {
    window.location.assign('myapp/user/welcome.html');
//    window.open('target.html') /*opens the target page while Id & password matches*/
  }
 else
 {
   alert("Invalid Username and/or Password");/*displays error message*/
  }
}
function signup()
{
	 window.location.assign('myapp/signup/signup.html');
}

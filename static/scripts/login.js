const toggleButton = document.querySelector('#toggle-password');
const passwordField = document.querySelector('#password');
const closedEye = document.querySelector('#closed-eye');
const openedEye = document.querySelector('#opened-eye');
const button = document.getElementById('button');
const fieldError = document.getElementById('field-error');
const incorrectError = document.getElementById('incorrect-error');
const emailElem = document.getElementById("email");
const passwordElem = document.getElementById("password");
let isPasswordHidden = true;
let error1 = false;
let error2 = false;
toggleButton.addEventListener('click', function () {
  if (isPasswordHidden) {
    passwordField.type = 'text';
    closedEye.classList.add('hide')
    openedEye.classList.remove('hide')
  } else {
    passwordField.type = 'password';
    closedEye.classList.remove('hide')
    openedEye.classList.add('hide')
  }
    isPasswordHidden = !isPasswordHidden;
});


function checkFields() {
  if(emailElem.value !== '') {
    emailElem.classList.add("input-not-null")
    element.setAttribute('style', 'border-bottom: 1px solid #2E2E2E;') //вынести в класс и добавлять класс
  } 
  var passwordElem = document.getElementById("password-input");
  if(passwordElem.value !== '') {
    element.setAttribute('style', 'border-bottom: 1px solid #2E2E2E;') // тоже самоое
  } 
}

emailElem.addEventListener('click', function () {
  if(error1)  {
    fieldError.classList.add("none");
    document.getElementById('errorlog').classList.add("none");
    document.getElementById('errorlog1').classList.add("none");
    error1 = false;
  } 
  if(error2)  {
    incorrectError.classList.add("none");
    error2 = false;
  }  
});
passwordElem.addEventListener('click', function () {
  if(error1)  {
    fieldError.classList.add("none");
    error1 = false;
  } 
  if(error2)  {
    incorrectError.classList.add("none");
    error2 = false;
  }    
});
button.addEventListener('click', function () {
    if((emailElem.value == '') || (passwordElem.value == ''))  {
      fieldError.classList.remove("none");
      error1 = true;
      document.getElementById('errorlog').classList.remove("none");
      document.getElementById('errorlog1').classList.remove("none");
    }

    // if((passwordElem.value.element('@')) && (!error1)) {
    //   incorrectError.classList.remove("none");
    //   error2 = true;
    // }
    if(!  (passw.match(pattern)) && (!error1))   {
      incorrectError.classList.remove("none");
      error2 = true;
    }     
});
 
function validateForm(event) {
  if((emailElem.value == '') || (passwordElem.value == ''))  {
    fieldError.classList.remove("none");
    error1 = true;
    document.getElementById('errorlog').classList.remove("none");
    document.getElementById('errorlog1').classList.remove("none");
  }

  // if((passwordElem.value.element('@')) && (!error1)) {
  //   incorrectError.classList.remove("none");
  //   error2 = true;
  // }
  if(!  (passw.match(pattern)) && (!error1))   {
    incorrectError.classList.remove("none");
    error2 = true;
  }    
} 
  // const passwordShowButton = loginForm.querySelector('.password-control');
  // passwordShowButton.addEventListener('click', showHidePassword);



var passw = passwordElem.value;
var pattern = /^[^\s]+@[^\s]+\.[a-z]{2,3}$/;
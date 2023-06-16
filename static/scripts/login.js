window.addEventListener("DOMContentLoaded", (event) => {

    const toggleButton = document.querySelector('#toggle-password');
    const passwordField = document.querySelector('#password');
    const closedEye = document.querySelector('#closed-eye');
    const openedEye = document.querySelector('#opened-eye');
    const button = document.getElementById('button');
    const fieldError = document.getElementById('field-error');
    const incorrectError = document.getElementById('incorrect-error');
    const emailElem = document.getElementById("email");
    const passwordElem = document.getElementById("password");
    const form = document.getElementById("form");
    const pattern = /^[^\s]+@[^\s]+\.[a-z]{2,3}$/;
    let isPasswordHidden = true;
    let error1 = false;
    let error2 = false;
    const errorlog = document.getElementById("errorlog");
    const errorlogs = document.getElementById("errorlog1");


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

    function validateForm() {
        errorlog.classList.add("p");
        errorlogs.classList.add("p");
        errorlog.classList.remove("label__bottom");
        errorlogs.classList.remove("label__bottom");
        if ((emailElem.value == '') || (passwordElem.value == '')) {
            fieldError.classList.add("play");
            fieldError.classList.remove("unplay");
            emailElem.classList.add('red-bord');
            passwordElem.classList.add('red-bord');
            error1 = true;
            errorlog.classList.add("status");
            errorlogs.classList.add("status");
        } else if (!(emailElem.value.match(pattern)) && (!error1)) {
            emailElem.classList.add('red-bord');
            incorrectError.classList.add("play");
            incorrectError.classList.remove("unplay");
            errorlogs.innerHTML = 'Incorrect email format. Correct format is ****@**.***'
            errorlogs.classList.add("status");
            error2 = true;
        } else {
            login();     
        }
        errorlog.classList.add("p");
        errorlogs.classList.add("p");
        errorlog.classList.remove("label__bottom");
        errorlogs.classList.remove("label__bottom");
    };


    function emailChg() {
        closeError();
        let input_taker = emailElem.value;
        let stile = emailElem.classList;
        stile.add('add-style');
        if (input_taker == '') {
            stile.remove('add-style');
        }
    }

    emailElem.addEventListener('keyup', emailChg);

    function passwChg() {
        closeError();
        let input_taker = passwordElem.value;
        let stile = passwordElem.classList;
        stile.add('add-style');
        if (input_taker == '') {
            stile.remove('add-style');
        }
    }

    function closeError() {
        emailElem.classList.remove('red-bord');
        passwordElem.classList.remove('red-bord');
        errorlog.classList.remove("status");
        errorlogs.classList.remove("status");
        if (error1) {
            fieldError.classList.remove("play");
            fieldError.classList.add("unplay");
            error1 = false;
        }
        if (error2) {
            incorrectError.classList.remove("play");
            incorrectError.classList.add("unplay");
            error2 = false;
            errorlogs.innerHTML = 'Email is required.'
        }
    };

    passwordElem.addEventListener('keyup', passwChg);

    button.addEventListener('click', validateForm)
    form.addEventListener('submit', validateForm);

    async function login() {  // проверяет введенные почту и пароль с теми, что хранятся в БД и если вы есть в базе, то отправляет вас на страницу админки и позволяет создать пост
        const response = await fetch('api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: emailElem.value,
                password: passwordElem.value
            })
        })
        if (response.ok) {
            location.assign("http://localhost:3000/admin");
        } 
    }
});
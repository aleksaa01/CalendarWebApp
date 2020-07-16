function Cards(){
    this.front_card = document.getElementById('front-card');
    this.reg_card = document.getElementById('reg-card');
    this.log_card = document.getElementById('log-card');
    this.back_btn = document.getElementById('back-button');

    this.showFrontCard = function() {
        this.back_btn.classList.add('hidden');
        this.front_card.classList.remove('hidden');
        this.reg_card.classList.add('hidden');
        this.log_card.classList.add('hidden');
    }
    this.showRegisterCard = function() {
        this.back_btn.classList.remove('hidden');
        this.front_card.classList.add('hidden');
        this.reg_card.classList.remove('hidden');
        this.log_card.classList.add('hidden');
    }
    this.showLoginCard = function() {
        this.back_btn.classList.remove('hidden');
        this.front_card.classList.add('hidden');
        this.reg_card.classList.add('hidden');
        this.log_card.classList.remove('hidden');
    }
};

let cards = new Cards();

elem = document.getElementById('btn-register');
if(elem) elem.addEventListener('click', function() {
    cards.showRegisterCard();
});
elem = document.getElementById('btn-login');
if(elem) elem.addEventListener('click', function() {
    cards.showLoginCard();
});
elem = document.getElementById('back-button').addEventListener('click', function() {
    cards.showFrontCard();
});

elem = document.getElementById('register-submit');
if (elem) elem.addEventListener('click', function(event) {
    event.preventDefault();
    let form = document.forms['register-form'];
    let usr = form['reg-username'];
    let psw = form['reg-password'];

    url = form.action;
    data = {
    'username': usr.value,
    'password': psw.value
    };

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == xhr.DONE) {
            if (xhr.status == 200 || xhr.status == 201) {
                console.log("Registered successfully");
                usr.value = '';
                psw.value = '';
                cards.showFrontCard();
            }
            else {
                let errors = JSON.parse(xhr.responseText);

                if (errors.username) {
                    usr.setCustomValidity(errors.username[0]);
                    usr.reportValidity();
                    usr.addEventListener('input', function resetValidity() {
                        usr.setCustomValidity('');
                        usr.removeEventListener('input', resetValidity);
                    });
                    return;
                }
                else if (errors.password) {
                    psw.setCustomValidity(errors.password[0]);
                    psw.reportValidity();
                    psw.addEventListener('input', function resetValidity() {
                        psw.setCustomValidity('');
                        psw.removeEventListener('input', resetValidity);
                    });
                    return;
                }
                else {
                    console.log("Failed to register");
                }
            }
        }
    };

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
});

elem = document.getElementById('login-submit');
if (elem) elem.addEventListener('click', function(event) {
    event.preventDefault();

    let form = document.forms['login-form'];
    let csrf = form['csrfmiddlewaretoken'];
    let usr = form['log-username'];
    let psw = form['log-password'];

    if (!usr.reportValidity()) return;
    if (!psw.reportValidity()) return;

    url = form.action;
    data = {
    'username': usr.value,
    'password': psw.value
    };

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == xhr.DONE) {
            if (xhr.status == 200 || xhr.status == 201) {
                console.log("Logged in successfully");
                document.write(xhr.responseText);
            }
            else {
                let errors = JSON.parse(xhr.responseText);

                if (errors.username) {
                    usr.setCustomValidity(errors.username[0]);
                    usr.reportValidity();
                    usr.addEventListener('input', function resetValidity() {
                        usr.setCustomValidity('');
                        usr.removeEventListener('input', resetValidity);
                    });
                    return;
                }
                else if (errors.password) {
                    psw.setCustomValidity(errors.password[0]);
                    psw.reportValidity();
                    psw.addEventListener('input', function resetValidity() {
                        psw.setCustomValidity('');
                        psw.removeEventListener('input', resetValidity);
                    });
                    return;
                }
                else if (errors.detail) {
                    psw.setCustomValidity(errors.detail);
                    psw.reportValidity();
                    psw.addEventListener('input', function restValidity() {
                        psw.setCustomValidity('');
                        psw.removeEventListener('input', restValidity);
                    });
                    return;
                }
                else {
                    console.log("Failed to login");
                }
            }
        }
    };

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrf.value);
    xhr.send(JSON.stringify(data));
});

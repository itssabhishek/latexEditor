		//---------------------------------------------- Not Connected 2 ---------------------------------------------

        const handleRegisterSubmit = event => {
            event.preventDefault();
            const registerForm = document.forms.register_form;

            // DOM elements
            const successElm = registerForm.querySelector(".success-message-div");
            const errorElm = registerForm.querySelector(".error-message-div");
            const sendButton = registerForm.querySelector(".btn-register");
            const loadingElm = registerForm.querySelector(".loading_section");
            // Form Elements
            const usernameElm = registerForm.username_register;
            const emailElm = registerForm.email_register;
            const firstNameElm = registerForm.first_name;
            const lastNameElm = registerForm.last_name;
            const imageElm = registerForm.image_register;
            const passwordElm = registerForm.password_register;
            const repeatedPasswordElm = registerForm.repeat_password_register;
			const captchaElm = registerForm.querySelector("#register_captcha");
            // initialize the form ------------------------------------------------------------------
            initializeForm(registerForm, successElm, errorElm, sendButton, loadingElm);
            //--------------------------------------------------------------------------------------
			const formBody = registerForm.querySelector('.form_inputs');
            // Map errors Form elements
            const mapErrorsElm = error_name => {
                switch(error_name){
                    case 'username':
                        return usernameElm;
                    break;
                    case 'email':
                        return emailElm;
                    break;
                    case 'password':
                        return passwordElm;
                    break;
                    case 'captcha':
                        return captchaElm;
                    break;
                }
                return null;
            }

            // Pre-validate -------------------------------------------------
            let goRegister = true;
            if(passwordElm.value !== repeatedPasswordElm.value){
                passwordElm.classList.add('error-contour');
                repeatedPasswordElm.classList.add('error-contour');
                const closest = repeatedPasswordElm.parentNode.nextElementSibling;
                closest.style.display = 'block';
                closest.innerHTML = '* Password didn\'t match';
                repeatedPasswordElm.focus();
                goRegister = false;
            }
            //-----------------------------------------------------------------------------
            // send
            if(goRegister){
				
                sendButton.disabled = true;
                loadingElm.style.display = 'inline-block';

                const params = new URLSearchParams();
                params.append('username', usernameElm.value);
                params.append('password', passwordElm.value);
                params.append('email', emailElm.value);
                params.append('image', imageElm.value);
                params.append('first_name', firstNameElm.value);
                params.append('last_name', lastNameElm.value);
				params.append('g-recaptcha-response', grecaptcha.getResponse(registerCaptcha));
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params
                }
                newFetch(URLS.REGISTER, options)
                .then(response => {
                    formBody.style.display = 'none';
                    errorElm.style.display = 'none';
                    successElm.children[1].innerHTML = response.data.message;
                    successElm.style.display = 'block';
                })
                .catch(error => {
                    if(error.data){
                        errorElm.children[1].innerHTML = error.data.message;
                        if(error.data.errors){
                            let focused = false;
                            const errorsArray = error.data.errors;
                            errorsArray.forEach(err => {
                                for(error_name in err){
                                    let errorTxT = '';
                                    err[error_name].forEach(elm => {
                                        errorTxT += '* ' + elm + '<br />';
                                    });
                                    const node = mapErrorsElm(error_name);
                                    node.classList.add('error-contour');
                                    const closest = node.parentNode.nextElementSibling;
                                    closest.style.display = 'block';
                                    closest.innerHTML = errorTxT;
                                    if(!focused){
                                        focused = true;
                                        node.focus();
                                    }
                                }
                            });
                        }
                    }else{
                        errorElm.children[1].innerHTML = error.response;
                    }
                    errorElm.style.display = 'block';
                })
                .finally(() => {
					grecaptcha.reset(registerCaptcha);
                    sendButton.disabled = false;
                    loadingElm.style.display = 'none';
                });
            }
        }
        const handleLoginSubmit = event => {
            event.preventDefault();
            const loginForm = document.forms.login_form;

            // DOM elements
            const successElm = loginForm.querySelector(".success-message-div");
            const errorElm = loginForm.querySelector(".error-message-div");
            const sendButton = loginForm.querySelector(".btn-register");
            const loadingElm = loginForm.querySelector(".loading_section");
			const formBody = loginForm.querySelector('.form_inputs');
            // Form Elements
            const emailElm = loginForm.email_login;
            const passwordElm = loginForm.password_login;

            // initialize the form ------------------------------------------------------------------
            initializeForm(loginForm, successElm, errorElm, sendButton, loadingElm);
            //--------------------------------------------------------------------------------------
            // send
            sendButton.disabled = true;
            loadingElm.style.display = 'inline-block';
            const params = new URLSearchParams();
            params.append('email', emailElm.value);
            params.append('password', passwordElm.value);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            }
            newFetch(URLS.LOGIN, options)
                .then(response => {
                    formBody.style.display = 'none';
                    errorElm.style.display = 'none';
					successElm.children[1].innerHTML = 'Login success, redirecting....';
					successElm.style.display = 'block';
					localStorage.setItem(TOKEN_NAME, response.data.jwt);
					location.href = latexURL;
                })
                .catch(error => {
                    if(error.data){
                        errorElm.children[1].innerHTML = error.data.message;
                    }else{
                        errorElm.children[1].innerHTML = error.response;
                    }
                    errorElm.style.display = 'block';
                })
                .finally(() => {
                    sendButton.disabled = false;
                    loadingElm.style.display = 'none';
                });
        }
        const loginFacebook = event => {
			event.preventDefault();
			location.href = URLS.FACEBOOK_LOGIN;
		}
		const registerFacebook = event => {
			event.preventDefault();
			location.href = URLS.FACEBOOK_REGISTER;
		}
		const loginGoogle = event => {
			event.preventDefault();
			location.href = URLS.GOOGLE_LOGIN;
		}
		const registerGoogle = event => {
			event.preventDefault();
			location.href = URLS.GOOGLE_REGISTER;
		}

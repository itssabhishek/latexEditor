//---------------------------------------------- All ----------------------------------------------
const loginRegisterSection = document.querySelector('#login_register_section');
const sideBarComponent = document.querySelector("#sidebar_component");
const overlay = document.querySelector("#overlay");
const overlay2 = document.querySelector("#overlay2");
const overlay2Message = overlay2.children.item(0).children.item(1);
const dataTargets = document.querySelectorAll("[data-target]");
const closeModals = document.querySelectorAll("[data-dismiss]");
const latexEditor = document.querySelector("#latex_editor");
const latexResult = document.getElementById("resultat");
const globalError = document.querySelector("#global_error");
const downloadImage = document.querySelector("#download_image");
const downloadPDF = document.querySelector("#download_pdf");
const fontSizeInput = document.querySelector("#font_size");
const imageOutput = document.querySelector("#image_output");

const dropDowns = document.querySelectorAll('[data-target-dropdown]');
const dropMenus = document.querySelectorAll('.drop-menu-href');

const substrText = (text, limit = 40) => {
    if (text.length <= limit) {
        return text;
    }
    const newText = text.substr(0, limit - 1) + '...';
    return newText;
}
const dataURL2Blob = dataurl => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
const setSideBarComponentHeight = () => {
    sideBarComponent.style.minHeight = document.documentElement.clientHeight + "px";
    //sideBarComponent.style.left = 600 + "px";
    //console.log(document.body.clientWidth);
}
setSideBarComponentHeight();
window.addEventListener('resize', event => {
    const theHeight = document.documentElement.clientHeight;
    //console.log(theHeight);
    setSideBarComponentHeight();
    if(isConnected){
        addScroll2LaTeXes();
    }
});

const stripslashes = str => {
    let text = str.replace(/\\'/g, '\'');
    text = text.replace(/\\"/g, '"');
    text = text.replace(/\\\\/g, '\\');
    text = text.replace(/\\0/g, '\0');
    return text;
}
const removeActive = () => {
    dropDowns.forEach(dropDown => dropDown.classList.remove('profile-right-active'));
    dropMenus.forEach(dropmenu => {
        dropmenu.style.display = 'none';
    });
}
dropDowns.forEach(dropDown => {
    dropDown.addEventListener('click', event => {
        removeActive();
        dropDown.classList.add('profile-right-active');
        const dropMenuTarget = document.querySelector('#' + dropDown.dataset.targetDropdown);
        dropMenuTarget.style.display = 'block';
    });
});
const switchModalDisplay = (node, value) => {
    node.children.item(0).style.display = value;
}
const dataTagetListener = (node, callback = () => { }) => {
    node.addEventListener("click", () => {
        callback();
        const modalId = node.dataset.target;
        clearForm(modalId);
        const modal = document.querySelector('#' + modalId);
        switchModalDisplay(modal, 'block');
        modal.classList.add("active");
        overlay.classList.add("active");
    });
}
const closeModalsListener = node => {
    node.addEventListener("click", () => {
        const modal = node.closest(".modal");
        modal.classList.remove("active");
        modal.addEventListener('transitionend', event => {
            switchModalDisplay(modal, 'none');
        }, { once: true });
        overlay.classList.remove("active");
    });
}
const subscribeModalsLinsteners = () => {
    dataTargets.forEach(dataTarget => dataTagetListener(dataTarget));
    closeModals.forEach(closeModal => closeModalsListener(closeModal));
}
subscribeModalsLinsteners();
window.addEventListener('click', event => {
    removeActive();
    if (event.target == overlay) {
        const modals = document.querySelectorAll(".modal");
        //let numberClosed = 0;
        modals.forEach(modal => {
            const canBeClosed = modal.getAttribute("can-be-closed") || 'false';
            if (canBeClosed === 'true' && modal.classList.contains("active")) {
                modal.classList.remove("active");
                modal.addEventListener('transitionend', event => {
                    switchModalDisplay(modal, 'none');
                }, { once: true });
                overlay.classList.remove("active");
                //numberClosed++;
            }
        });
    }
}, true);
if (sessionObj.sessionActive) {
    if (sessionObj.sessionIsError) {
        if (sessionObj.mainError) { // main error
            globalError.children[1].innerHTML = sessionObj.sessionError;
            globalError.style.display = 'block';
        } else { // modal error
            const top_url = new URL(location.href);
            const modal_url_name = top_url.searchParams.get("modal");

            // Open Modal + display error on it
            const top_modal = document.querySelector('#' + modal_url_name);
            const top_error_div = top_modal.querySelector('.error-message-div');
            const top_error_span = top_error_div.children[1];
            top_error_span.innerHTML = sessionObj.sessionError;
            top_error_div.style.display = 'block';
            top_modal.classList.add("active");
            switchModalDisplay(top_modal, 'block');
            document.querySelector("#overlay").classList.add("active");
        }
    } else {
        if (sessionObj.sessionType == 'oauth_token') {
            // add Token
            if (localStorage.getItem(TOKEN_NAME) == null) {
                localStorage.setItem(TOKEN_NAME, sessionObj.sessionMessage);
            }
        }
        else if (sessionObj.sessionType == 'remove_token') {
            if (localStorage.getItem(TOKEN_NAME) != null) {
                localStorage.removeItem(TOKEN_NAME);
            }
        }
    }
}

if (!isConnected) { // not Connected!
    loginRegisterSection.style.display = 'block';
} else {
    const profileImage = profileSection.children[0].children[0].children[0];
    profileImage.src = user.image;
    profileImage.addEventListener('error', event => {
        event.target.src = latexURL + 'public/images/user.png';
    });
    profileSection.children[0].children[0].children[1].innerHTML = user.username;
    profileSection.style.display = 'block';
    latexCodesSection.style.display = 'block';
    paginationSection.style.display = 'block';
    addLatexCode.style.display = 'inline';


    // Fill edit profile modal
    const editProfileForm = document.forms.edit_profile_form;
    fillEditProfileForm(editProfileForm);

    // Password Edit
    const editPasswordForm = document.forms.edit_password_form;
    fillEditPasswordForm(editPasswordForm);

    // Load LaTeX codes
    loadLaTeXCodes();


}
const getUserFromToken = () => {
    const theToken = localStorage.getItem(TOKEN_NAME);
    if (isConnected && theToken != null) {
        const userSplit = theToken.split('.');
        const user = JSON.parse(atob(userSplit[1] || '{}'));
        return user;
    }
    return {};
}
const swithLaTeXMode = num => {
    if (isConnected) {
        latexMode = num;   
    }else{
        alert('You must be registred to use this feature');
    }
}
const changeFontSize = input => {
    const num = parseInt(input.value, 10);
    if (!isNaN(num)) {
        localStorage.setItem(fontSize, num);
        fontSizeValue = num;
        displayLatex(latexEditor.value, latexResult);
        latexResult.setAttribute('style', 'font-size: ' + num + 'px');
    }
}
downloadImage.addEventListener('click', event => {
    createImage(latexEditor.value, latexImage => {
        const downloadLink = document.createElement('a');
        downloadLink.href = latexImage.src;
        downloadLink.target = '_self';
        downloadLink.download = 'lagrida_latex_editor';
        downloadLink.click();
    });
});
downloadPDF.addEventListener('click', event => {
    if (isConnected) {
        getLaTeXPDF();
        //console.log('Clicking download PDF');
    } else {
        alert('You must be registred to use this feature');
    }
});
const addMatrix = myform => {
    const matrices = myform;

    let matrix, theRows = "", lines = "", theMatrix = "";
    const rows = myform.rows.value;
    const columns = myform.columns.value;
    let matrix_top, matrix_body, matrix_bottom;

    for (i = 0; i < matrices.length; i++) {
        if (matrices[i].checked) {
            matrix = matrices[i].value;
        }
    }
    switch (matrix) {
        case "1":
            matrix_top = "\\begin{matrix}\n";
            matrix_bottom = "\\end{matrix}";
            break;
        case "2":
            matrix_top = "\\begin{pmatrix}\n";
            matrix_bottom = "\\end{pmatrix}";
            break;
        case "3":
            matrix_top = "\\begin{bmatrix}\n";
            matrix_bottom = "\\end{bmatrix}";
            break;
        case "4":
            matrix_top = "\\begin{vmatrix}\n";
            matrix_bottom = "\\end{vmatrix}";
            break;
        case "5":
            matrix_top = "\\begin{Vmatrix}\n";
            matrix_bottom = "\\end{Vmatrix}";
            break;
        case "6":
            matrix_top = "\\begin{Bmatrix}\n";
            matrix_bottom = "\\end{Bmatrix}";
            break;
    }
    for (i = 0; i < columns - 1; i++) {
        theRows = theRows + " & ";
    }
    for (i = 0; i < rows - 1; i++) {
        lines = lines + theRows + " \\\\\n";
    }
    lines = lines + theRows + "\n";
    theMatrix = lines + matrix_bottom;
    applyLatex2(matrix_top, theMatrix);
}
const addExample = num => {
    var txt;
    switch (num) {
        case 1:
            txt = "\\begin{array}{rcl}\nA & = & B \\\\\n & = & C \\\\\n & = & D\n\\end{array}";
            applyLatex2(txt, '');
            break;
        case 2:
            txt = "\\sum_{\\substack{\n0 < i < m \\\\\n0 < j < n\\\\\n}} P(i,j)";
            applyLatex2(txt, '');
            break;
        case 3:
            txt = "\\prod_{\\substack{\np \\leq x \\\\\n\\text{p prime}\n}} \\left( 1 - \\dfrac{1}{p} \\right)";
            applyLatex2(txt, '');
            break;
        case 4:
            txt = "f:\\begin{array}{rcl}\nI & \\longrightarrow & J  \\\\\nx & \\longrightarrow & f(x)\n\\end{array}";
            applyLatex2(txt, '');
            break;
        case 5:
            txt = "|x| = \\left\\{ \\begin{array}{cl}\nx & : \\ x \\geq 0 \\\\\n-x & : \\ x < 0\n\\end{array} \\right.";
            applyLatex2(txt, '');
            break;
        case 6:
            txt = "\\begin{matrix}\nR^n & \\overset{A}{\\longrightarrow} & R^m \\\\\n\\cong &  & \\cong \\\\\nR^n & \\overset{B}{\\longrightarrow} & R^m \\\\\n\\end{matrix}";
            applyLatex2(txt, '');
            break;
        case 7:
            txt = "\\underbrace{\n\\overbrace{a+b}^6 \\cdot \\overbrace{c+d}^7\n}_\\text{example of text} = 42";
            applyLatex2(txt, '');
            break;
    }
}
const changeImageOutput = checkbox => {
    if (checkbox.checked) {
        localStorage.setItem(imageOutputName, '1');
        latexResult.classList.add('resultat-maring-top');
    } else {
        localStorage.setItem(imageOutputName, '0');
        latexResult.classList.remove('resultat-maring-top');
    }
    displayLatex(latexEditor.value, latexResult);
}
latexEditor.addEventListener("input", () => {
    displayLatex(latexEditor.value, latexResult);
});
let imageOutputValue = localStorage.getItem(imageOutputName);
if (imageOutputValue == null) {
    localStorage.setItem(imageOutputName, '0');
}
imageOutputValue = localStorage.getItem(imageOutputName);
if (imageOutputValue == '1') {
    imageOutput.checked = true;
    latexResult.classList.add('resultat-maring-top');
}
imageOutput.disabled = false;

let fontSizeItem = localStorage.getItem(fontSize);
if (fontSizeItem == null) {
    localStorage.setItem(fontSize, '20');
}
fontSizeItem = localStorage.getItem(fontSize);
fontSizeInput.value = fontSizeItem;
fontSizeInput.disabled = false;
latexResult.setAttribute('style', 'font-size: ' + fontSizeItem + 'px');

const initializeForm = (formNode, successElm, errorElm, sendButton, loadingElm) => {
    successElm.style.display = 'none';
    errorElm.style.display = 'none';
    sendButton.disabled = false;
    loadingElm.style.display = 'none';

    errorContours = formNode.querySelectorAll('.error-contour');
    errorContours.forEach(elm => {
        elm.classList.remove('error-contour');
    });

    const errorsDiv = formNode.querySelectorAll('.error-message');
    const formBody = formNode.querySelector('.form_inputs');
    errorsDiv.forEach(errorDiv => {
        errorDiv.innerHTML = '';
        errorDiv.style.display = 'none';
    });
    formBody.style.display = 'block';
}
const clearForm = modalId => {
    if (modalId == 'register') {
        const registerForm = document.forms.register_form;
        const successElm = registerForm.querySelector(".success-message-div");
        const errorElm = registerForm.querySelector(".error-message-div");
        const sendButton = registerForm.querySelector(".btn-register");
        const loadingElm = registerForm.querySelector(".loading_section");
        initializeForm(registerForm, successElm, errorElm, sendButton, loadingElm);
        inputTexts = registerForm.querySelectorAll("input[type='text']");
        inputTexts.forEach(inputText => {
            inputText.value = "";
        });
        inputPasswords = registerForm.querySelectorAll("input[type='password']");
        inputPasswords.forEach(inputPassword => {
            inputPassword.value = "";
        });

        if (!registerCaptchaIsRendred) {
            registerCaptchaIsRendred = true;
            registerCaptcha = grecaptcha.render('register_captcha', {
                'sitekey': '6LekWIUdAAAAAM5k-P3Y_b9w1-6EU-SLvJZe-Sae'
            });
        } else {
            grecaptcha.reset(registerCaptcha);
        }
    }
    else if (modalId == 'edit_profile') {
        const editProfileForm = document.forms.edit_profile_form;
        const successElm = editProfileForm.querySelector(".success-message-div");
        const errorElm = editProfileForm.querySelector(".error-message-div");
        const sendButton = editProfileForm.querySelector(".btn-register");
        const loadingElm = editProfileForm.querySelector(".loading_section");
        initializeForm(editProfileForm, successElm, errorElm, sendButton, loadingElm);
        fillEditProfileForm(editProfileForm);
    }
    else if (modalId == 'login') {
        const loginForm = document.forms.login_form;
        const successElm = loginForm.querySelector(".success-message-div");
        const errorElm = loginForm.querySelector(".error-message-div");
        const sendButton = loginForm.querySelector(".btn-register");
        const loadingElm = loginForm.querySelector(".loading_section");
        initializeForm(loginForm, successElm, errorElm, sendButton, loadingElm);

        inputTexts = loginForm.querySelectorAll("input[type='text']");
        inputTexts.forEach(inputText => {
            inputText.value = "";
        });
        inputPasswords = loginForm.querySelectorAll("input[type='password']");
        inputPasswords.forEach(inputPassword => {
            inputPassword.value = "";
        });
    }
    else if (modalId == 'forgot_password') {
        const forgotPasswordForm = document.forms.forgot_password_form;
        const successElm = forgotPasswordForm.querySelector(".success-message-div");
        const errorElm = forgotPasswordForm.querySelector(".error-message-div");
        const sendButton = forgotPasswordForm.querySelector(".btn-register");
        const loadingElm = forgotPasswordForm.querySelector(".loading_section");
        initializeForm(forgotPasswordForm, successElm, errorElm, sendButton, loadingElm);

        inputTexts = forgotPasswordForm.querySelectorAll("input[type='text']");
        inputTexts.forEach(inputText => {
            inputText.value = "";
        });

        if (!forgotPasswordCaptchaIsRendred) {
            forgotPasswordCaptchaIsRendred = true;
            forgotPasswordCaptcha = grecaptcha.render('forgot_password_captcha', {
                'sitekey': '6LekWIUdAAAAAM5k-P3Y_b9w1-6EU-SLvJZe-Sae'
            });
        } else {
            grecaptcha.reset(forgotPasswordCaptcha);
        }
    }
    else if (modalId == 'edit_password') {
        const editPasswordForm = document.forms.edit_password_form;
        const successElm = editPasswordForm.querySelector(".success-message-div");
        const errorElm = editPasswordForm.querySelector(".error-message-div");
        const sendButton = editPasswordForm.querySelector(".btn-register");
        const loadingElm = editPasswordForm.querySelector(".loading_section");
        initializeForm(editPasswordForm, successElm, errorElm, sendButton, loadingElm);

        inputTexts = editPasswordForm.querySelectorAll("input[type='text']");
        inputTexts.forEach(inputText => {
            inputText.value = "";
        });
        inputPasswords = editPasswordForm.querySelectorAll("input[type='password']");
        inputPasswords.forEach(inputPassword => {
            inputPassword.value = "";
        });
        fillEditPasswordForm(editPasswordForm);
    }
    else if (modalId == 'add_latex_code_modal' && isConnected) {
        const addLaTeXForm = document.forms.add_latex_code_form;
        const successElm = addLaTeXForm.querySelector(".success-message-div");
        const errorElm = addLaTeXForm.querySelector(".error-message-div");
        const sendButton = addLaTeXForm.querySelector(".btn-register");
        const loadingElm = addLaTeXForm.querySelector(".loading_section");
        initializeForm(addLaTeXForm, successElm, errorElm, sendButton, loadingElm);
        if (latexMode == -1) {
            ModifyAddLaTeXModal("Add LaTeX", "", "", "");
            inputTexts = addLaTeXForm.querySelectorAll("input[type='text']");
            inputTexts.forEach(inputText => {
                inputText.value = "";
            });
            textAreas = addLaTeXForm.querySelectorAll("textarea");
            textAreas.forEach(textArea => {
                textArea.value = "";
            });
        }
    }
}

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const loginForm = document.getElementById("login__form");
const logEmail = document.getElementById("log-in__email");
const logPass = document.getElementById("log-in__password");
const errors = document.querySelectorAll(".form-control");
const popupReg = document.getElementById("popup");
const popupLog = document.getElementById("popup--log");
const logBtn = document.querySelector(".log__btn");
const logout = document.querySelectorAll(".logout");

//add firebase register
let user = new Base();
let valid = new Check();

//restart login popup
function loginPop() {
  document.getElementById("log-in__email").parentElement.style.display =
    "block";
  document.getElementById("login-title").textContent = "Sign in";
  document.getElementById("password-hide").style.display = "block";
  document.querySelector(".popup__reset").innerHTML =
    'Forgot your password? Reset <span class="reset">here</span>';
  document.querySelector(".popup__create").innerHTML =
    'Don\'t have an account? <span class="create" >Sign up</span>';
  logBtn.textContent = "Submit";
  document.querySelector(".popup__log-bot").style.display = "block";

  document.querySelector(".firebase__error.log").textContent = "";
  logEmail.value = "";
  logPass.value = "";
}
function reLoginPop() {
  document.getElementById("log-in__email").parentElement.style.display = "none";
  document.getElementById("login-title").textContent =
    "Confirm change with Your password.";
  document.getElementById("password-hide").style.display = "block";
  document.querySelector(".popup__reset").innerHTML =
    'Forgot your password? Reset <span class="reset">here</span>';
  logBtn.textContent = "Confirm";
  document.querySelector(".firebase__error.log").textContent = "";
  logPass.value = "";
}

//open popups
document.getElementById("sign__up").addEventListener("click", e => {
  popupReg.style.visibility = "visible";
  popupReg.style.opacity = "1";
});

document.getElementById("sign__in").addEventListener("click", e => {
  loginPop();
  popupLog.style.visibility = "visible";
  popupLog.style.opacity = "1";
});

document.getElementById("mob__log").addEventListener("click", e => {
  loginPop();
  popupLog.style.visibility = "visible";
  popupLog.style.opacity = "1";
});

document.querySelector(".popup__create").addEventListener("click", e => {
  if (e.target.classList.contains("create")) {
    popupReg.style.visibility = "visible";
    popupReg.style.opacity = "1";
    popupLog.style.visibility = "hidden";
    popupLog.style.opacity = "0";
  }
});

//change sign in popup DOM to restart password
popupLog.addEventListener("click", e => {
  if (e.target.classList.contains("reset")) {
    document.getElementById("log-in__email").parentElement.style.display =
      "block";
    document.querySelector(".popup__log-bot").style.display = "none";

    document.getElementById("login-title").textContent = "Reset your password";
    document.getElementById("password-hide").style.display = "none";
    document.querySelector(".popup__reset").innerHTML =
      'Go back and <span class="login__back">Log in</span>';
    logBtn.textContent = "Reset";
  } else if (e.target.classList.contains("login__back")) {
    //go back to login
    loginPop();
  }
});
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.classList.add("form-control", "error");
  formControl.classList.remove("success");
  const small = formControl.querySelector("small");
  small.innerText = message;
}
// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.add("form-control", "success");
  formControl.classList.remove("error");
}
function getFieldName(input) {
  return (
    input.dataset.name.charAt(0).toUpperCase() + input.dataset.name.slice(1)
  );
}

// Event listeners
form.addEventListener("submit", e => {
  e.preventDefault();

  valid.checkRequired([username, email, password, password2]);
  valid.checkLength(username, 3, 15);
  valid.checkLength(password, 6, 25);
  valid.checkEmail(email);
  valid.checkPasswordsMatch(password, password2);

  const arr = []; //set array to push errors from validation if array length is 0 means there's no error
  errors.forEach(e => {
    if (e.classList.contains("error")) {
      arr.push(1);
    }
  });

  if (arr.length === 0) {
    user.setData(email.value, password.value);
    user.firebaseCreateUser();
    // user.callback();
  }
});
//close popup if clicked somewhere else or on x sign
popupReg.addEventListener("click", e => {
  if (
    e.target.classList.contains("popup") ||
    e.target.classList.contains("popup__icon")
  ) {
    popupReg.style.visibility = "hidden";
    popupReg.style.opacity = "0";
    //reset errors in form
  }
});
popupLog.addEventListener("click", e => {
  if (
    e.target.classList.contains("popup") ||
    e.target.classList.contains("popup__icon")
  ) {
    popupLog.style.visibility = "hidden";
    popupLog.style.opacity = "0";
  }
});

//logout
logout.forEach(log => {
  log.addEventListener("click", user.userLogOut);
});

//show  user popup
document.getElementById("user").addEventListener("click", e => {
  document.querySelector(".user__popup").classList.toggle("show");
});

//sign in popup html or restart password
loginForm.addEventListener("submit", e => {
  if (logBtn.textContent === "Submit") {
    user.firebaseLogInUser(logEmail.value, logPass.value);
  } else if (logBtn.textContent === "Reset") {
    user.userRestartPass(logEmail.value);
  }

  e.preventDefault();
});

//log in with google and facebook
const google = document.querySelectorAll(".google");

google.forEach(go => {
  go.addEventListener("click", e => {
    user.logInWithGoogle();
  });
});

const facebook = document.querySelectorAll(".facebook");

facebook.forEach(fb => {
  fb.addEventListener("click", e => {
    user.logInWithFacebook();
  });
});

function hidePopAfterLog(user) {
  document.getElementById("login__form").style.display = "none";
  document.getElementById(
    "login-title"
  ).textContent = `Welcome ${user.displayName}`;
  setTimeout(e => {
    document.getElementById("popup--log").style.display = "none";
  }, 2000);
  errorPlaceLog.textContent = "";
  document.querySelector(".popup__reset").innerHTML = "";
  document.querySelector(".popup__log-bot").style.display = "none";

  checkIfUser();
}

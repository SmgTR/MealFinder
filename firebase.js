var firebaseConfig = {
  apiKey: "AIzaSyALseGCyqn2KTBHxpPnitk7CeXegp_O2_4",
  authDomain: "mealfinder-4446e.firebaseapp.com",
  databaseURL: "https://mealfinder-4446e.firebaseio.com",
  projectId: "mealfinder-4446e",
  storageBucket: "mealfinder-4446e.appspot.com",
  messagingSenderId: "1027534683758",
  appId: "1:1027534683758:web:284d36019c087db451f07f",
  measurementId: "G-DRMDR66WC4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const base = new FireCloud();
const errorPlace = document.querySelector(".firebase__error");
const errorPlaceLog = document.querySelector(".firebase__error.log");

function resetToNoUser() {
  document.querySelector(".top__nav-sign").style.display = "flex";
  document.querySelector(".top__nav-user").style.display = "none";
  document.querySelector(".top__nav-user--img").style.display = "none";
}

function updateUserUi(login, image) {
  let img = document.querySelector(".top__nav-user--img");
  if (image == undefined || image == null) {
    img.src = "img/user.svg";
  } else {
    img.src = image;
  }
  img.style.display = "block";
  console.log(image);
  document.getElementById("user__login").textContent = login;
  document.querySelector(".top__nav-sign").style.display = "none";
  document.querySelector(".top__nav-user").style.display = "flex";
}

function checkIfUser() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      updateUserUi(user.displayName, user.photoURL);
    } else {
      resetToNoUser();
    }
  });
}

checkIfUser();

class Base {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  setData(email, password) {
    this.email = email;
    this.password = password;
  }

  firebaseCreateUser() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(res => {
        //update profile with username and default avatar
        res.user.updateProfile({
          displayName: document.getElementById("username").value,
          photoURL: "img/user.svg"
        });
        let user = firebase.auth().currentUser;
        user
          .sendEmailVerification()
          .then(function(user) {})
          .catch(error => {
            errorPlace.textContent = error.message;
          });

        base.checkIfNoRepeat(user.uid);

        //update UI
        const title = document.getElementById("popup-title");
        document.getElementById("form").style.display = "none";
        title.textContent =
          "Your account has been created successfully. Check your email and verify your account";

        setTimeout(e => {
          document.getElementById("popup").style.display = "none";
          updateUserUi(res.user.displayName);
        }, 4000);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == "auth/weak-password") {
          errorPlace.textContent = "The password is too weak.";
        } else {
          //set up if email is already taken
          errorPlace.textContent = errorMessage;
          const email = document.getElementById("email").parentElement;
          email.className = "form-control error";
          const small = email.querySelector("small");
          small.innerText = errorMessage;

          setTimeout(e => {
            email.className = "form-control";
            document.getElementById("email").value = "";
          }, 3000);
          setTimeout(e => {
            document.getElementById("popup").style.display = "none";
            updateUserUi(res.user.displayName);
          }, 4000);
        }
        console.log(error);
      });
  }

  firebaseLogInUser(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        document.getElementById("login__form").style.display = "none";
        document.getElementById(
          "login-title"
        ).textContent = `Welcome ${res.user.displayName}`;
        setTimeout(e => {
          document.getElementById("popup--log").style.display = "none";
        }, 2000);
        errorPlaceLog.textContent = "";
        document.querySelector(".popup__reset").innerHTML = "";
        document.querySelector(".popup__log-bot").style.display = "none";
      })
      .catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        console.log(error.code);
        let errorMessage = error.message;

        errorPlaceLog.textContent = "Username or password is invalid";
      });
  }

  logInWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;

        base.checkIfNoRepeat(user.uid);

        hidePopAfterLog(user);
      })
      .catch(function(error) {
        // Handle Errors here.

        errorPlaceLog.innerText = "Something went wrong. Try again later.";

        // ...
      });
  }

  logInWithFacebook() {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_photos");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        //
        result.user.updateProfile({
          photoURL: `${result.additionalUserInfo.profile.picture.data.url}`
        });
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        base.checkIfNoRepeat(user.uid);

        // ...
        hidePopAfterLog(user);

        //refresh page to reload photoURL
        setTimeout(t => {
          window.location.reload();
        }, 1000);
      })
      .catch(function(error) {
        errorPlaceLog.innerText = "Something went wrong. Try again later.";
      });
  }

  userRestartPass(email) {
    let auth = firebase.auth();

    auth
      .sendPasswordResetEmail(email)
      .then(function() {
        document.getElementById("login__form").style.display = "none";
        document.getElementById(
          "login-title"
        ).textContent = `Password reset link has been sent to ${email}. Check your email`;
        setTimeout(e => {
          document.getElementById("popup--log").style.display = "none";
        }, 5000);
        errorPlaceLog.textContent = "";
        location.reload();
        document.querySelector(".popup__reset").innerHTML = "";
      })
      .catch(function(error) {
        console.log(error);
        let errorCode = error.code;
        if (errorCode == "auth/invalid-email") {
          errorPlaceLog.textContent = "Invalid email";
        } else if (errorCode == "auth/user-not-found") {
          errorPlaceLog.textContent = "User with this email does not exist";
        }
      });
  }

  settingsUpdateUi() {
    let user = firebase.auth().currentUser;

    mealsEl.style.display = "none";
    singleMeal.style.display = "block";
    resHeading.innerHTML = `<i class="fas fa-arrow-left back"></i>`;
    singleMeal.innerHTML = `
      <div class="meal">
        <h2 class="meal__title">Settings</h2>
        <form id="form__change">
        <div class="form-control settings__profile">

          <img class="settings__profile--img" src="${user.photoURL}">
          <div class="settings__profile__url">
          <input type="text" class="settings__profile--img-address" placeholder="Paste url link to Your image">
          <button type="submit" class="upload--btn">Upload</button>
          <p class="image__info"></p>
          <small></small>
          </div>
          <h2 class="settings__profile--title">Username: </h2>
          <div class="settings__profile--name">
            <input type="text" class="settings__value" id="changeName" value="${user.displayName}" data-name="username" disabled>
            <div class="icons">
            <i class="fas fa-pencil-alt edit-icon"></i>
            </div>
            <small>Error message</small>
          </div>

        </div>
        <h2 class="settings__profile--title">Email: </h2>
        <div class="form-control settings__profile">
          <div class="settings__profile--email">

            <input type="email" class="settings__value" id="changeEmail" value="${user.email}" data-name="email" disabled>
            <div class="icons">
              <i class="fas fa-pencil-alt edit-icon"></i>
            </div>
            <small>Error message</small>
          </div>
        </div>

        <div class="form-control settings__profile">
          <label for="password">New password</label>
          <input type="password" id="passwordChange" data-name="password" placeholder="Enter password" />
          <small>Error message</small>
        </div>
        <div class="form-control settings__profile">
          <label for="password2">Confirm Password</label>
          <input type="password" id="password2Change" data-name="password2" placeholder="Enter password again" />
          <small>Error message</small>
        </div>
        <button type="submit" class="settings__profile--btn">Change password</button>
        </form>
      </div>
      `;
    //add password email and icon change and whole confirmation of changes

    //avatar change
    document.querySelector(".upload--btn").addEventListener("click", e => {
      let img = document.querySelector(".settings__profile--img-address");
      valid.checkUrl(img);
      if (!img.parentElement.classList.contains("error")) {
        user
          .updateProfile({ photoURL: `${img.value}` })
          .then(e => {
            const message = document.querySelector(".image__info");
            message.textContent = "Uploaded. Refresh page to see changes.";
            message.style.color = "#06d85f";
          })
          .catch(err => {
            message.textContent = err;
            message.style.color = "#e31b23";
          });
      }

      e.preventDefault();
    });

    singleMeal.addEventListener("click", e => {
      if (e.target.classList.contains("edit-icon")) {
        e.target.parentElement.previousSibling.previousSibling.disabled = false;

        e.target.parentElement.innerHTML =
          '<i class="fas fa-check confirm-icon"></i><i class="fas fa-times cancel-icon"></i>';
      }
    });
    //change input value if accept
    singleMeal.addEventListener("click", e => {
      if (e.target.classList.contains("confirm-icon")) {
        //UI
        let save = '<p class="saving">Saving changes</p>';
        const element = e.target.parentElement;
        const username = e.target.parentElement.previousSibling.previousSibling;
        const email = e.target.parentElement.previousSibling.previousSibling;

        // check if correct
        if (username.id === "changeName") {
          valid.checkLength(username, 3, 15);

          //show Error if username is same as before
          if (username.value === user.displayName) {
            showError(username, "Username can't be same as before");
          }
          //check if no error from validation and its not same
          if (
            !username.parentElement.classList.contains("error") &&
            username.value !== user.displayName
          ) {
            e.target.parentElement.previousSibling.previousSibling.disabled = true;
            element.innerHTML = save;
            setTimeout(fun => {
              save = '<i class="fas fa-pencil-alt edit-icon"></i>';
              element.innerHTML = save;
              updateUserUi(user.displayName, user.photoURL);
            }, 2000);
            //update Username
            user.updateProfile({ displayName: `${username.value}` });
            console.log(username);
          }

          // user
          //   .updateProfile({
          //     displayName: "dsdsds",
          //     photoURL: "https://example.com/jane-q-user/profile.jpg"
          //   })
        } else if (email.id === "changeEmail") {
          //show Error if email is same as before
          valid.checkEmail(email);

          if (email.value === user.email) {
            showError(username, "Email can't be same as before");
          }
          //valid email address
          console.log(email.parentElement);

          if (
            !email.parentElement.classList.contains("error") &&
            email.value !== user.email
          ) {
            e.target.parentElement.previousSibling.previousSibling.disabled = true;
            element.innerHTML = save;
            setTimeout(fun => {
              save = '<i class="fas fa-pencil-alt edit-icon"></i>';
              element.innerHTML = save;
            }, 2000);

            reLoginPop();
            popupLog.style.visibility = "visible";
            popupLog.style.opacity = "1";
            // user needs to resigne with data

            //update email

            logBtn.addEventListener("click", e => {
              console.log("dada");
              let pass = document.getElementById("log-in__password").value;

              let credentials = firebase.auth.EmailAuthProvider.credential(
                `${user.email}`,
                `${pass}`
              );

              user
                .reauthenticateWithCredential(credentials)
                .then(e => {
                  user
                    .updateEmail(`${email.value}`)
                    .then(function() {
                      document.getElementById("login__form").style.display =
                        "none";
                      document.getElementById("login-title").textContent =
                        "Changes saved successfully";
                      setTimeout(e => {
                        document.getElementById("popup--log").style.display =
                          "none";
                      }, 3000);
                    })
                    .catch(err => {
                      document.querySelector(
                        ".firebase__error.log"
                      ).textContent = err;
                    });
                })
                .catch(err => {
                  document.querySelector(
                    ".firebase__error.log"
                  ).textContent = err;
                });
            });

            e.preventDefault();

            // Prompt the user to re-provide their sign-in credentials
          }
        }
      }
    });

    //password changing
    document
      .querySelector(".settings__profile--btn")
      .addEventListener("click", e => {
        const pass = document.getElementById("passwordChange");
        const pass2 = document.getElementById("password2Change");
        valid.checkPasswordsMatch(pass, pass2);
        valid.checkLength(pass, 6, 25);
        console.log(pass.value, pass2.value);
        console.log(pass2.parentElement.classList);
        if (
          !pass.parentElement.classList.contains("error") &&
          !pass2.parentElement.classList.contains("error")
        ) {
          popupLog.style.visibility = "visible";
          popupLog.style.opacity = "1";
          reLoginPop();
          logBtn.addEventListener("click", e => {
            let passAuth = document.getElementById("log-in__password").value;

            let credentials = firebase.auth.EmailAuthProvider.credential(
              `${user.email}`,
              `${passAuth}`
            );

            user
              .reauthenticateWithCredential(credentials)
              .then(e => {
                user
                  .updatePassword(`${pass.value}`)
                  .then(function() {
                    document.getElementById("login__form").style.display =
                      "none";
                    document.getElementById("login-title").textContent =
                      "Changes saved successfully";
                    setTimeout(e => {
                      document.getElementById("popup--log").style.display =
                        "none";
                      setTimeout(e => {
                        window.location.reload();
                      }, 1000);
                    }, 3000);
                  })
                  .catch(err => {
                    document.querySelector(
                      ".firebase__error.log"
                    ).textContent = err;
                  });
              })
              .catch(err => {
                document.querySelector(
                  ".firebase__error.log"
                ).textContent = err;
              });
          });
        }

        e.preventDefault();
      });

    //decline every changes
    singleMeal.addEventListener("click", e => {
      if (e.target.classList.contains("cancel-icon")) {
        e.target.parentElement.previousSibling.previousSibling.disabled = true;
        //back changes to values saved in profile
        console.log();

        if (
          e.target.parentElement.previousSibling.previousSibling.id ===
          "changeName"
        ) {
          e.target.parentElement.previousSibling.previousSibling.value =
            user.displayName;
        } else {
          e.target.parentElement.previousSibling.previousSibling.value =
            user.email;
        }

        e.target.parentElement.innerHTML =
          '<i class="fas fa-pencil-alt edit-icon"></i>';
      }
    });

    console.log(user);

    // user
    //   .updateProfile({
    //     displayName: "dsdsds",
    //     photoURL: "https://example.com/jane-q-user/profile.jpg"
    //   })
    //   .then(function() {
    //     // Update successful.
    //   })
    //   .catch(function(error) {
    //     // An error happened.
    //   });
  }

  userLogOut() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

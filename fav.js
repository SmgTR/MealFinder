class FireCloud {
  constructor() {}

  addUserData(userId) {
    const db = firebase.firestore();
    const docRef = db.doc(`users/${userId}`);

    docRef
      .set({
        fav: []
      })
      .then(e => console.log("saved"))
      .catch(err => console.log(err));
  }

  addFavToBase(fav) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.firestore();
        console.log(user.uid);
        const docRef = db.doc(`users/${user.uid}`);
        docRef.update({
          fav: firebase.firestore.FieldValue.arrayUnion(`${fav}`)
        });

        favourite.children[1].classList = "fav fav-red fas fa-heart";
        favourite.children[0].textContent = "Remove from favourites";
      } else {
        // add here "You must be log in"
      }
    });
  }

  removeFav(id) {
    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function(user) {
      const docRef = db.doc(`users/${user.uid}`);

      docRef
        .get()
        .then(function(doc) {
          console.log(doc.data().fav.includes(id));
          if (doc.data().fav.includes(id)) {
            docRef.update({
              fav: firebase.firestore.FieldValue.arrayRemove(id)
            });
            favourite.children[1].classList = "fav far fa-heart";
            favourite.children[0].textContent = "Add to favourites";
          } else {
            // doc.data() will be undefined in this case
            console.log("dad");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    });
  }

  sumOfElements() {
    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function(user) {
      const docRef = db.doc(`users/${user.uid}`);

      docRef.onSnapshot(function(doc) {
        if (user && doc.data().fav.length > 0) {
          const total = doc
            .data()
            .fav.reduce((total, amount, index) => index + 1);
          //hard code to 1, bcs  reduce returning id number if only 1 el
          if (doc.data().fav.length === 1) {
            document.querySelector(".sum__of-fav").textContent = 1;
          } else {
            document.querySelector(".sum__of-fav").textContent = total;
          } //change to visible and set width of nav el
          document.querySelector(".sum__of-fav").style.display = "flex";
          document.getElementById("favourites").style.minWidth = "19rem";
        } else {
          document.querySelector(".sum__of-fav").style.display = "none";
          document.getElementById("favourites").style.minWidth = "16rem";
        }
      });
    });
  }

  listItems() {
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        db.collection("users")
          .get()
          .then(function(querySnapshot) {
            resHeading.innerHTML = `Your favourites recipes:`;
            fav.style.display = "none";

            singleMeal.style.display = "none"; //mealsEl comment below
            mealsEl.style.display = "grid"; //Make Ui available to go back from single meal to favourites list on click
            mealsEl.innerHTML = "";

            querySnapshot.forEach(function(doc) {
              //show heart if contain
              if (user.uid === doc.id) {
                doc.data().fav.forEach(item => {
                  console.log(item);
                  fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item}`
                  )
                    .then(res => res.json())
                    .then(data => {
                      //push thata to array then sort it
                      console.log(data);
                      getMealsUI(data);

                      //add class to back arrow, couse need to fetch again items, if removed app.js 232 listener at app.js 182
                    })
                    .catch(err => err);
                });
              }
            });
          });
      } else {
        // No user is signed in.
      }
    });
  }

  removeFav(id) {
    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function(user) {
      const docRef = db.doc(`users/${user.uid}`);

      docRef
        .get()
        .then(function(doc) {
          console.log(doc.data().fav.includes(id));
          if (doc.data().fav.includes(id)) {
            docRef.update({
              fav: firebase.firestore.FieldValue.arrayRemove(id)
            });
            favourite.children[1].classList = "fav far fa-heart";
            favourite.children[0].textContent = "Add to favourites";
          } else {
            // doc.data() will be undefined in this case
            console.log("dad");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    });
  }

  getId(id) {
    const db = firebase.firestore();
    let user = firebase.auth().currentUser;
    db.collection("users")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (user.uid === doc.id) {
            if (doc.data().fav.includes(id)) {
              favourite.children[1].classList = "fav fav-red fas fa-heart";
              favourite.children[0].textContent = "Remove from favourites";
            } else {
              favourite.children[1].classList = "fav far fa-heart";
              favourite.children[0].textContent = "Add to favourites";
            }
          }
        });
      });
  }

  checkIfNoRepeat(userId) {
    const db = firebase.firestore();

    let docRef = db.collection("users").doc(`${userId}`);

    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          base.addUserData(userId);
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
}

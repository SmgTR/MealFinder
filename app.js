//Home page random browse recipes.

const mealsEl = document.getElementById("meals");
const titleEl = document.querySelectorAll(".title");
const resHeading = document.getElementById("result-heading");
const singleMeal = document.getElementById("single-meal");
const fav = document.querySelector(".favourite");
const heart = document.querySelector(".fav");
const favourite = document.querySelector(".favourite");
const searchField = document.getElementById("search");
const searchForm = document.getElementById("submit");
const goFav = document.querySelectorAll(".go__fav");
const goSettings = document.querySelectorAll(".go__settings");
const favArr = [];
let searched = "";
//get random meal and put it in home
const userSet = new Base();
const goHome = document.querySelectorAll(".go__home");

const fetchRandomMeals = function() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
      getMealsUI(data);
    });
};

function randomRecipes() {
  for (let i = 0; i < 12; i++) {
    fetchRandomMeals();
    if (i < 11) {
      mealsEl.style.visibility = "hidden";
      singleMeal.style.visibility = "hidden";
      loadAnim.style.visibility = "visible";

      showSvg();
    } else {
      setTimeout(e => {
        mealsEl.style.visibility = "visible";
        singleMeal.style.visibility = "visible";
      }, 3000);
    }
  }
}

function getMealsUI(data, cat) {
  //box colors
  let category = "";

  if (cat !== undefined) {
    category = cat;
  } else {
    category = data.meals[0].strCategory.toLowerCase();
  }

  console.log(category);

  let color = "";
  if (
    category === "chicken" ||
    category === "lamb" ||
    category === "pork" ||
    category === "seafood" ||
    category === "beef"
  ) {
    color = "red";
  } else if (category === "vegetarian" || category === "vegans") {
    //if green also add icon in ternary operator below line 34
    color = "green";
  } else {
    color = "";
  }

  mealsEl.innerHTML += `
  <a href="#${data.meals[0].idMeal}" class="link__to-meal">
        <div class="recipes__container" data-mealid="${data.meals[0].idMeal}">
        <img src="${data.meals[0].strMealThumb}" class="img"/>
        <div class="title ${color} ${
    color === "red" || color === "green"
      ? `box-shadow--${color}`
      : "box-shadow--orange"
  }" data-mealid="${data.meals[0].idMeal}">

        ${color === "green" ? '<i class="fas fa-leaf leaf"></i>' : ""}

          <h2>${data.meals[0].strMeal}</h2>

        </div>

        </div>
  </a>
    `;
}

//show clicked recipe and hide 'discover recipe', add back arrow,toggle elements display(none).

function showHomeRecipe(id, backFetch) {
  //hide mealsEl
  mealsEl.style.display = "none";

  //show singlemeal el
  singleMeal.style.display = "block";
  //show favourite
  fav.style.display = "flex";

  //change heading to back arrow

  resHeading.innerHTML = `<a href="#" class="back__link"><i class="fas fa-arrow-left back ${backFetch}"></i></a>`;
  //fetch data with id
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      const meal = data.meals[0];

      console.log(meal.strYoutube);

      const youtube = meal.strYoutube;
      let ytLink = youtube.replace(/watch\?v=/g, "embed/");

      //replace watch to embed to let video display (X-frame-options), (sameorigin) youtube.replace(/watch/g, "embed");

      //add ingredients and measures
      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          ingredients.push(
            `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
          );
        } else {
          break;
        }
      }
      //add meal to DOM
      singleMeal.innerHTML = `
          <div class="meal" id="${data.meals[0].idMeal}">
            <h2 class="meal__title">${meal.strMeal}</h2>
            <div class="share__icons" id="share__icons">


              <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

              <div class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout="box_count" data-size="small"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://mealfinder-4446e.web.app" class="fb-xfbml-parse-ignore">Udostępnij</a></div>





            </div>

              ${
                ytLink
                  ? `<iframe class="yt__mov" width="560" height="315" src="${ytLink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                  : `<img src="${meal.strMealThumb}" class="meal__img"/>`
              }
            <ul class="meal__categories">
              <li>${meal.strArea ? `${meal.strArea},` : ""}</li>
              <li>${meal.strCategory ? `${meal.strCategory}` : ""}</li>
            </ul>

            <p class="meal__instruction">${meal.strInstructions}</p>
            <h2 class="meal__ingredients">Ingredients</h2>
              <ul class="meal__ing-list">
                ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
              </ul>

              <div id="single__mealid" style="display:none">${meal.idMeal}</div>



            ${
              meal.strSource
                ? `<p class="source">Source: <a href="${meal.strSource}" target="_blank">${meal.strSource}</a></p>`
                : ""
            }


          </div>


        `;

      //load share buttons dynamicly
      FB.XFBML.parse(document.getElementById("share__icons"));
      twttr.widgets.load();

      //add to favorites if user loged in
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          base.getId(meal.idMeal);
        }
      });
    })
    .catch(err => console.log(err));
}

function uiToHome() {
  //reset UI

  mealsEl.style.display = "grid";
  resHeading.innerText = "Discover recipes:";
  fav.style.display = "none";
  singleMeal.style.display = "none";
  //reset heart style to make animation smoother
  favourite.children[1].classList = "fav far fa-heart";
  favourite.children[0].textContent = "Add to favourites";
}

function searchRecipeByName(name) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals === null) {
        resHeading.innerHTML = `There are no search results. Try again!`;

        singleMeal.innerHTML = "";
        fav.style.display = "none";
      } else {
        resHeading.innerHTML = `Search result for '${name}'`;
        console.log(data);

        fav.style.display = "none";

        singleMeal.style.display = "none"; //mealsEl comment below
        mealsEl.style.display = "grid";
        mealsEl.innerHTML = "";

        data.meals.map(item => {
          //needs to format data to match fav recived from favourites and random meals to ouse getMealsUI
          let arr = { meals: [item] };
          getMealsUI(arr);
        });
      }
    })
    .catch(err => console.log(err));
}

//    *---- Favourites  Listeners-----*

//
goFav.forEach(fav => {
  firebase.auth().onAuthStateChanged(function(user) {
    fav.addEventListener("click", e => {
      if (user) {
        base.listItems();
      } else if (
        !user &&
        document.querySelector(".top__nav-user").style.display === "none"
      ) {
        document.querySelector(".nav__user-text").textContent =
          "Log in to see favourites";
        setTimeout(e => {
          document.querySelector(".nav__user-text").textContent = "Favourites";
        }, 4000);
      }
    });
  });
});

window.addEventListener("DOMContentLoaded", e => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      base.sumOfElements();
      mobileIfUser();
      //styling for mobile nav
    } else {
      document.querySelector(".sum__of-fav").style.display = "none";
    }
  });
});

function mobileIfUser() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.querySelector(".mobile__nav--sett").style.display = "block";
      document.querySelector(".mobile__nav--logout").style.display = "block";
      document.querySelector(".mobile__nav--login").style.display = "none";
    } else {
      document.querySelector(".mobile__nav--sett").style.display = "none";
      document.querySelector(".mobile__nav--logout").style.display = "none";
      document.querySelector(".mobile__nav--login").style.display = "block";
    }
  });
}

mobileIfUser();
//    *---- Events Listeners -----*

searchForm.addEventListener("submit", e => {
  searchRecipeByName(searchField.value);
  searched = searchField.value;
  setTimeout(e => {
    searchField.value = "";
  }, 2000);
  e.preventDefault();
});

window.addEventListener("DOMContentLoaded", e => {
  let href = window.location.href.toString();
  console.log(window.location.href);

  //check if href contains # and has a number(from id),otherwise link from arrow to #  wont work, and will fetch nothing.
  let fetchLinkMeal = href.split("#");

  function hasNumber(str) {
    return /\d/.test(str);
  }

  if (href.includes("#") && hasNumber(fetchLinkMeal[1])) {
    showHomeRecipe(fetchLinkMeal[1], "");
  } else {
    console.log("no");
  }

  randomRecipes();
});
goSettings.forEach(sett => {
  sett.addEventListener("click", user.settingsUpdateUi);
});

//back to meals from single meal
resHeading.addEventListener("click", e => {
  if (e.target.classList.contains("back")) {
    uiToHome();
  }
  if (e.target.classList.contains("fetch__fav")) {
    uiToHome();
    base.listItems();
  }
  if (e.target.classList.contains("back__search")) {
    resHeading.innerHTML = `Search result for '${searched}'`;
  }
});

favourite.addEventListener("click", e => {
  const id = document.getElementById("single__mealid").textContent;
  if (e.target.classList.contains("fav")) {
    //second  parneeded if repeated id
    //id number
    let user = firebase.auth().currentUser;

    if (user) {
      base.addFavToBase(id);
    } else {
      const favLog = document.querySelector(".favourite");
      const favChild = document.querySelector(".fav__child");

      const favLogEl = document.createElement("p");
      favLogEl.classList.add = "fav__no-log";
      favLogEl.textContent = "You must be log in to add to favourite";
      favLog.insertBefore(favLogEl, favChild);
      favChild.style.display = "none";
      favLogEl.style.display = "block";
      heart.style.display = "none";

      setTimeout(e => {
        favLogEl.style.display = "none";
        heart.style.display = "block";

        favChild.style.display = "block";
      }, 2000);
    }

    if (favourite.children[1].classList.contains("fav-red")) {
      base.removeFav(id);
    }
  }
});
//add eventto home buttons (desktop and mobile nav)
goHome.forEach(home => {
  home.addEventListener("click", i => {
    //let user get new meals, after 4000, to dodge UI problems
    setTimeout(t => {
      document.querySelector("#home").classList.toggle("clicked");
    }, 2000);
    if (!document.querySelector("#home").classList.contains("clicked")) {
      mealsEl.innerHTML = "";
      randomRecipes();
      uiToHome();
      if (window.location.href !== "https://mealfinder-4446e.web.app/") {
        window.location.href = "https://mealfinder-4446e.web.app/";
      }

      i.preventDefault();
    }
    document.querySelector("#home").classList.add("clicked");
  });
});
document.querySelector(".top__nav-logo").addEventListener("click", e => {
  const backArr = document.querySelector(".fetch__fav");
  if (
    resHeading.textContent === "Your favourites recipes:" ||
    backArr ||
    resHeading.textContent.includes("Search")
  ) {
    mealsEl.innerHTML = "";
    //if we are in fav tab, we need also to fetch again new home recipes, if we are in home we just need to back UI
    uiToHome();
    randomRecipes();
  }
  uiToHome();
});

//show categoires on mobile
document.querySelector(".mobile__cat").addEventListener("click", e => {
  document.querySelector(".mobile__cat__popup").style.display = "block";
});
document.querySelector(".close").addEventListener("click", e => {
  document.querySelector(".mobile__cat__popup").style.display = "none";
});
//add click to show recipe from Discover recipes and fetch single meal data
document.getElementById("meals").addEventListener("click", e => {
  const containerEl = e.target.parentElement.classList.contains(
    "recipes__container"
  );
  const textEl = e.target.parentElement.parentElement.classList.contains(
    "recipes__container"
  );
  if (
    //need to add or to get parent element from text container.
    containerEl ||
    textEl
  ) {
    const targetId = e.target.parentElement.getAttribute("data-mealid");
    //add this bcs need to fetch again items in fav if remove item, but still want to stop home from fetching over and over after going back, to save previous dishes
    let word = resHeading.textContent;
    if (word === "Your favourites recipes:") {
      showHomeRecipe(targetId, "fetch__fav");
    } else if (word.includes("Search")) {
      showHomeRecipe(targetId, "back__search");
    } else {
      showHomeRecipe(targetId, "");
    }
  }
});

//making list of categories
(function() {
  const nav = document.getElementById("nav__categories");

  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
      const categories = data.categories;

      categories.forEach(e => {
        nav.innerHTML += `
          <li class="category">${e.strCategory}</li>
        `;
        document.querySelector(".mobile__cat__popup__list").innerHTML += `
        <li class="category">${e.strCategory}</li>

        `;
      });
    });

  nav.addEventListener("click", e => {
    mealsEl.innerHTML = "";
    if (e.target.classList.contains("category")) {
      fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.textContent}`
      )
        .then(res => res.json())
        .then(data => {
          resHeading.textContent = e.target.textContent;
          // for (let i = 0; i < data.meals.length; i++) {
          //   getMealsUI(data, e.target.textContent.toLowerCase());
          // }
          data.meals.map(item => {
            //needs to format data to match fav recived from favourites and random meals to ouse getMealsUI
            let arr = { meals: [item] };
            getMealsUI(arr, e.target.textContent.toLowerCase(e));
          });
        });
    }
  });

  document
    .querySelector(".mobile__cat__popup__list")
    .addEventListener("click", e => {
      mealsEl.innerHTML = "";
      if (e.target.classList.contains("category")) {
        document.querySelector(".mobile__cat__popup").style.display = "none";
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.textContent}`
        )
          .then(res => res.json())
          .then(data => {
            resHeading.textContent = e.target.textContent;
            // for (let i = 0; i < data.meals.length; i++) {
            //   getMealsUI(data, e.target.textContent.toLowerCase());
            // }
            data.meals.map(item => {
              //needs to format data to match fav recived from favourites and random meals to ouse getMealsUI
              let arr = { meals: [item] };
              getMealsUI(arr, e.target.textContent.toLowerCase(e));
            });
          });
      }
    });
})();

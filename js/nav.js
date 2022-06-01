"use strict";
const $submitStory = $('#submit-story');
const $submitForm = $('#submit-form');
const $favStories = $('#favorite-story');
/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $favoritedStories.addClass('hidden');
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// show the story submit form
function showSubmitForm() {
console.debug('showSubmitForm');
$submitForm.toggleClass('hidden')
}

$submitStory.on('click', showSubmitForm)

// hide page when favorites is clicked, show favorites array
$favStories.on('click', function(){
  console.debug('clicked favorites')
  hidePageComponents();
  putFavsonPage();
})

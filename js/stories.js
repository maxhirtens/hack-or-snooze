"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="heart"><i class="fa-regular fa-heart"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
// changes heart icon when favorited
// $allStoriesList.on('click', '.heart', function(evt){
//   console.log(evt.target);
//   let target = evt.target;
//   target.className = target.className === "fa-regular fa-heart" ? 'fa-solid fa-heart' : "fa-regular fa-heart";
// })

// above wasn't working with currentUser methods, needed help from http://hack-or-snooze.surge.sh/#

function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fa-solid")) {
    // currently a favorite: remove from user's fav list and change star
    currentUser.removeFavoriteStory(story);
    $tgt.closest("i").toggleClass("fa-solid fa-regular");
  } else {
    // currently not a favorite: do the opposite
    currentUser.addFavoriteStory(story);
    $tgt.closest("i").toggleClass("fa-solid fa-regular");
  }
}

$allStoriesList.on("click", ".heart", toggleStoryFavorite);


// removes story when trash icon is clicked

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// get info from story submit form and append to page
async function createStoryfromSubmit(e)  {
  e.preventDefault();
  console.debug("createStoryfromSubmit");
  const authorInput = $('#author').val();
  const titleInput = $('#title').val();
  const urlInput = $('#url').val();
  let newStory = await storyList.addStory(currentUser,
    {title: titleInput, author: authorInput, url: urlInput});
  let updateStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend(updateStory);
  // idea from: https://stackoverflow.com/questions/3786694/how-to-reset-clear-form-through-javascript
  $submitForm[0].reset();
  $submitForm.addClass('hidden')
}

$submitForm.on('submit', createStoryfromSubmit)

// display favorite stories
function putFavsonPage() {
  console.debug('generating fav stories...');
  $favoritedStories.removeClass('hidden');
  $favoritedStories.empty();
  if(currentUser.favorites.length === 0){
    $favoritedStories.append('wow, such empty');
  } else {
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoritedStories.append($story);
  }
  }
}

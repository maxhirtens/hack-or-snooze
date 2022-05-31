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
        <span class="trash"><i class="fa fa-trash"></i></span>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
// changes heart icon when favorited
$allStoriesList.on('click', '.heart', function(evt){
  console.log(evt.target);
  let target = evt.target;
  target.className = target.className === "fa-regular fa-heart" ? 'fa-solid fa-heart' : "fa-regular fa-heart";
})
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

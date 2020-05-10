"use strict";

/* API URLs */
const API_Company = "https://chriscorchado.com/drupal8/rest/api/companies?_format=json";
const API_Skills = "https://chriscorchado.com/drupal8/rest/api/skills?_format=json";

/**
 * Get data from Drupal 8 datastore
 * @param dataURL {string} url to fetch data from
 * @return {array} array of objects
 */
function getData(dataURL) {
  /* For Local Testing */

  if (window.location.href.indexOf("localhost") !== -1) {
    if (dataURL.indexOf("companies") !== -1) {
      dataURL = "companies.json";
    }
    if (dataURL.indexOf("skills") !== -1) {
      dataURL = "skills.json";
    }
  }

  const result = $.ajax({
    url: dataURL,
    type: "GET",
  });

  return result;
}

/* Hide page UI on load in order to fade in */
$(".container, #navigation").hide();

/**
 * Load companies page (Homepage)
 */
async function getIndexPage(search) {
  let data = await getData(API_Company);
  $(".container").html(renderPage(data, "company", search));
}

/**
 * Load skills page
 */
async function getSkillsPage(search) {
  let data = await getData(API_Skills);
  $(".container").html(renderPage(data, "skills", search));
}

/**
 * Load pages
 */
$("#navigation").load("includes/nav.html");

if (location.pathname.includes("skills.html")) {
  getSkillsPage();
} else {
  getIndexPage();
}

/**
 * Search data
 */
async function searchData() {
  let inputSearchBox = document.getElementById("searchSite");

  $(".container, .skills-container").hide();
  $("#noRecords").remove();

  if (location.pathname.includes("skills.html")) {
    getSkillsPage(inputSearchBox.value);
  } else {
    getIndexPage(inputSearchBox.value);
  }
}

/**
 * Clear Search
 */
function searchClear() {
  let inputSearchBox = document.getElementById("searchSite");
  if (inputSearchBox.value !== "") {
    location.reload();
  }
}

/**
 * Only allow searching with a-Z and spaces
 * @param event {event} key event
 * @return {string} allowed characters
 */
function searchFilter(event) {
  var charCode = event.keyCode || event.which;

  return (
    (charCode >= 65 && charCode <= 90) ||
    (charCode >= 92 && charCode <= 122) ||
    charCode == 32 ||
    charCode == 16
  );
}

/**
 * Extract date string
 * @param dateString {string} contains the date
 * format: <time datetime="2019-10-07T12:00:00Z" class="datetime">Monday, October 7, 2019 - 12:00</time>
 * @param monthYear {boolean} if true return month and year only
 * @return {string} full date or month and year only
 */
function extractDate(dateString, monthYear) {
  let returnDate = dateString.split(">")[1];
  returnDate = returnDate.split("-")[0];

  if (monthYear) {
    let shortDate = returnDate.split(",");
    returnDate = shortDate[1].split(" ")[1] + shortDate[2];
  }
  return returnDate;
}

/**
 * Create absolute link
 * @param linkToFix {string} relative url
 * @return {string} absolute url
 */
function getFullUrl(linkToFix) {
  /* For Local Testing */

  if (window.location.href.indexOf("localhost") !== -1) {
    return linkToFix.replace("/drupal8/", "http://localhost/chriscorchado/drupal8/");
  }

  return linkToFix.replace("/drupal8/", "https://chriscorchado.com/drupal8/");
}

/**
 * Highlight search term with a string
 * @param itemToHighlight {string} string to search
 * @param searchedFor {string} string to search for
 * @return {string} search result with highlight
 */
function itemWithSearchHighlight(itemToHighlight, searchedFor) {
  let itemWithHighlight = "";

  if (searchedFor) {
    let searchTerm = new RegExp(searchedFor, "gi");
    let searchString = itemToHighlight.replace("&amp;", "&").replace("&#039;", "'");
    let matchFound = searchString.match(searchTerm);

    for (let i = 0; i < matchFound.length; i++) {
      itemWithHighlight = searchString.replace(
        matchFound[i],
        `<span class="highlightSearchText">${matchFound[i]}</span>`
      );
    }
  }
  return itemWithHighlight;
}

/* regex to get string within quotes */
let getStringInQuotes = /"(.*?)"/;

/**
 * Create HTML for page *
 * @param data {array} page items
 * @param page {string} page name
 * @param searchedFor {string} search string
 * @return {string} HTML with data
 */

function renderPage(data, page, searchedFor) {
  let item = "";
  let searchedTitle = "";
  let titleToShow = "";
  let itemCount = 0;

  data.forEach((element) => {
    /* if searching then skip any items that don't match otherwise highlight search results*/
    if (
      searchedFor &&
      element.title.toUpperCase().indexOf(searchedFor.toUpperCase()) == -1
    ) {
      return;
    } else {
      searchedTitle = itemWithSearchHighlight(element.title, searchedFor);
    }

    itemCount++;

    /* Set regular title or title with search term in highlight */

    if (searchedFor) {
      titleToShow = searchedTitle;
    } else {
      titleToShow = element.title;
    }

    switch (page) {
      case "company":
        item += `<div class="company-container col shadow">`;
        item += `<div class="company-name">${titleToShow}</div>`;

        if (element.logo) {
          let logo = getStringInQuotes.exec(element.logo)[0];

          item += `<div class="logo-container">`;
          item += `<img src=${getFullUrl(logo)} class="company-logo" alt="${
            element.title
          } Logo" />`;
          item += `</div>`;
        }

        item += `<div class="company-job-title">${element.job_title}</div>`;

        item += `<div class="body-container">`;
        item += element.body;
        item += `</div>`;

        if (element.screenshot) {
          let screenshot = getStringInQuotes.exec(element.screenshot)[0];

          item += `<div class="screenshot-container">`;
          item += `<img src=${getFullUrl(screenshot)} class="company-screenshot"  alt="${
            element.title
          } Screenshot" />`;
          item += `</div>`;
        }

        item += `<div class="employment-dates">`;
        item += extractDate(element.start_date, true);
        item += " - ";
        item += extractDate(element.end_date, true);
        item += `<div class="employment-type">${element.type}</div>`;
        item += `</div>`;

        item += `</div>`;

        pageLoaded("home-link");

        break;

      case "skills":
        item += `<div class="skill-box box">`;
        item += `<h2>${titleToShow}</h2>`;
        item += `<div>`;

        let awardImage = getFullUrl(element.field_award_images);

        /* if there is a PDF, link to it */
        if (element.field_award_pdf) {
          item += `<a href="${getFullUrl(
            element.field_award_pdf
          )}" target="_blank" title="Click to view a PDF of ${
            element.title
          }"><img src="${awardImage}" alt="${element.title}" width="290" /></a>`;
        } else {
          item += `<img src="${awardImage}" alt="${element.title}" width="290" />`;
        }

        item += `</div>`;

        let awardDate = "";

        if (element.field_award_date) {
          awardDate = extractDate(element.field_award_date, true);
        }

        item += `<div class="skill-date">${awardDate}</div>`;

        item += `</div>`;

        pageLoaded("skills-link");

        break;
    }
  });

  setItemCount(itemCount);

  if (itemCount <= 0) {
    $("body").append(`<div id="noRecords">No matches found for '${searchedFor}'</div>`);
  }

  return item;
}

/**
 * Hide preloader, show page, set nav item, put focus in search
 * @param urlpageLinkToData {string} id of current nav item
 */
function pageLoaded(pageLink) {
  setTimeout(function () {
    $("#preloader").hide();

    $("#navigation").fadeIn(150);
    $(".container").fadeIn(250);

    $("#" + pageLink).addClass("nav-item-active");

    $("#searchSite").focus();
  }, 25);
}

/**
 * Set/update the current page item couunt
 * @param count {int} number of items
 */
function setItemCount(count) {
  let searchCount = document.getElementById("searchCount");
  let searchForNoun = count == 1 ? "item" : "items";
  searchCount.innerHTML = `${count} ${searchForNoun}`;
}

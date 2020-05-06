"use strict";

/**
 * Get data from Drupal 8 datastore.
 *
 * @param urlToData {string} url to fetch data from
 * @return {array} array of objects
 */
function getData(urlToData) {
  /* For Testing */

  if (window.location.href.indexOf("localhost") !== -1) {
    if (urlToData.indexOf("companies") !== -1) {
      urlToData = "companies.json";
    }
    if (urlToData.indexOf("skills") !== -1) {
      urlToData = "skills.json";
    }
  }

  const result = $.ajax({
    url: urlToData,
    type: "GET",
  });

  return result;
}

/* API URLs */
const API_Company = "https://chriscorchado.com/drupal8/rest/api/companies?_format=json";
const API_Skills = "https://chriscorchado.com/drupal8/rest/api/skills?_format=json";

/* regex to get string within quotes */
let getStringInQuotes = /"(.*?)"/;

/* used to avoid FOUC-Flash Of Unstyled Content */
$(".container").hide();

/**
 * Create absolute link
 *
 * @param linkToFix {string} relative url
 * @return {string} absolute url
 */
function getFullUrl(linkToFix) {
  return linkToFix.replace("/drupal8/", "https://chriscorchado.com/drupal8/");
}

/**
 * Load companies page (Homepage)
 */
async function getIndexPage() {
  let response = await getData(API_Company);

  response.forEach((element) => {
    let item = `<div class="company-container col shadow">`;

    item += `<div class="company-name">${element.title}</div>`;

    if (element.logo) {
      let logo = getStringInQuotes.exec(element.logo)[0];
      item += `<div class="logo-container">`;
      item += `<img src=${getFullUrl(logo)} class="company-logo" />`;
      item += `</div>`;
    }

    item += `<div class="company-job-title">${element.job_title}</div>`;

    item += `<div class="body-container">`;
    item += element.body;
    item += `</div>`;

    if (element.screenshot) {
      let screenshot = getStringInQuotes.exec(element.screenshot)[0];

      item += `<div class="screenshot-container">`;
      item += `<img src=${getFullUrl(screenshot)} class="company-screenshot" />`;
      item += `</div>`;
    }

    item += `<div class="employment-dates">`;
    item += extractDate(element.start_date, true);
    item += " - ";
    item += extractDate(element.end_date, true);
    item += `<div class="employment-type">${element.type}</div>`;
    item += `</div>`;

    item += `</div>`;

    $(".container").append(item);
  });

  pageLoaded();
}

/**
 * Load skills page
 */
async function getSkillsPage() {
  let response = await getData(API_Skills);

  response.forEach((element) => {
    let item = `<div class="skill-box box">`;
    item += `<h2>${element.title}</h2>`;
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
      item += `${awardImage}`;
    }

    item += `</div>`;

    let awardDate = "";

    if (element.field_award_date) {
      awardDate = extractDate(element.field_award_date, true);
    }

    item += `<div class="skill-date">${awardDate}</div>`;
    item += `</div>`;

    $(".container").append(item);
  });

  pageLoaded();
}

/**
 * Hide preloader and show page
 */
function pageLoaded() {
  // highlight the current nav item link
  $("#" + getCurrentLinkID()).addClass("nav-item-active");

  $("#preloader").hide();
  $(".container").fadeIn();
}

/**
 * Extract date string
 *
 * @param dt {string} contains the date
 * @param monthYear {boolean} if true return month and year only
 * @return {string} full date or month and year only
 */
function extractDate(dt, monthYear) {
  let returnDate = dt.split(">")[1];
  returnDate = returnDate.split("-")[0];

  if (monthYear) {
    let shortDate = returnDate.split(",");
    returnDate = shortDate[1].split(" ")[1] + shortDate[2];
  }
  return returnDate;
}

/**
 * Load navigation
 */
$("#navigation").load("includes/nav.html");

function getCurrentLinkID() {
  if (location.pathname.includes("skills.html")) {
    return "skills-link";
  }
  if (location.pathname.includes("index.html")) {
    return "home-link";
  }
}

/**
 * Load pages
 */

if (location.pathname.includes("skills.html")) {
  getSkillsPage();
} else {
  getIndexPage();
}

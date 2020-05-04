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

let getStringInQuotes = /"(.*?)"/; // regex to get string within quotes

$(".container").hide();

/**
 * Create absolute link.
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

  let response = await getData(
    "https://chriscorchado.com/drupal8/rest/api/companies?_format=json"
  );

  response.forEach((element) => {
    let item = `<div class="company-container col shadow">`;

    if (element.logo) {
      let logo = getStringInQuotes.exec(element.logo)[0];
      item += `<div class="logo-container">`;
      item += `<img src=${getFullUrl(logo)} class="company-logo" />`;
      item += `</div>`;
    }

    item += `<div class="body-container">`;
    item += element.body;
    item += `</div>`;

    if (element.screenshot) {
      let screenshot = getStringInQuotes.exec(element.screenshot)[0];
      item += `<div class="screenshot-container">`;
      item += `<img src=${getFullUrl(screenshot)} class="company-screenshot" />`;
      item += `</div>`;
    }

    item += `</div>`;

    $(".container").append(item);
  });

  pageLoaded();
}

/**
 * Load skills page
 */
async function getSkillsPage() {

  let response = await getData(
    "https://chriscorchado.com/drupal8/rest/api/skills?_format=json"
  );

  response.forEach((element) => {
    let item = `<div class="skill-box">`;
    item += `<h2>${element.title}</h2>`;
    item += `<div>`;

    let awardImage = getFullUrl(element.field_award_images_1);

    /* if there is a PDF, link to it */
    if (element.field_award_pdf) {
      item += `<a href="${getFullUrl(
        element.field_award_pdf
      )}" target="_blank" title="Click to View the PDF">${awardImage}</a>`;
    } else {
      item += `${awardImage}`;
    }
    item += `</div>`;

    let awardDate = "";

    if (element.field_award_date) {
      awardDate = element.field_award_date.split(">")[1];
      awardDate = awardDate.split("-")[0];
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
  $("#preloader").hide();
  $("*").removeClass("hide-me");
  $(".container").fadeIn();
}

/**
 * Load pages
 */
if (location.pathname.includes("skills.html")) {
  getSkillsPage();
} else {
  getIndexPage();
}
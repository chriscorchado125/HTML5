"use strict";

/* API URLs */
const API_Company = "https://chriscorchado.com/drupal8/rest/api/companies?_format=json";
const API_Skills = "https://chriscorchado.com/drupal8/rest/api/skills?_format=json";
const API_Projects = "https://chriscorchado.com/drupal8/rest/api/projects?_format=json";

/**
 * Get current page
 * @return {string} name of page
 */
function getCurrentPage() {
  let currentPage = "";

  if (location.pathname.includes("skills.html")) {
    currentPage = "skills";
  }

  if (location.pathname.includes("projects.html")) {
    currentPage = "projects";
  }

  if (location.pathname.includes("index.html") || currentPage == "") {
    currentPage = "companies";
  }

  return currentPage;
}

/**
 * Get data from Drupal 8 datastore
 * @param dataURL {string} url to fetch data from
 * @return {array} array of objects
 */
function getData(dataURL) {
  /* For Local Testing */

  if (window.location.href.indexOf("localhost") !== -1) {
    switch (getCurrentPage()) {
      case "companies":
        dataURL = "companies.json";
        break;
      case "skills":
        dataURL = "skills.json";
        break;
      case "projects":
        dataURL = "projects.json";
        break;
    }
  }

  const result = $.ajax({
    url: dataURL,
    type: "GET",
  });

  return result;
}

/**
 * Load companies page (Homepage)
 * @param search {string} search string
 */
async function getIndexPage(search) {
  let data = await getData(API_Company);
  renderPage(data, "companies", search);
}

/**
 * Load skills page
 * @param search {string} search string
 */
async function getSkillsPage(search) {
  let data = await getData(API_Skills);
  renderPage(data, "skills", search);
}

/**
 * Load projects page
 * @param search {string} search string
 */
async function getProjectsPage(search) {
  let data = await getData(API_Projects);
  renderPage(data, "projects", search);
}

/* Hide container immediately */
$(".container").hide();

/**
 * Load pages
 */
window.onload = (event) => {
  $("#navigation").load("includes/nav.html");

  switch (getCurrentPage()) {
    case "companies":
      getIndexPage();
      break;
    case "skills":
      getSkillsPage();
      break;
    case "projects":
      getProjectsPage();
      break;
  }
};

/**
 * Search data
 */
async function searchData() {
  let inputSearchBox = document.getElementById("searchSite");

  $(".container, .skills-container").hide();

  if (inputSearchBox.value.length > 2) {
    ga("send", "pageview", location.pathname + "?search=" + inputSearchBox.value);
  }

  switch (getCurrentPage()) {
    case "companies":
      getIndexPage(inputSearchBox.value);
      break;
    case "skills":
      getSkillsPage(inputSearchBox.value);
      break;
    case "projects":
      getProjectsPage(inputSearchBox.value);
      break;
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
  /* don't allow more characters if current search returns no records */
  if (document.getElementById("searchCount").innerHTML.substring(0, 1) == "0") {
    return false;
  }

  let charCode = event.keyCode || event.which;

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
 */
function renderPage(data, page, searchedFor) {
  let item = "";
  let searchedTitle = "";
  let titleToShow = "";
  let itemCount = 0;

  $("#noRecords").remove();

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

    titleToShow = titleToShow.replace("&amp;", "&");

    switch (page) {
      case "companies":
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
          )}" target="_blank"><img src="${awardImage}" alt="${
            element.title
          }" width="290" /></a>`;
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

        setPageMessage("click an image to view the PDF");
        break;

      case "projects":
        item += `<div class="project col">`;
        item += `<div class="project-title">${titleToShow}`;

        let projectDate = "";

        if (element.date) {
          projectDate = extractDate(element.date, true);
        }

        item += `<div class="project-company">${
          element.company
        } <span class="project-date">(${projectDate.split(" ")[1]})</span></div>`;

        item += `</div>`;

        item += `<div class="body-container">`;
        item += element.body;
        item += `</div>`;

        if (element.screenshot) {
          let screenshots = element.screenshot.split(",");
          let screenshotCount = parseInt(screenshots.length);

          let itemGridClass = "project-items3";

          if (screenshotCount === 2) {
            itemGridClass = "project-items2";
          }
          if (screenshotCount === 1) {
            itemGridClass = "project-items1";
          }

          let section = `<section data-featherlight-gallery data-featherlight-filter="a" class="${itemGridClass}">`;

          screenshots.forEach((img) => {
            let imgPieces = img.split("=");

            let imgUrl = getStringInQuotes.exec(imgPieces[1])[0];
            // let imgWidth = getStringInQuotes.exec(imgPieces[2])[0];
            // let imgHeight = getStringInQuotes.exec(imgPieces[3])[0];
            let imgAlt = getStringInQuotes.exec(imgPieces[4])[0].replace(/"/g, "");

            let projectImage = getFullUrl(imgUrl);

            section += `<div class="project-item shadow">`;

            section += `<a href=${projectImage} style="display:none;"><img src=${projectImage}></a>`;

            section += `<a href=${projectImage} class="gallery">
            <div class="project-item-desc">${imgAlt}</div>
            <img src=${projectImage} alt=${imgAlt} />
            </a></div>`;
          });

          section += `</section>`;

          item += section;
        }
        if (element.video_url) {
          item += `<a href="${element.video_url}" 
          data-featherlight="iframe" 
          data-featherlight-iframe-frameborder="0" 
          data-featherlight-iframe-allowfullscreen="true" 
          data-featherlight-iframe-allow="autoplay; encrypted-media"
          data-featherlight-iframe-style="display:block;border:none;height:85vh;width:85vw;" class="play-video">Play Video<img src="images/play_vidoe_icon.png" width="20" /></a>`;
        }

        item += `<br /><div class="project-technology">${element.technology}</div>`;

        item += `</div>`;

        pageLoaded("projects-link");

        setPageMessage("click an image to enlarge it");
        break;
    }
  });

  setItemCount(itemCount);

  if (itemCount <= 0) {
    $(".container").hide();

    $("body").append(
      `<div id="noRecords" class="shadow">No matches found for '${searchedFor}'</div>`
    );
  } else {
    $(".container").html(item);
    $("section").featherlight(); // must init after adding items
  }
}

/**
 * Hide preloader, show page, set nav item, put focus in search
 * @param pageLink {string} id of current nav item
 */
function pageLoaded(pageLink) {
    $("#preloader").hide();
    $(".container").fadeIn(250);
    $("#" + pageLink).addClass("nav-item-active");
    $("#searchSite").focus();
}

/**
 * Set/update the current page item count
 * @param count {int} number of items
 */
function setItemCount(count) {
  let searchCount = document.getElementById("searchCount");
  let searchForNoun = count == 1 ? "item" : "items";
  searchCount.innerHTML = `${count} ${searchForNoun}`;
}

/**
 * Set page message
 * @param msg {string} message text
 */
function setPageMessage(msg) {
  let pageMessageContainer = document.getElementById("msg");
  pageMessageContainer.innerHTML = `(${msg})`;
}

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

/* Hide container and show navigation asap */
$(".container").hide();
$("#navigation").load("includes/nav.html");

/**
 * Load pages when the browser is ready
 */
window.onload = (event) => {
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
 * Only allow searching with a-Z, numbers and spaces
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
    (charCode >= 65 && charCode <= 122) || // a-z
    (charCode >= 96 && charCode <= 105) || // 96-105 numeric keypad
    (charCode >= 48 && charCode <= 57) || // 0-1 top of keyboard
    charCode == 32 || // space
    charCode == 16 // shift
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
 * @return {string} search result with/without highlight
 */
function itemWithSearchHighlight(itemToHighlight, searchedFor) {
  let dataToReturn = "";

  if (searchedFor) {
    let searchTerm = new RegExp(searchedFor, "gi");
    let searchString = itemToHighlight.replace("&amp;", "&").replace("&#039;", "'");
    let results = "";

    /* check for HTML
     * TODO: use entities within Drupal to avoid adding body content with HTML
     */
    if (searchString.includes("<ul>")) {
      let listItem = "";

      // remove ul tags and break the li items into an array
      let searchWithHTML = searchString.replace("<ul>", "").replace("</ul>", "");
      searchWithHTML = searchWithHTML.split("<li>");

      searchWithHTML.forEach((element) => {
        if (element) {
          // remove closing li tag
          searchString = element.slice(0, -7);

          if (searchString.match(searchTerm)) {
            results = searchString.replace(
              searchTerm,
              (match) => `<span class="highlightSearchText">${match}</span>`
            );

            listItem += `<li>${results}</li>`;
          } else {
            listItem += `<li>${searchString}</li>`;
          }
        }
      });

      dataToReturn = `<ul>${listItem}</ul>`;
    } else {
      if (searchString.match(searchTerm)) {
        results = searchString.replace(
          searchTerm,
          (match) => `<span class="highlightSearchText">${match}</span>`
        );
        dataToReturn += results;
      } else {
        dataToReturn += searchString;
      }
    }
  }
  return dataToReturn;
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
  let itemCount = 0;

  let noMatchFound,
    screenshotCount = 0;

  let screenshots,
    imgPieces = [];

  let currentNavItem,
    itemGridClass,
    itemTitle,
    itemDate,
    startDate,
    endDate,
    itemBody,
    itemJobTitle,
    itemTechnology,
    itemCompanyName,
    itemWorkType,
    upperSearch,
    bodyWithOutHTML,
    awardImage,
    screenshot,
    logo,
    section,
    imgUrl,
    imgAlt,
    projectImage = "";

  $("#noRecords").remove();

  data.forEach((element) => {
    itemTitle = element.title;

    //skills date (field_award_date) or project date (element.date)
    itemDate = element.field_award_date || element.date || "";

    if (itemDate) {
      itemDate = extractDate(itemDate, true);
    }

    startDate = element.start_date || "";
    endDate = element.end_date || "";

    if (startDate) {
      startDate = extractDate(startDate, true);
    }

    if (endDate) {
      endDate = extractDate(endDate, true);
    }

    itemBody = element.body || "";
    itemJobTitle = element.job_title || "";
    itemTechnology = element.technology || "";
    itemCompanyName = element.field_company_name || "";
    itemWorkType = element.type || "";

    /* If searching then skip any items that don't match otherwise highlight search phrase within the results.
     * TODO: Move data search to server side using the JSON API for efficiency and performance.
     * Specification: https://jsonapi.org/
     * Playlist: https://www.youtube.com/playlist?list=PLZOQ_ZMpYrZsyO-3IstImK1okrpfAjuMZ
     */

    if (searchedFor) {
      noMatchFound = 0;
      upperSearch = searchedFor.toUpperCase();

      if (itemTitle.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      bodyWithOutHTML = itemBody.replace(/(<([^>]+)>)/gi, "");

      if (bodyWithOutHTML.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (itemJobTitle.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (itemDate.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (startDate.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (endDate.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (itemJobTitle.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (itemTechnology.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (itemCompanyName.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (itemWorkType.toUpperCase().indexOf(upperSearch) !== -1) {
        noMatchFound++;
      }

      if (noMatchFound == false) {
        return;
      }

      itemTitle = itemWithSearchHighlight(itemTitle, searchedFor);
      itemDate = itemWithSearchHighlight(itemDate, searchedFor);
      startDate = itemWithSearchHighlight(startDate, searchedFor);
      endDate = itemWithSearchHighlight(endDate, searchedFor);
      itemBody = itemWithSearchHighlight(itemBody, searchedFor);
      itemJobTitle = itemWithSearchHighlight(itemJobTitle, searchedFor);
      itemTechnology = itemWithSearchHighlight(itemTechnology, searchedFor);
      itemCompanyName = itemWithSearchHighlight(itemCompanyName, searchedFor);
      itemWorkType = itemWithSearchHighlight(itemWorkType, searchedFor);
    }

    itemCount++;

    itemTitle = itemTitle.replace("&amp;", "&");

    switch (page) {
      case "companies":
        currentNavItem = "home-link";

        item += `<div class="company-container col shadow">`;
        item += `<div class="company-name">${itemTitle}</div>`;

        if (element.logo) {
          logo = getStringInQuotes.exec(element.logo)[0];

          item += `<div class="logo-container">`;
          item += `<img src=${getFullUrl(logo)} class="company-logo" alt="${
            element.title
          } Logo" />`;
          item += `</div>`;
        }

        item += `<div class="company-job-title">${itemJobTitle}</div>`;

        item += `<div class="body-container">`;
        item += itemBody;
        item += `</div>`;

        if (element.screenshot) {
          screenshot = getStringInQuotes.exec(element.screenshot)[0];

          item += `<div class="screenshot-container">`;
          item += `<img src=${getFullUrl(screenshot)} class="company-screenshot"  alt="${
            element.title
          } Screenshot" />`;
          item += `</div>`;
        }

        item += `<div class="employment-dates">${startDate} - ${endDate}`;
        item += `<div class="employment-type">${itemWorkType}</div>`;
        item += `</div>`;

        item += `</div>`;
        break;

      case "skills":
        currentNavItem = "skills-link";

        item += `<div class="skill-box box">`;
        item += `<h2>${itemTitle}</h2>`;
        item += `<div>`;

        if (element.field_award_images) {
          awardImage = getFullUrl(element.field_award_images);
        }

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

        item += `<div class="skill-date">${itemDate}</div>`;

        item += `</div>`;

        setPageMessage("click an image to view the PDF");
        break;

      case "projects":
        currentNavItem = "projects-link";

        item += `<div class="project col">`;
        item += `<div class="project-title">${itemTitle}`;

        item += `<div class="project-company">${itemCompanyName} <span class="project-date">(${
          itemDate.split(" ")[1]
        })</span></div>`;

        item += `</div>`;

        item += `<div class="body-container">`;
        item += itemBody;
        item += `</div>`;

        if (element.screenshot) {
          screenshots = element.screenshot.split(",");
          screenshotCount = parseInt(screenshots.length);

          itemGridClass = "project-items3";

          if (screenshotCount === 2) {
            itemGridClass = "project-items2";
          }
          if (screenshotCount === 1) {
            itemGridClass = "project-items1";
          }

          section = `<section data-featherlight-gallery data-featherlight-filter="a" class="${itemGridClass}">`;

          screenshots.forEach((img) => {
            imgPieces = img.split("=");

            imgUrl = getStringInQuotes.exec(imgPieces[1])[0];
            // let imgWidth = getStringInQuotes.exec(imgPieces[2])[0];
            // let imgHeight = getStringInQuotes.exec(imgPieces[3])[0];
            imgAlt = getStringInQuotes.exec(imgPieces[4])[0].replace(/"/g, "");

            projectImage = getFullUrl(imgUrl);

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

        item += `<br /><div class="project-technology">${itemTechnology}</div>`;

        item += `</div>`;

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
  }

  pageLoaded(currentNavItem);
}

/**
 * Hide preloader, show page, set nav item, put focus in search
 * @param pageLink {string} id of current nav item
 */
function pageLoaded(pageLink) {
  $("#preloader").hide();

  /* toggle container visiblity based on current item count */
  if (document.getElementById("searchCount").innerHTML.substring(0, 1) == "0") {
    $(".container").hide();
  } else {
    $(".container").fadeIn(300);
  }

  $("#" + pageLink).addClass("nav-item-active");

  $("#searchSite").focus();

  $("a.gallery").featherlightGallery({
    previousIcon: "&#9664;" /* Code that is used as previous icon */,
    nextIcon: "&#9654;" /* Code that is used as next icon */,
    galleryFadeIn: 200 /* fadeIn speed when slide is loaded */,
    galleryFadeOut: 300 /* fadeOut speed before slide is loaded */,
  });

  $("section").featherlight(); // must init after adding items
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

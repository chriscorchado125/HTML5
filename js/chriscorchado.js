"use strict";

/* API URLs */
const API_About = "https://chriscorchado.com/drupal8/rest/api/about?_format=json";
const API_History = "https://chriscorchado.com/drupal8/rest/api/companies?_format=json";
const API_Courses = "https://chriscorchado.com/drupal8/rest/api/courses?_format=json";
const API_Projects = "https://chriscorchado.com/drupal8/rest/api/projects?_format=json";

/* Hide container and show navigation */
$(".container").hide();
$("#navigation").load("includes/nav.html");

/**
 * Get data from Drupal 8 datastore
 * @param dataURL {string} url to fetch data from
 * @return {array} array of objects
 */
const getData = (dataURL) => {
  /* For Local Testing */

  if (window.location.href.indexOf("localhost") !== -1) {
    switch (getCurrentPage()) {
      case "about":
        dataURL = "about.json";
        break;
      case "companies":
        dataURL = "companies.json";
        break;
      case "courses":
        dataURL = "courses.json";
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
};

/**
 * Search data after the user pauses for half a second
 */
async function searchData() {
  let inputSearchBox = document.getElementById("searchSite");
  let timeout = null;

  inputSearchBox.addEventListener("keyup", function (e) {
    clearTimeout(timeout);

    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(function () {
      $(".container, .courses-container").hide();

      if (inputSearchBox.value.length > 2) {
        ga("send", "pageview", location.pathname + "?search=" + inputSearchBox.value);
      }

      switch (getCurrentPage()) {
        case "about":
          getAboutPage();
          break;
        case "companies":
          getIndexPage(inputSearchBox.value);
          break;
        case "courses":
          getCoursesPage(inputSearchBox.value);
          break;
        case "projects":
          getProjectsPage(inputSearchBox.value);
          break;
      }
    }, 500);
  });
}

/**
 * Clear Search
 */
const searchClear = () => {
  if (document.getElementById("searchSite").value !== "") {
    location.reload();
  }
};

/**
 * Filter what a user is allowed to enter in the search field
 * Only allow searching with a-Z, numbers and spaces
 * @param event {event} key event
 * @return {string} allowed characters
 */
const searchFilter = (event) => {
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
};

/**
 * Extract date string
 * @param dateString {string} contains the date
 * format: <time datetime="2019-10-07T12:00:00Z" class="datetime">Monday, October 7, 2019 - 12:00</time>
 * @param monthYear {boolean} if true return month and year only
 * @return {string} full date or month and year only
 */
const extractDate = (dateString, monthYear) => {
  let returnDate = dateString.split(">")[1];
  returnDate = returnDate.split("-")[0];

  if (monthYear) {
    let shortDate = returnDate.split(",");
    returnDate = shortDate[1].split(" ")[1] + shortDate[2];
  }
  return returnDate;
};

/**
 * Create absolute link
 * @param linkToFix {string} relative url
 * @return {string} absolute url
 */
const getFullUrl = (linkToFix) => {
  /* For Local Testing */

  if (window.location.href.indexOf("localhost") !== -1) {
    return linkToFix.replace("/drupal8/", "http://localhost/chriscorchado/drupal8/");
  }

  return linkToFix.replace("/drupal8/", "https://chriscorchado.com/drupal8/");
};

/**
 * Highlight search term with a string
 * @param itemToHighlight {string} string to search
 * @param searchedFor {string} string to search for
 * @return {string} search result with/without highlight
 */
const itemWithSearchHighlight = (itemToHighlight, searchedFor) => {
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
};

/**
 * Check if the item has the search text within it
 * @param item {string} string to search
 * @param search {string} uppercase search phrase
 * @return {int} 1 if there is a match otherwise 0
 */
const checkMatch = (item, search) => {
  let itemWithOutHTML = item.replace(/(<([^>]+)>)/gi, "");

  if (itemWithOutHTML.toUpperCase().indexOf(search) !== -1) {
    return 1;
  }
  return 0;
};

/* regex to get string within quotes */
let getStringInQuotes = /"(.*?)"/;

/**
 * Create HTML for page *
 * @param data {array} page items
 * @param page {string} page name
 * @param searchedFor {string} search string
 */
const renderPage = (data, page, searchedFor) => {
  // addhide search box on About Me page
  if (page == "about") {
    document.getElementById("search-container").style.display = "none";

    document.getElementById("logo").getElementsByTagName("img")[0].style.border =
      "1px dashed #7399EA";
  }

  let item = "";
  let itemCount = 0;

  let matchesFound,
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

    //course date (field_award_date) or project date (element.date)
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

    itemTitle = itemTitle.replace("&amp;", "&");

    /* If searching then skip any items that don't match otherwise highlight search phrase within the results.
     * TODO: Move data search to server side using the JSON API for efficiency and performance.
     * Specification: https://jsonapi.org/
     * Playlist: https://www.youtube.com/playlist?list=PLZOQ_ZMpYrZsyO-3IstImK1okrpfAjuMZ
     */
    if (searchedFor) {
      matchesFound = 0;
      upperSearch = searchedFor.toUpperCase();

      matchesFound += checkMatch(itemTitle, upperSearch);
      matchesFound += checkMatch(itemBody, upperSearch);
      matchesFound += checkMatch(itemJobTitle, upperSearch);
      matchesFound += checkMatch(itemDate, upperSearch);
      matchesFound += checkMatch(startDate, upperSearch);
      matchesFound += checkMatch(endDate, upperSearch);
      matchesFound += checkMatch(itemJobTitle, upperSearch);
      matchesFound += checkMatch(itemTechnology, upperSearch);
      matchesFound += checkMatch(itemCompanyName, upperSearch);
      matchesFound += checkMatch(itemWorkType, upperSearch);

      if (matchesFound == 0) {
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

    switch (page) {
      case "about":
        currentNavItem = "about-link";
        item = `<h1>${itemTitle}</h1>`;
        item += itemBody;
        break;
      case "companies":
        currentNavItem = "companies-link";

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

      case "courses":
        currentNavItem = "courses-link";

        item += `<div class="course-box box">`;
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

        item += `<div class="course-date">${itemDate}</div>`;

        item += `</div>`;

        setPageMessage("click an image to view the PDF");
        break;

      case "projects":
        currentNavItem = "projects-link";

        item += `<div class="project col">`;

        item += `<div class="project-title">${itemTitle}`;
        item += `<div class="project-company">${itemCompanyName} <span class="project-date">(${itemDate})</span></div>`;
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

  $("#" + currentNavItem).addClass("nav-item-active");

  setItemCount(itemCount);

  $("#searchSite").focus();

  $("#preloader").hide();

  if (itemCount > 0) {
    $(".container").html(item).fadeIn(300);

    $("a.gallery").featherlightGallery({
      previousIcon: "&#9664;" /* Code that is used as previous icon */,
      nextIcon: "&#9654;" /* Code that is used as next icon */,
      galleryFadeIn: 200 /* fadeIn speed when slide is loaded */,
      galleryFadeOut: 300 /* fadeOut speed before slide is loaded */,
    });

    $("section").featherlight(); // must init after adding items
  } else {
    $("body").append(
      `<div id="noRecords" class="shadow">No matches found for '${searchedFor}'</div>`
    );
  }
};

/**
 * Set/update the current page item count
 * @param count {int} number of items
 */
const setItemCount = (count) => {
  let searchForNoun = count == 1 ? "item" : "items";
  document.getElementById("searchCount").innerHTML = `${count} ${searchForNoun}`;
};

/**
 * Set page message
 * @param msg {string} message text
 */
const setPageMessage = (msg) => {
  document.getElementById("msg").innerHTML = `(${msg})`;
};

/**
 * Get current page
 * @return {string} name of page
 */
const getCurrentPage = () => {
  if (location.pathname.includes("index.html")) {
    return "about";
  }

  if (location.pathname.includes("companies.html")) {
    return "companies";
  }

  if (location.pathname.includes("courses.html")) {
    return "courses";
  }

  if (location.pathname.includes("projects.html")) {
    return "projects";
  }

  return "about";
};

/**
 * Load about
 */
async function getAboutPage() {
  let data = await getData(API_About);
  renderPage(data, "about");
}

/**
 * Load companies
 * @param search {string} search string
 */
async function getCompaniesPage(search) {
  let data = await getData(API_History);
  renderPage(data, "companies", search);
}

/**
 * Load courses
 * @param search {string} search string
 */
async function getCoursesPage(search) {
  let data = await getData(API_Courses);
  renderPage(data, "courses", search);
}

/**
 * Load projects
 * @param search {string} search string
 */
async function getProjectsPage(search) {
  let data = await getData(API_Projects);
  renderPage(data, "projects", search);
}

/**
 * Get page when the resources are loaded
 */
window.onload = () => {
  switch (getCurrentPage()) {
    case "about":
      getAboutPage();
      break;
    case "companies":
      getCompaniesPage();
      break;
    case "courses":
      getCoursesPage();
      break;
    case "projects":
      getProjectsPage();
      break;
  }
};

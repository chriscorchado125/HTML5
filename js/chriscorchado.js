'use strict';

const API_Course_Count =
  'https://chriscorchado.com/drupal8/rest/api/course/count?_format=json';

const API_Company_Count =
  'https://chriscorchado.com/drupal8/rest/api/company/count?_format=json';

const API_Project_Count =
  'https://chriscorchado.com/drupal8/rest/api/project/count?_format=json';

const pageLimit = 50;

/* Hide container and show navigation */
$('.container').hide();
$('#navigation').load('includes/nav.html');

/**
 * Load data and render pages
 * @param page {string} page name
 * @param search {string} (optional) search string
 */
async function getPage(page, search, pagingURL) {
  let data = null;
  if (pagingURL) {
    data = await getData(pagingURL);
  } else {
    switch (page) {
      case 'about':
        data = await getData(
          `https://chriscorchado.com/drupal8/jsonapi/node/page?fields[node--page]=id,title,body&filter[id][operator]=CONTAINS&filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe`
        );
        break;
      case 'companies':
        if (search) {
          data = await getData(
            `https://chriscorchado.com/drupal8/jsonapi/node/company?filter[or-group][group][conjunction]=OR&filter[field_company_name][operator]=CONTAINS&filter[field_company_name][value]=${search}&filter[field_company_name][condition][memberOf]=or-group&filter[field_job_title][operator]=CONTAINS&filter[field_job_title][value]=${search}&filter[field_job_title][condition][memberOf]=or-group&filter[body.value][operator]=CONTAINS&filter[body.value][value]=${search}&filter[body.value][condition][memberOf]=or-group&sort=-field_end_date&include=field_company_screenshot&page[limit]=${pageLimit}`
          );
        } else {
          data = await getData(
            `https://chriscorchado.com/drupal8/jsonapi/node/company?sort=-field_end_date&include=field_company_screenshot&page[limit]=${pageLimit}`
          );
        }
        break;
      case 'courses':
        if (search) {
          data = await getData(
            `https://chriscorchado.com/drupal8/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=${search}&filter[title][condition][memberOf]=or-group&filter[field_award_date][operator]=CONTAINS&filter[field_award_date][value]=${search}&filter[field_award_date][condition][memberOf]=or-group&sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=${pageLimit}`
          );
        } else {
          data = await getData(
            `https://chriscorchado.com/drupal8/jsonapi/node/awards?sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=${pageLimit}`
          );
        }

        break;
      case 'projects':
        if (search) {
          data = await getData(
            `https://chriscorchado.com/drupal8/jsonapi/node/project?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=${search}&filter[title][condition][memberOf]=or-group&filter[taxonomy_term--tags][path]=field_project_technology.name&filter[taxonomy_term--tags][operator]=CONTAINS&filter[taxonomy_term--tags][value]=${search}&filter[taxonomy_term--tags][condition][memberOf]=or-group&filter[field_company.title][operator]=CONTAINS&filter[field_company.title][value]=${search}&filter[field_company.title][condition][memberOf]=or-group&filter[field_screenshot.meta.alt][operator]=CONTAINS&filter[field_screenshot.meta.alt][value]=${search}&filter[field_screenshot.meta.alt][condition][memberOf]=or-group&filter[field_date][operator]=CONTAINS&filter[field_date][value]=${search}&filter[field_date][condition][memberOf]=or-group&sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=${pageLimit}`
          );
        } else {
          data = await getData(
            `https://chriscorchado.com/drupal8/jsonapi/node/project?sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=${pageLimit}`
          );
        }
        break;
    }
  }

  renderPage(data, page, search, data.links.next, data.links.prev);
}

/**
 * Get data from Drupal 8 datastore
 * @param dataURL {string} url to fetch data from
 * @return {array} array of objects
 */
const getData = (dataURL) => {
  const result = $.ajax({
    dataType: 'json',
    accepts: {
      json: 'application/vnd.api+json',
    },
    url: dataURL,
    type: 'GET',
  });

  return result;
};

/**
 * Search data after the user pauses typing for half a second
 */
async function searchData() {
  let inputSearchBox = document.getElementById('searchSite');
  let timeout = null;

  inputSearchBox.addEventListener('keyup', function (e) {
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      $('.container, .courses-container').hide();

      if (inputSearchBox.value.length > 2) {
        ga('send', 'pageview', location.pathname + '?search=' + inputSearchBox.value);
      }

      getPage(getCurrentPage(), inputSearchBox.value);
    }, 500);
  });
}

/**
 * Clear current search
 * TODO: use getData instead of reloading
 */
const searchClear = () => {
  if (document.getElementById('searchSite').value !== '') {
    location.reload();
  }
};

/**
 * Filter what a user is allowed to enter in the search field
 * Only allow searching with a-Z, 0-9 and spaces
 * @param event {event} key event
 * @return {string} allowed characters
 */
const searchFilter = (event) => {
  /* don't allow more characters if current search returns no records */
  if (document.getElementById('searchCount').innerHTML.substring(0, 1) == '0') {
    return false;
  }

  let charCode = event.keyCode || event.which;

  return (
    (charCode >= 65 && charCode <= 122) || // a-z
    (charCode >= 96 && charCode <= 105) || // 0-9 numeric keypad
    (charCode >= 48 && charCode <= 57) || // 0-9 top of keyboard
    charCode == 16 || // shift key - A-Z
    charCode == 32 // space
  );
};

/**
 * Highlight search term with a string
 * @param itemToHighlight {string} string to search
 * @param searchedFor {string} string to search for
 * @return {string} search result with/without highlight
 */
const itemWithSearchHighlight = (itemToHighlight, searchedFor) => {
  let dataToReturn = '';

  if (searchedFor) {
    let searchTerm = new RegExp(searchedFor, 'gi');
    let results = '';

    let searchString = '';

    if (itemToHighlight && itemToHighlight !== -1) {
      searchString = itemToHighlight.replace('&amp;', '&').replace('&#039;', "'");
    }

    /* check for HTML
     * TODO: use entities within Drupal to avoid adding body content with HTML
     */
    if (searchString.includes('<ul>')) {
      let listItem = '';

      // remove ul tags and break the li items into an array
      let searchWithHTML = searchString.replace('<ul>', '').replace('</ul>', '');

      searchWithHTML = searchWithHTML.split('<li>');

      searchWithHTML.forEach((element) => {
        if (element.length > 3) {
          // remove closing li tag
          searchString = element.slice(0, element.lastIndexOf('<'));

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

  return dataToReturn || itemToHighlight;
};

/**
 * Create HTML for page *
 * @param data {array} page items
 * @param page {string} page name
 * @param searchedFor {string} search string
 */
const renderPage = (data, page, searchedFor, next, prev) => {
  /* regex to get string within quotes */
  let getStringInQuotes = /"(.*?)"/;

  // add border to logo and hide search box on About page
  if (page == 'about') {
    document.getElementById('search-container').style.display = 'none';

    document.getElementById('logo').getElementsByTagName('img')[0].style.border =
      '1px dashed #7399EA';
  }

  let matchesFound,
    screenshotCount,
    imgAltCount,
    itemCount = 0;

  let imgPieces = [];
  let companyScreenshotID = [];

  let item = '';
  let currentNavItem,
    itemGridClass,
    itemTitle,
    itemDate,
    startDate,
    endDate,
    newDate,
    itemBody,
    itemJobTitle,
    itemTechnology,
    itemCompanyName,
    itemWorkType,
    itemPDF,
    upperSearch,
    section,
    projectImage,
    imgUrl = '';

  $('#noRecords').remove();

  data.data.forEach((element) => {
    itemTitle = element.attributes.title;
    itemDate = element.attributes.field_date || element.attributes.field_award_date;
    itemJobTitle = element.attributes.field_job_title;
    startDate = element.attributes.field_start_date;
    endDate = element.attributes.field_end_date;
    itemWorkType = element.attributes.field_type == 'full' ? 'Full-Time' : 'Contract';

    itemTechnology = '';
    imgPieces = [];

    if (data.included) {
      data.included.forEach((included_element) => {
        if (element.relationships.field_award_images) {
          /* get Courses screenshot filenames */
          if (
            element.relationships.field_award_images.data[0].id == included_element.id
          ) {
            imgPieces.push(included_element.attributes.filename);
          }
        }

        if (
          element.relationships.field_award_pdf &&
          element.relationships.field_award_pdf.data.id == included_element.id
        ) {
          itemPDF = included_element.attributes.filename;
        }

        if (included_element.attributes.filename) {
          imgUrl = included_element.attributes.filename;
        }

        if (element.relationships.field_company_screenshot) {
          /* get Company screenshot filenames */
          if (
            element.relationships.field_company_screenshot.data.some(
              (field_screenshot) => field_screenshot.id == included_element.id
            )
          ) {
            imgPieces.push(included_element.attributes.filename);
          }
        }

        if (element.relationships.field_screenshot) {
          /* get Company name */
          if (element.relationships.field_company.data.id == included_element.id) {
            itemCompanyName = included_element.attributes.field_company_name;
          }

          /* get Project screenshot filenames */
          if (
            element.relationships.field_screenshot.data.some(
              (field_screenshot) => field_screenshot.id == included_element.id
            )
          ) {
            imgPieces.push(included_element.attributes.filename);
          }

          /* get technology names */
          if (
            element.relationships.field_project_technology.data.some(
              (technology) => technology.id == included_element.id
            )
          ) {
            itemTechnology += included_element.attributes.name + ', ';
          }
        }
      });
    } // if data_included

    if (
      element.relationships &&
      element.relationships.field_company_screenshot &&
      element.relationships.field_company_screenshot.data[0]
    ) {
      companyScreenshotID.push(element.relationships.field_company_screenshot.data[0].id);
    }

    if (itemDate) {
      if (page == 'projects') {
        itemDate = itemDate.split('-')[0]; // only year
      }

      if (page == 'courses') {
        // month and year
        newDate = new Date(itemDate);
        itemDate =
          newDate.toLocaleString('default', { month: 'long' }) +
          ' ' +
          newDate.getFullYear();
      }
    }

    /* Work History Dates */
    if (startDate) {
      // month and year
      newDate = new Date(startDate);
      startDate =
        newDate.toLocaleString('default', { month: 'long' }) +
        ' ' +
        newDate.getFullYear();
    }

    if (endDate) {
      // month and year
      newDate = new Date(endDate);
      endDate =
        newDate.toLocaleString('default', { month: 'long' }) +
        ' ' +
        newDate.getFullYear();
    }

    if (element.attributes.body) {
      itemBody = element.attributes.body.value || '';
    }

    itemTitle = itemTitle.replace('&amp;', '&');

    if (searchedFor) {
      itemTitle = itemWithSearchHighlight(itemTitle, searchedFor);
      itemDate = itemWithSearchHighlight(itemDate, searchedFor);
      startDate = itemWithSearchHighlight(startDate, searchedFor);
      endDate = itemWithSearchHighlight(endDate, searchedFor);
      itemBody = itemWithSearchHighlight(itemBody, searchedFor);
      itemJobTitle = itemWithSearchHighlight(itemJobTitle, searchedFor);
      itemTechnology = itemWithSearchHighlight(itemTechnology, searchedFor);
      itemCompanyName = itemWithSearchHighlight(itemCompanyName, searchedFor);

      if (itemWorkType !== 'node-company') {
        itemWorkType = itemWithSearchHighlight(itemWorkType, searchedFor);
      }
    }

    itemCount++;

    switch (page) {
      case 'about':
        currentNavItem = 'about-link';
        item = `<h1>${itemTitle}</h1>`;
        item += itemBody;
        break;
      case 'companies':
        currentNavItem = 'companies-link';

        item += `<div class="company-container col shadow">`;
        item += `<div class="company-name">${itemTitle}</div>`;
        item += `<div class="company-job-title">${itemJobTitle}</div>`;

        item += `<div class="body-container">`;
        item += itemBody;
        item += `</div>`;

        item += `<div class="screenshot-container">`;
        item += `<img src=${getFullUrlByPage(
          imgPieces[0],
          page
        )} class="company-screenshot"  alt="${element.title} Screenshot" />`;
        item += `</div>`;

        item += `<div class="employment-dates">${startDate} - ${endDate}`;
        item += `<div class="employment-type">${itemWorkType}</div>`;
        item += `</div>`;

        item += `</div>`;
        break;

      case 'courses':
        currentNavItem = 'courses-link';

        item += `<div class="course-box box">`;
        item += `<h2>${itemTitle}</h2>`;
        item += `<div>`;

        /* if there is a PDF, link to it */
        if (itemPDF) {
          item += `<a href="${getFullUrlByPage(
            itemPDF,
            page
          )}" target="_blank"><img src="${getFullUrlByPage(
            imgPieces[0],
            page
          )}" alt="${itemTitle.replace(/(<([^>]+)>)/gi, '')}" /></a>`;
        } else {
          item += `<img src="${getFullUrlByPage(
            imgPieces[0],
            page
          )}" alt="${itemTitle}" />`;
        }

        item += `</div>`;

        item += `<div class="course-date">${itemDate}</div>`;

        item += `</div>`;

        setPageMessage('click an image to view the PDF');
        break;

      case 'projects':
        currentNavItem = 'projects-link';

        item += `<div class="project col">`;

        item += `<div class="project-title">${itemTitle}`;
        item += `<div class="project-company">${itemCompanyName} <span class="project-date">(${itemDate})</span></div>`;
        item += `</div>`;

        item += `<div class="body-container">`;
        item += itemBody;
        item += `</div>`;

        /* Screenshot Section */
        if (imgPieces) {
          screenshotCount = parseInt(imgPieces.length);

          itemGridClass = 'project-item-grid';

          if (screenshotCount === 2) {
            itemGridClass = 'project-items2 project-item-grid';
          }
          if (screenshotCount === 1) {
            itemGridClass = 'project-items1 project-item-grid';
          }

          section = `<section data-featherlight-gallery data-featherlight-filter="a" class="${itemGridClass}">`;

          let screenshotAlt = [];
          element.relationships.field_screenshot.data.forEach((screenshot) => {
            screenshotAlt.push(screenshot.meta.alt);
          });

          imgAltCount = 0; // reset
          imgPieces.forEach((img) => {
            projectImage = getFullUrlByPage(img, page);

            section += `<div class="project-item shadow">`;

            section += `<a href=${projectImage} style="display:none;"><img src=${projectImage}></a>`;

            section += `<a href=${projectImage} class="gallery">
            <div class="project-item-desc">${itemWithSearchHighlight(
              screenshotAlt[imgAltCount],
              searchedFor
            )}</div>
            <img src=${projectImage} alt=${screenshotAlt[imgAltCount]} />
            </a>`;

            section += `</div>`;
            imgAltCount++;
          });

          section += `</section>`;

          item += section;
        }

        /* Video Section */
        if (element.attributes.field_video_url) {
          element.attributes.field_video_url.forEach((img) => {
            item += `<a href="${img}" 
          data-featherlight="iframe" 
          data-featherlight-iframe-frameborder="0" 
          data-featherlight-iframe-allowfullscreen="true" 
          data-featherlight-iframe-allow="autoplay; encrypted-media"
          data-featherlight-iframe-style="display:block;border:none;height:85vh;width:85vw;" class="play-video">Play Video<img src="images/play_vidoe_icon.png" width="20" /></a>`;
          });
        }

        item += `<br /><div class="project-technology">${itemTechnology}</div>`;

        item += `</div>`;

        setPageMessage('click an image to enlarge it');
        break;
    }
  }); // data.data forEach

  $('#' + currentNavItem).addClass('nav-item-active');

  $('#searchSite').focus();

  $('#preloader').hide();

  if (itemCount > 0) {
    $('.container').html(item).fadeIn(300);

    $('a.gallery').featherlightGallery({
      previousIcon: '&#9664;' /* Code that is used as previous icon */,
      nextIcon: '&#9654;' /* Code that is used as next icon */,
      galleryFadeIn: 200 /* fadeIn speed when slide is loaded */,
      galleryFadeOut: 300 /* fadeOut speed before slide is loaded */,
    });

    $('section').featherlight(); // must init after adding items
  } else {
    $('body').append(
      `<div id="noRecords" class="shadow">No matches found for '${searchedFor}'</div>`
    );
  }

  setItemCount(itemCount, page, prev, next);
};

/**
 * Create absolute link
 * @param linkToFix {string} relative url
 * @param page {string} page name
 * @return {string} absolute url
 */
const getFullUrlByPage = (linkToFix, page) => {
  switch (page) {
    case 'companies':
      return (
        'https://chriscorchado.com/drupal8/sites/default/files/company-screenshot/' +
        linkToFix
      );
      break;
    case 'courses':
      if (linkToFix.includes('.pdf')) {
        return (
          'https://chriscorchado.com/drupal8/sites/default/files/award-pdf/' + linkToFix
        );
      } else {
        return (
          'https://chriscorchado.com/drupal8/sites/default/files/award-images/' +
          linkToFix
        );
      }
      break;
    case 'projects':
      return (
        'https://chriscorchado.com/drupal8/sites/default/files/project-screenshot/' +
        linkToFix
      );
      break;
  }
};

/**
 * Set/update the current page item counts
 * @param count {int} number of items
 * @param page {string} name of page
 * @param page {prev} link to previous results
 * @param page {next} link to next results
 */
function setItemCount(count, page, prev, next) {
  let dataOffset = 0;
  let dataOffsetText = '';
  let totalItems = getCookie(page);

  if (next) {
    let nextURL = next.href
      .replace(/%2C/g, ',')
      .replace(/%5B/g, '[')
      .replace(/%5D/g, ']');

    let startOffset = nextURL.indexOf('page[offset]') + 13;
    let endOffset = nextURL.indexOf('page[limit]') - 1;
    dataOffset = nextURL.substring(startOffset, endOffset);
  }

  /* setup pagination counts */
  let currentCount = dataOffset / pageLimit;

  if (currentCount == 1) {
    dataOffsetText = `Items ${currentCount}-${pageLimit * currentCount}`;
  } else {
    dataOffsetText = `Items ${(currentCount * pageLimit) - pageLimit}-${
      pageLimit * currentCount
    }`;
  }

  /* get the highest multiple of the page limit without going over to total */
  let topNumber = Math.round(totalItems / pageLimit) * pageLimit;

  /* set the paging count on the last page */
  if (count < pageLimit && totalItems > pageLimit) {
    dataOffsetText = `Items ${topNumber}-${totalItems} `;
  }

/* handle searching  */
  if ($('#searchSite').val()) {
    dataOffsetText = `${count} ${count == 1 ? 'Item' : 'Items'} `;
    if (count <= pageLimit) {
      $('#searchCount').html(count + `  ${count == 1 ? 'Item' : 'Items'}`);
    } else {
      $('#searchCount').html(pageLimit + `  ${pageLimit == 1 ? 'Item' : 'Items'}`);
    }
  }

  let recordCount = getTotalRecordCount(page);

  /* use pagination when the total records exceed the page limit */
  if (recordCount < pageLimit) {
    document.getElementById('searchCount').innerHTML = `<span id="totalItems">${recordCount}</span>
   ${count == 1 ? 'Item' : 'Items'}`;
  } else {
    document.getElementById(
      'searchCount'
    ).innerHTML = `<span id="paging-info">${dataOffsetText}</span>`;

    let prevLink = prev
      ? `<a href="#" class="pager-navigation" onclick="getPage(getCurrentPage(), document.getElementById('searchSite').value,'${prev.href}')">Prev</a>`
      : `<span class="pager-navigation disabled">Prev</span>`;
    let nextLink = next
      ? `<a href="#" class="pager-navigation" onclick="getPage(getCurrentPage(), document.getElementById('searchSite').value,'${next.href}')">Next</a>`
      : `<span class="pager-navigation disabled">Next</span>`;

    $('#pagination').html(`${prevLink}  ${nextLink}`);
  }

  /* add record count */
  $('#totalItems').html(recordCount);
}

/**
 * Return the total record count via the Drupal API and store the results in a cookie
 * JSON:API has a limit of 50 records
 * @param page {string} current page
 * @return {int} total record count
 */
function getTotalRecordCount(page) {
  let recordCount = getCookie(page);
  let urlForTotal = null;

  if (!recordCount) {
    switch (page) {
      case 'courses':
        urlForTotal = API_Course_Count;
        break;
      case 'companies':
        urlForTotal = API_Company_Count;
        break;
      case 'projects':
        urlForTotal = API_Project_Count;
    }
  }

  /* fetch total or use the cookie value */
  if (urlForTotal) {
    fetch(urlForTotal)
      .then((resp) => {
        return resp.ok ? resp.json() : Promise.reject(resp.statusText);
      })
      .then((document) => {
        recordCount = document.length;
        setCookie(page, recordCount, 1);
      });
  }
  return recordCount;
}

/**
 * Set page message
 * @param msg {string} message text
 */
const setPageMessage = (msg) => {
  document.getElementById('msg').innerHTML = `(${msg})`;
};

/**
 * Get current page - defaults to "about"
 * @return {string} name of page
 */
const getCurrentPage = () => {
  if (location.pathname.includes('/index.html')) {
    return 'about';
  }

  if (location.pathname.includes('/companies.html')) {
    return 'companies';
  }

  if (location.pathname.includes('/courses.html')) {
    return 'courses';
  }

  if (location.pathname.includes('/projects.html')) {
    return 'projects';
  }
  // default
  return 'about';
};

/**
 * Get current page when the resources are loaded
 */
window.onload = () => {
  getPage(getCurrentPage());
};

/**
 * Cookies
 */
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

'use strict';

const API_base = 'https://chriscorchado.com/drupal8';
//const inputSearchBox = document.getElementById('searchSite')! as HTMLInputElement;
const pageLimit = 50;

/* Hide container and load navigation/footer */
$('.container').hide();
$('#navigation').load('includes/nav.html');
$('#footer').load('includes/footer.html');

/**
 * Load page
 * @param {string} page - page name
 * @param {string=} search - (optional) - search string
 * @param {string=} pagingURL - (optional) - Prev/Next links
 */
async function getPage(page: string, search?: string, pagingURL?: string) {
  let data = null;
  const inputSearchBox = document.getElementById('searchSite')! as HTMLInputElement;

  $('#preloader').show();
  $('.container').hide();

  if (search) {
    ga('send', 'pageview', location.pathname + '?search=' + inputSearchBox.value);
  }

  if (page == 'contact') {
    /* get the feedback form and javascript from the Drupal 8 site */

    await fetch(`${API_base}/contact/feedback`)
      .then((resp) => {
        return resp.ok ? resp.text() : Promise.reject(resp.statusText);
      })
      .then((document) => {
        /* get the HTML and update the URLs from relative to absolute */
        data = document.substr(0, document.indexOf('</html>') + 8);
        data = data.replace(/\/drupal8/g, API_base);

        /* get form */
        let form = data.substr(data.indexOf('<form'), data.indexOf('</form>'));
        form = form.substr(0, form.indexOf('</form>') + 8);

        /* replace form name and email label text */
        form = form.replace('Your name', 'Name');
        form = form.replace('Your email address', 'Email');

        /* add 'searchBtn' class to the submit button */
        form = form.replace(
          'class="button button--primary js-form-submit form-submit"',
          'class="button button--primary js-form-submit form-submit searchBtn"'
        );

        /* get scripts */
        let script = data.substr(
          data.indexOf(
            '<script type="application/json" data-drupal-selector="drupal-settings-json">'
          ),
          data.indexOf('js"></script>')
        );
        script = script.substr(0, script.indexOf('</script>') + 9);

        /* show form or submitted message */
        if (location.toString().indexOf('submitted') !== -1) {
          data = '<h2>Thanks for the Feedback</h2>';
          data += '<div id="countdown"></div>';
        } else {
          data = `<h1>Contact</h1>${form} ${script}`;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    renderPage(data, page);

    return false;
  } else {
    if (pagingURL) {
      data = await getData(pagingURL);
    } else {
      switch (page) {
        case 'about':
          data = await getData(
            `${API_base}/jsonapi/node/page?fields[node--page]=id,title,body&filter[id][operator]=CONTAINS&filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe`
          );
          break;
        case 'companies':
          if (search) {
            data = await getData(
              `${API_base}/jsonapi/node/company?filter[or-group][group][conjunction]=OR&filter[field_company_name][operator]=CONTAINS&filter[field_company_name][value]=${search}&filter[field_company_name][condition][memberOf]=or-group&filter[field_job_title][operator]=CONTAINS&filter[field_job_title][value]=${search}&filter[field_job_title][condition][memberOf]=or-group&filter[body.value][operator]=CONTAINS&filter[body.value][value]=${search}&filter[body.value][condition][memberOf]=or-group&sort=-field_end_date&include=field_company_screenshot&page[limit]=${pageLimit}`
            );
          } else {
            data = await getData(
              `${API_base}/jsonapi/node/company?sort=-field_end_date&include=field_company_screenshot&page[limit]=${pageLimit}`
            );
          }
          break;
        case 'courses':
          if (search) {
            data = await getData(
              `${API_base}/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=${search}&filter[title][condition][memberOf]=or-group&filter[field_award_date][operator]=CONTAINS&filter[field_award_date][value]=${search}&filter[field_award_date][condition][memberOf]=or-group&sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=${pageLimit}`
            );
          } else {
            data = await getData(
              `${API_base}/jsonapi/node/awards?sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=${pageLimit}`
            );
          }
          break;
        case 'projects':
          if (search) {
            data = await getData(
              `${API_base}/jsonapi/node/project?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=${search}&filter[title][condition][memberOf]=or-group&filter[taxonomy_term--tags][path]=field_project_technology.name&filter[taxonomy_term--tags][operator]=CONTAINS&filter[taxonomy_term--tags][value]=${search}&filter[taxonomy_term--tags][condition][memberOf]=or-group&filter[field_company.title][operator]=CONTAINS&filter[field_company.title][value]=${search}&filter[field_company.title][condition][memberOf]=or-group&filter[field_screenshot.meta.alt][operator]=CONTAINS&filter[field_screenshot.meta.alt][value]=${search}&filter[field_screenshot.meta.alt][condition][memberOf]=or-group&filter[field_date][operator]=CONTAINS&filter[field_date][value]=${search}&filter[field_date][condition][memberOf]=or-group&sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=${pageLimit}`
            );
          } else {
            data = await getData(
              `${API_base}/jsonapi/node/project?sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=${pageLimit}`
            );
          }
          break;
      }
    }
  }

  /* create object with pagination info */
  let passedInCount = {
    currentCount: document.getElementById('lastCount')
      ? document.getElementById('lastCount').textContent
      : 1,
  };

  data = { ...data, passedInCount };

  if (data.data.length) {
    renderPage(data, page, search, data.links.next, data.links.prev);
  } else {
    updateInterface(search);
  }
}

/**
 * Render UI
 * @param {string=} search - (optional) searched for text
 */
const updateInterface = (search?: string) => {
  let action = 'none';

  if (!search) {
    action = '';
    document.getElementById('searchBtn').style.display = '';
  }

  if (document.getElementById('preloader')) {
    document.getElementById('preloader').style.display = action;
  }
  if (document.getElementById('searchCount')) {
    document.getElementById('searchCount').style.display = action;
  }
  if (document.getElementById('paging-info')) {
    document.getElementById('paging-info').style.display = action;
  }
  if (document.getElementById('pagination')) {
    document.getElementById('pagination').style.display = action;
  }
  if (document.getElementById('msg')) {
    document.getElementById('msg').style.display = action;
  }

  if (!$('#noRecords').html() && search) {
    $('body').append(
      `<div id="noRecords" class="shadow">No matches found for '${search}'</div>`
    );
  }
};

/**
 * Get data from Drupal 8 datastore
 * @param {string} dataURL - url to fetch data from
 * @return {object} - object of data
 */
const getData = (dataURL: string) => {
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
  let timeout = 0;
  const inputSearchBox = document.getElementById('searchSite')! as HTMLInputElement;

  inputSearchBox.addEventListener('keyup', function (e) {
    
    if(!inputSearchBox.value){
      updateInterface();
    }

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      getPage(getCurrentPage(), inputSearchBox.value);

      document.getElementById('searchBtn').style.display = 'inline-block';
    }, 500);
  });
}

/**
 * Clear current search
 */
const searchClear = () => {
  const inputSearchBox = document.getElementById('searchSite')! as HTMLInputElement;
  if (inputSearchBox.value !== '') {
    $('#noRecords').hide();
    inputSearchBox.value = '';
    getPage(getCurrentPage());
    updateInterface();
  }
};

/**
 * Filter what a user is allowed to enter in the search field
 * Only allow searching with a-Z, 0-9 and spaces
 * @param {KeyboardEvent} event - key event
 * @return {string} - allowed characters
 */
const searchFilter = (event: KeyboardEvent) => {

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
 * @param {string} itemToHighlight - string to search
 * @param {string} searchedFor - string to search for
 * @return {string} - search result with/without highlight
 */
const itemWithSearchHighlight = (itemToHighlight: string, searchedFor: string) => {
  let dataToReturn = '';

  if (searchedFor) {
    let searchTerm = new RegExp(searchedFor, 'gi');
    let results = '';

    let searchString = '';
    let searchStringArray = [];

    if (itemToHighlight && +itemToHighlight !== -1) {
      searchString = itemToHighlight.replace('&amp;', '&').replace('&#039;', "'");
    }

    /* check for HTML
     * TODO: use entities within Drupal to avoid adding body content with HTML
     */
    if (searchString.indexOf('<ul>') !== -1) {
      let listItem = '';

      // remove ul tags and break the li items into an array
      let searchWithHTML = searchString.replace('<ul>', '').replace('</ul>', '');

      searchStringArray = searchWithHTML.split('<li>');

      searchStringArray.forEach((element) => {
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
 * Create the countdown after submitting the contact form
 */
let seconds = 5;
const showCountDown = () => {
  seconds -= 1;
  document.getElementById(
    'countdown'
  ).innerHTML = `<h4>You will be redirect to the homepage in ${seconds} seconds.</h4><img id="timer" src="https://chriscorchado.com/images/timer.gif" />`;
};

/**
 * Create HTML for page
 * @param {object[]} data - page items
 * @param {string} page - page name
 * @param {string=} searchedFor - (Optional) - search string
 * @param {Object=} next - (Optional) - page name
 * @param {Object=} prev - (Optional) - search string
 */
const renderPage = (
  data: Object[],
  page: string,
  searchedFor?: string,
  next?: Object,
  prev?: Object
) => {
  if (page == 'contact') {
    $('#contact-link').addClass('nav-item-active');
    $('.container').html(data.toString()).fadeIn(300);

    document.getElementById('profiles').style.display = 'none';
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('preloader').style.display = 'none';

    /* foward to the homepage after submission */
    let loc = location.toString().indexOf('contact.html?submitted');
    if (loc !== -1) {
      setInterval(showCountDown, 1000);

      /* get the homepage url and forward to it after ${seconds} */
      setTimeout(function () {
        window.location.replace(location.toString().substr(0, loc));
      }, seconds * 1000);
    } else {
      $('#edit-name').focus();
    }
    return false;
  }

  let screenshotCount = 0,
    imgAltCount = 0,
    itemCount = 0;

  let imgPieces = [''];

  let item = '',
    itemBody = '',
    currentNavItem = '',
    itemGridClass = '',
    itemTitle = '',
    itemDate = '',
    startDate = '',
    endDate = '',
    itemJobTitle = '',
    itemTechnology = '',
    itemCompanyName = '',
    itemWorkType = '',
    itemPDF = '',
    section = '',
    projectImage = '',
    aboutBody = '',
    aboutProfiles = '';

  let newDate = new Date();

  // add border to logo and hide search box on About page
  if (page == 'about') {
    document.getElementById('search-container').style.display = 'none';

    document.getElementById('logo').getElementsByTagName('img')[0].style.border =
      '1px dashed #7399EA';
  }

  $('#noRecords').remove();

  data.data.forEach((element: any) => {
    itemTitle = element.attributes.title;
    itemBody = element.attributes.body ? element.attributes.body.value : '';
    itemDate = element.attributes.field_date || element.attributes.field_award_date;
    itemJobTitle = element.attributes.field_job_title;
    startDate = element.attributes.field_start_date;
    endDate = element.attributes.field_end_date;
    itemWorkType = element.attributes.field_type = 'full' ? 'Full-Time' : 'Contract';

    itemTechnology = '';
    imgPieces = [];

    if (data.included) {
      data.included.forEach((included_element: Array[string]) => {
        /* get Courses screenshot filenames */
        if (element.relationships.field_award_images) {
          if (
            element.relationships.field_award_images.data[0].id == included_element.id
          ) {
            imgPieces.push(included_element.attributes.filename);
          }
        }

        /* get Courses PDF filenames */
        if (
          element.relationships.field_award_pdf &&
          element.relationships.field_award_pdf.data.id == included_element.id
        ) {
          itemPDF = included_element.attributes.filename;
        }

        /* get Company screenshot filenames */
        if (element.relationships.field_company_screenshot) {
          if (
            element.relationships.field_company_screenshot.data.some(
              (field_screenshot: Array[string]) =>
                field_screenshot.id == included_element.id
            )
          ) {
            imgPieces.push(included_element.attributes.filename);
          }
        }

        /* get Company name */
        if (element.relationships.field_screenshot) {
          if (element.relationships.field_company.data.id == included_element.id) {
            itemCompanyName = included_element.attributes.field_company_name;
          }

          /* get Project screenshot filenames */
          if (
            element.relationships.field_screenshot.data.some(
              (field_screenshot: Array[string]) =>
                field_screenshot.id == included_element.id
            )
          ) {
            imgPieces.push(included_element.attributes.filename);
          }

          /* get technology names */
          if (
            element.relationships.field_project_technology.data.some(
              (technology: Array[string]) => technology.id == included_element.id
            )
          ) {
            itemTechnology += included_element.attributes.name + ', ';
          }
        }
      });
    } // if data_included

    /* get dates */
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

    /* Work History Dates - month and year*/
    if (startDate) {
      newDate = new Date(startDate);
      startDate =
        newDate.toLocaleString('default', { month: 'long' }) +
        ' ' +
        newDate.getFullYear();
    }

    if (endDate) {
      newDate = new Date(endDate);
      endDate =
        newDate.toLocaleString('default', { month: 'long' }) +
        ' ' +
        newDate.getFullYear();
    }

    if (page == 'about') {
      let aboutData = element.attributes.body.value.toString().split('<hr />');
      aboutBody = aboutData[0];
      aboutProfiles = aboutData[1];
    }

    itemTitle = itemTitle.replace('&amp;', '&');

    if (searchedFor) {
      /* TODO pass in array[itemTitle, itemDate, etc..] and searchedFor then destructure */
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
        item += aboutBody;

        document.getElementById('profiles').innerHTML = aboutProfiles;
        break;
      case 'companies':
        currentNavItem = 'companies-link';

        item += `<div class="company-container col shadow">`;
        item += `<div class="company-name">${itemTitle}</div>`;
        item += `<div class="company-job-title">${itemJobTitle}</div>`;

        item += `<div class="body-container">${itemBody}</div>`;

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

        item += `<div class="body-container">${itemBody}</div>`;

        /* Screenshot Section */
        if (imgPieces) {
          screenshotCount = +imgPieces.length;

          itemGridClass = 'project-item-grid';

          if (screenshotCount === 2) {
            itemGridClass = 'project-items2 project-item-grid';
          }
          if (screenshotCount === 1) {
            itemGridClass = 'project-items1 project-item-grid';
          }

          section = `<section data-featherlight-gallery data-featherlight-filter="a" class="${itemGridClass}">`;

          let screenshotAlt = Array<[]>;
          element.relationships.field_screenshot.data.forEach((screenshot: Array<[]>) => {
            screenshotAlt.push(screenshot.meta.alt);
          });

          imgAltCount = 0; // reset
          imgPieces.forEach((img) => {
            projectImage = getFullUrlByPage(img, page);

            section += `<div class="project-item shadow">`;

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
          element.attributes.field_video_url.forEach((img: string) => {
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
  }

  setItemCount(itemCount, page, data.passedInCount.currentCount, prev, next);
};

/**
 * Create absolute link
 * @param {string} linkToFix - relative url
 * @param {string} page - page name
 * @return {string} - absolute url
 */
const getFullUrlByPage = (linkToFix: string, page: string) => {
  switch (page) {
    case 'companies':
      return `${API_base}/sites/default/files/company-screenshot/${linkToFix}`;
      break;
    case 'courses':
      if (linkToFix.indexOf('.pdf') !== -1) {
        return `${API_base}/sites/default/files/award-pdf/${linkToFix}`;
      } else {
        return `${API_base}/sites/default/files/award-images/${linkToFix}`;
      }
      break;
    case 'projects':
      return `${API_base}/sites/default/files/project-screenshot/${linkToFix}`;
      break;
  }
};

/**
 * Set/update the current page item counts
 * @param {int} count - number of items
 * @param {string} page - page name
 * @param {int} paginationTotal - last pagination value
 * @param {object=} prev - (optional) - link to previous results
 * @param {object=} next - (optional) - link to next results

 */
function setItemCount(
  count: number,
  page: string,
  paginationTotal: number,
  prev?: object,
  next?: object
) {
  let dataOffset = 0;
  let dataOffsetText = '';
  let prevLink = null;
  let nextLink = null;

  if (next) {
    let nextURL = next.href
      .replace(/%2C/g, ',')
      .replace(/%5B/g, '[')
      .replace(/%5D/g, ']');

    dataOffset = nextURL.substring(
      nextURL.search('offset') + 8,
      nextURL.search('limit') - 6
    );
  }

  /* handle searching  */
  if ($('#searchSite').val()) {
    dataOffsetText = `${count} ${count == 1 ? 'Item' : 'Items'} `;
    if (count <= pageLimit) {
      $('#searchCount').html(count + `  ${count == 1 ? 'Item' : 'Items'}`);
    } else {
      $('#searchCount').html(pageLimit + `  ${+pageLimit == 1 ? 'Item' : 'Items'}`);
    }
  }

  /* to paginate or not to paginate! */
  if (!next && !prev) {
    document.getElementById(
      'searchCount'
    ).innerHTML = `<span id="totalItems">${count}</span>
   ${count == 1 ? 'Item' : 'Items'}`;
  } else {
    let currentCount = +dataOffset / pageLimit;

    /* generate first page item counts*/
    if (count == dataOffset) {
      dataOffsetText = `Items 1-<span id="lastCount">${pageLimit}</span>`;
    } else {
      /* generate middle pages item counts*/
      if (currentCount !== 0) {
        dataOffsetText = `Items ${
          currentCount * pageLimit - pageLimit
        }-<span id="lastCount">${currentCount * pageLimit}</span>`;
      } else {
        /* generate last page item counts*/
        dataOffsetText = `Items ${paginationTotal}-<span id="lastCount">${
          +paginationTotal + count
        }</span>`;
      }
    }
    /* add item counts to page */
    document.getElementById(
      'searchCount'
    ).innerHTML = `<span id="paging-info">${dataOffsetText}</span>`;

    prevLink = prev
      ? `<a href="#" class="pager-navigation" onclick="getPage(getCurrentPage(), document.getElementById('searchSite').value,'${prev.href}')">Prev</a>`
      : `<span class="pager-navigation disabled">Prev</span>`;
    nextLink = next
      ? `<a href="#" class="pager-navigation" onclick="getPage(getCurrentPage(), document.getElementById('searchSite').value,'${next.href}')">Next</a>`
      : `<span class="pager-navigation disabled">Next</span>`;
  }

  /* hide pagination when the item count is less than the page limit and on the first page*/
  if (count < pageLimit && paginationTotal === 1) {
    $('#pagination').html('&nbsp;');
  } else {
    $('#pagination').html(`${prevLink}  ${nextLink}`);
  }
}

/**
 * Set page message
 * @param {string} msg - message text
 */
const setPageMessage = (msg: string) => {
  document.getElementById('msg').innerHTML = `(${msg})`;
};

/**
 * Get current page - defaults to "about"
 * @return {string} - page name
 */
const getCurrentPage = () => {
  if (location.pathname.indexOf('/index.html') !== -1) {
    return 'about';
  }

  if (location.pathname.indexOf('/companies.html') !== -1) {
    return 'companies';
  }

  if (location.pathname.indexOf('/courses.html') !== -1) {
    return 'courses';
  }

  if (location.pathname.indexOf('/projects.html') !== -1) {
    return 'projects';
  }

  if (location.pathname.indexOf('/contact.html') !== -1) {
    return 'contact';
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

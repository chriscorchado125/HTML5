'use strict';

const API_BASE = 'https://chriscorchado.com/drupal8';
const pageLimit = 50;

/* Load navigation and footer */
$('#navigation').load('includes/nav.html');
$('#footer').load('includes/footer.html');

/**
 * Show and hide the loading of a page
 * @param {boolean} loadingStatus
 */
function setLoading(loadingStatus: boolean) {
  if (loadingStatus) {
    document.getElementById('preloader').style.display = 'block';
    $('.container').hide();
  } else {
    document.getElementById('preloader').style.display = 'none';
    $('.container').fadeIn(250);
  }
}

/**
 * Load page
 * @param {string} page - page name
 * @param {string=} search - (optional) - search string
 * @param {string=} pagingURL - (optional) - Prev/Next links
 */
async function getPage(page: string, search?: string, pagingURL?: string) {
  let data = null;

  setLoading(true);

  if (search) {
    //ga('send', 'pageview', location.pathname + '?search=' + search);
  }

  if (page == 'contact') {
    /* get the feedback form and javascript from the Drupal 8 site */

    await fetch(`${API_BASE}/contact/feedback`)
      .then((resp) => {
        return resp.ok ? resp.text() : Promise.reject(resp.statusText);
      })
      .then((page) => {
        /* get the HTML and update the URLs from relative to absolute */
        data = page.substr(0, page.indexOf('</html>') + 8);
        data = data.replace(/\/drupal8/g, API_BASE);

        /* get form */
        let form = data.substr(data.indexOf('<form'), data.indexOf('</form>'));
        form = form.substr(0, form.indexOf('</form>') + 8);

        /* replace the form email label text */
        form = form.replace('Your email address', 'Email');

        /* get scripts */
        let script = data.substr(
          data.indexOf(
            '<script type="application/json" data-drupal-selector="drupal-settings-json">'
          ),
          data.indexOf('></script>')
        );
        script = script.substr(0, script.indexOf('</script>') + 9);

        /* show form or submitted message */
        if (location.toString().indexOf('submitted') !== -1) {
          data = '';
        } else {
          data = `<h1>Contact</h1>${form} ${script}`;
        }
      })
      .catch((error) => {
        alert(`Sorry an error has occurred: ${error}`);
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
            `${API_BASE}/jsonapi/node/page?fields[node--page]=id,title,body&filter[id][operator]=CONTAINS&filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe`
          );
          break;
        case 'companies':
          if (search) {
            data = await getData(
              `${API_BASE}/jsonapi/node/company?filter[or-group][group][conjunction]=OR&filter[field_company_name][operator]=CONTAINS&filter[field_company_name][value]=${search}&filter[field_company_name][condition][memberOf]=or-group&filter[field_job_title][operator]=CONTAINS&filter[field_job_title][value]=${search}&filter[field_job_title][condition][memberOf]=or-group&filter[body.value][operator]=CONTAINS&filter[body.value][value]=${search}&filter[body.value][condition][memberOf]=or-group&sort=-field_end_date&include=field_company_screenshot&page[limit]=${pageLimit}`
            );
          } else {
            data = await getData(
              `${API_BASE}/jsonapi/node/company?sort=-field_end_date&include=field_company_screenshot&page[limit]=${pageLimit}`
            );
          }
          break;
        case 'courses':
          if (search) {
            data = await getData(
              `${API_BASE}/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=${search}&filter[title][condition][memberOf]=or-group&filter[field_award_date][operator]=CONTAINS&filter[field_award_date][value]=${search}&filter[field_award_date][condition][memberOf]=or-group&sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=${pageLimit}`
            );
          } else {
            data = await getData(
              `${API_BASE}/jsonapi/node/awards?sort=-field_award_date&include=field_award_pdf,field_track_image,field_award_images&page[limit]=${pageLimit}`
            );
          }
          break;
        case 'projects':
          if (search) {
            data = await getData(
              `${API_BASE}/jsonapi/node/project?filter[or-group][group][conjunction]=OR&filter[title][operator]=CONTAINS&filter[title][value]=${search}&filter[title][condition][memberOf]=or-group&filter[taxonomy_term--tags][path]=field_project_technology.name&filter[taxonomy_term--tags][operator]=CONTAINS&filter[taxonomy_term--tags][value]=${search}&filter[taxonomy_term--tags][condition][memberOf]=or-group&filter[field_company.title][operator]=CONTAINS&filter[field_company.title][value]=${search}&filter[field_company.title][condition][memberOf]=or-group&filter[field_screenshot.meta.alt][operator]=CONTAINS&filter[field_screenshot.meta.alt][value]=${search}&filter[field_screenshot.meta.alt][condition][memberOf]=or-group&filter[field_date][operator]=CONTAINS&filter[field_date][value]=${search}&filter[field_date][condition][memberOf]=or-group&sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=${pageLimit}`
            );
          } else {
            data = await getData(
              `${API_BASE}/jsonapi/node/project?sort=-field_date&include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&page[limit]=${pageLimit}`
            );
          }
          break;
      }
    }
  }

  /* create object with current pagination count to append to data */
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

  /* update menu via API */
  updateMenuPages(page, 'navbar-nav');
}

/**
 * Show/Hide UI elements
 * @param {string=} search - (optional) searched for text
 */
const updateInterface = (search?: string) => {
  let action = 'none';

  if (!search) {
    action = '';
    document.getElementById('searchBtn').style.display = '';
  }

  let uiElements = ['preloader', 'searchCount', 'paging-info', 'pagination', 'msg'];

  uiElements.forEach((element) => {
    if (document.getElementById(element)) {
      document.getElementById(element).style.display = action;
    }
  });

  if (!$('#noRecords').html() && search) {
    $('body').append(
      `<div id="noRecords" class="shadow">No matches found for '${search}'</div>`
    );
  }
};

/**
 * Get data from Drupal 8 datastore
 * @param {string} dataURL - url to fetch data from
 * @return {Object} - object of data
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
const searchData = () => {
  let timeout: any = 0;
  const inputSearchBox = document.getElementById('searchSite')! as HTMLInputElement;

  inputSearchBox.addEventListener('keyup', function (e) {
    if (!inputSearchBox.value) {
      updateInterface();
    }

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      getPage(getCurrentPage(), inputSearchBox.value);
    }, 500);
  });
};

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
  document.getElementById('contact').style.padding = '50px';
  document.getElementById('contact').innerHTML = `
    <h2>Thanks for the Feedback</h2>
    <h4>You will be redirected to the homepage in ${seconds} seconds.</h4><img id="timer" src="https://chriscorchado.com/images/timer.gif" />`;
};

/**
 * Change date to month as text plus the 4 digit year
 * @param {string} dateString - date value
 * @return {string} - month and year - example: January 2020
 */
const getMonthYear = (dateString: string) => {
  let newDate = new Date(dateString);

  return (
    newDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    newDate.getFullYear().toString()
  );
};

/**
 * Create HTML for page
 * @param {Object[]} data - page items
 * @param {string} page - page name
 * @param {string=} searchedFor - (Optional) - search string
 * @param {Object=} next - (Optional) - page name
 * @param {Object=} prev - (Optional) - search string
 */
const renderPage = (
  data: any,
  page: string,
  searchedFor?: string,
  next?: Object,
  prev?: Object
) => {
  if (document.getElementById('noRecords')) {
    document.getElementById('noRecords').style.display = 'none';
  }

  // add border to logo and hide search box on About page (homepage)
  if (page == 'about') {
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('profiles').style.display = 'block';

    document.getElementById('logo').getElementsByTagName('img')[0].style.border =
      '1px dashed #7399EA';
  }

  /* show the form or the thank you screen after submission which fowards to the homepage  */
  if (page == 'contact') {
    $('.container').html(data.toString());

    setLoading(false);

    let loc = location.toString().indexOf('contact.html?submitted');
    if (loc !== -1) {
      setInterval(showCountDown, 1000);

      /* get the homepage url and forward to it after ${seconds} */
      setTimeout(function () {
        window.location.replace(location.toString().substr(0, loc));
      }, seconds * 1000);
    } else {
      $('#contact-link').addClass('nav-item-active');

      //capture current site
      const webLocation = document.getElementById(
        'edit-field-site-0-value'
      )! as HTMLInputElement;

      webLocation.value = location.toString();

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
    itemTechnologyIcon = '',
    itemCompanyName = '',
    itemWorkType = '',
    itemPDF = '',
    itemTrackImage = '',
    section = '',
    projectImage = '';

  let pageIsSearchable = false;

  let includedAssetFilename = [''];
  let includedCompanyName = [''];
  let includedTechnologyName = [''];
  let includedTechnologyIcon = [''];
  let includedTechnologyItem = [{}];

  if (data.included) {
    data.included.forEach((included_element: any) => {
      //
      if (included_element.attributes.description) {
        // extract image URL within quotes
        let iconFileNamePath = /"(.*?)"/.exec(
          included_element.attributes.description.value
        );
        includedTechnologyIcon[included_element.id] = iconFileNamePath[1];
      }

      if (included_element.attributes.filename) {
        includedAssetFilename[included_element.id] = included_element.attributes.filename;
      }

      if (included_element.attributes.field_company_name) {
        includedCompanyName[included_element.id] =
          included_element.attributes.field_company_name;
      }

      if (included_element.attributes.name) {
        includedTechnologyName[included_element.id] = included_element.attributes.name;
      }
    });
  }

  data.data.forEach((element: any) => {
    itemTitle = element.attributes.title;
    itemBody = element.attributes.body ? element.attributes.body.value : '';
    itemDate = element.attributes.field_date || element.attributes.field_award_date;
    itemJobTitle = element.attributes.field_job_title;
    startDate = element.attributes.field_start_date;
    endDate = element.attributes.field_end_date;
    itemWorkType = element.attributes.field_type == 'full' ? 'Full-Time' : 'Contract';
    itemTechnology = '';
    itemTrackImage = '';
    imgPieces = [];
    includedTechnologyItem = [];

    if (element.relationships) {
      /* get Courses screenshot filenames */
      if (
        element.relationships.field_award_images &&
        element.relationships.field_award_images.data
      ) {
        imgPieces.push(
          includedAssetFilename[element.relationships.field_award_images.data[0].id]
        );
      }

      /* get Courses PDF filenames */
      if (
        element.relationships.field_award_pdf &&
        element.relationships.field_award_pdf.data
      ) {
        itemPDF = includedAssetFilename[element.relationships.field_award_pdf.data.id];
      }

      /*get Courses Track image filename */
      if (
        element.relationships.field_track_image &&
        element.relationships.field_track_image.data
      ) {
        itemTrackImage =
          includedAssetFilename[element.relationships.field_track_image.data.id];
      }

      /* get Company name */
      if (
        element.relationships.field_company &&
        element.relationships.field_company.data
      ) {
        itemCompanyName =
          includedCompanyName[element.relationships.field_company.data.id];
      }

      /* get Company screenshot filenames */
      if (
        element.relationships.field_company_screenshot &&
        element.relationships.field_company_screenshot.data
      ) {
        imgPieces.push(
          includedAssetFilename[element.relationships.field_company_screenshot.data[0].id]
        );
      }

      /* get Project screenshots filenames */
      if (
        element.relationships.field_screenshot &&
        element.relationships.field_screenshot.data
      ) {
        for (let i = 0; i < element.relationships.field_screenshot.data.length; i++) {
          imgPieces.push(
            includedAssetFilename[element.relationships.field_screenshot.data[i].id]
          );
        }
      }

      /* get Project technology names */
      if (
        element.relationships.field_project_technology &&
        element.relationships.field_project_technology.data
      ) {
        for (
          let i = 0;
          i < element.relationships.field_project_technology.data.length;
          i++
        ) {
          itemTechnology +=
            includedTechnologyName[
              element.relationships.field_project_technology.data[i].id
            ] + ', ';

          itemTechnologyIcon +=
            includedTechnologyIcon[
              element.relationships.field_project_technology.data[i].id
            ] + ', ';

          let technologyItem = {
            name:
              includedTechnologyName[
                element.relationships.field_project_technology.data[i].id
              ],
            image:
              includedTechnologyIcon[
                element.relationships.field_project_technology.data[i].id
              ],
          };

          includedTechnologyItem.push(technologyItem);
        }
      }
    } // if (element.relationships)

    /* get Project and Course dates */
    if (itemDate) {
      if (page == 'projects') {
        itemDate = itemDate.split('-')[0]; // only year
      }

      if (page == 'courses') {
        itemDate = getMonthYear(itemDate);
      }
    }

    /* Work History Dates - month and year*/
    if (startDate) {
      startDate = getMonthYear(startDate);
    }

    if (endDate) {
      endDate = getMonthYear(endDate);
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

        let aboutData = element.attributes.body.value.toString().split('<hr />');
        item = `<h1>${itemTitle}</h1> ${aboutData[0]}`;
        document.getElementById('profiles').innerHTML = aboutData[1]; // resume, linkedin and azure links
        break;
      case 'companies':
        currentNavItem = 'companies-link';
        pageIsSearchable = true;

        item += `<div class="company-container col shadow">

          <div class="company-name">${itemTitle}</div>
          <div class="company-job-title">${itemJobTitle}</div>
          <div class="body-container">${itemBody}</div>

          <div class="screenshot-container">
            <img src=${getFullUrlByPage(
              imgPieces[0],
              page
            )} class="company-screenshot"  alt="${element.title} Screenshot" />
          </div>

          <div class="employment-dates">${startDate} - ${endDate}</div>
        </div>`;

        //item += `<div class="employment-type">${itemWorkType}</div>`;
        break;
      case 'courses':
        currentNavItem = 'courses-link';
        pageIsSearchable = true;

        item += `<div class="course-box box">
          <h2>${itemTitle}</h2>

          <div>
            <img src="${getFullUrlByPage(imgPieces[0], page)}" 
              alt="${itemTitle.replace(/(<([^>]+)>)/gi, '')}" 
              title="${itemTitle.replace(/(<([^>]+)>)/gi, '')}" />
          </div>

          <div class="course-wrapper">

            <span class="course-date">${itemDate}</span>

            <span class="course-links">
              <a href="${getFullUrlByPage(itemPDF, page)}" target="_blank">
                <img src="https://chriscorchado.com/images/pdfIcon.jpg" height="25" title="View the PDF Certificate" />
              </a>
            </span>`;

        // TODO: Create bigger version and add to content type
        //  item += `<span class="course-links">
        //   <a href="${getFullUrlByPage(imgPieces[0], page)}" data-featherlight="image">
        //   <img src="https://chriscorchado.com/images/jpg_icon.png" height="25" title="View the Certificate" />
        //   </a></span>`;

        if (itemTrackImage) {
          item += `<span class="course-links">
              <a href="${getFullUrlByPage(
                itemTrackImage,
                page
              )}" data-featherlight="image">
                <img src="https://chriscorchado.com/images/linkedIn-track.png" height="25" title="View the Courses in the Track" />
              </a>
            </span>`;
        }

        item += `</div></div>`; //course-box box
        break;

      case 'projects':
        currentNavItem = 'projects-link';
        pageIsSearchable = true;

        item += `<div class="project col">
        <div class="project-title">${itemTitle}</div>
        <div class="project-company">${itemCompanyName} <span class="project-date">(${itemDate})</span></div> 
        <div class="body-container">${itemBody}</div>`;

        /* Screenshot Section */
        if (imgPieces) {
          screenshotCount = +imgPieces.length;

          itemGridClass = `project-item-grid project-items${screenshotCount}`;

          section = `<section data-featherlight-gallery data-featherlight-filter="a" class="${itemGridClass}">`;

          let screenshotAlt = new Array();
          element.relationships.field_screenshot.data.forEach((screenshot: any) => {
            screenshotAlt.push(screenshot.meta.alt);
          });

          imgAltCount = 0; // reset
          imgPieces.forEach((img) => {
            projectImage = getFullUrlByPage(img, page);

            section += `<div class="project-item shadow">
            
              <a href=${projectImage} class="gallery">
                <div class="project-item-desc">${itemWithSearchHighlight(
                  screenshotAlt[imgAltCount],
                  searchedFor
                )}</div>
                <img src=${projectImage} alt=${screenshotAlt[imgAltCount]} />
              </a>
            </div>`;
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

        item += `<div class="project-technology">${itemTechnology.slice(0, -2)}</div>
        </div>`;

        // item += `<div class="project-technology">`;

        // for (const [key, value] of Object.entries(includedTechnologyItem)) {
        //   item += `<div id="technology-item-wrapper">${value.name}
        //     <img src="${value.image}" class="project-technology-icon" /></div>`;
        // }

        // item += `</div>`;

        setPageMessage('click an image to enlarge it');
        break;
    } // end switch
  }); // data.data forEach

  $('#' + currentNavItem).addClass('nav-item-active');

  if (itemCount > 0) {
    $('.container').html(item);

    if (pageIsSearchable) {
      document.getElementById('search-container').style.display = 'block';
    }

    // @ts-ignore
    $('a.gallery').featherlightGallery({
      previousIcon: '&#9664;' /* Code that is used as previous icon */,
      nextIcon: '&#9654;' /* Code that is used as next icon */,
      galleryFadeIn: 200 /* fadeIn speed when slide is loaded */,
      galleryFadeOut: 300 /* fadeOut speed before slide is loaded */,
    });
  }

  setItemCount(itemCount, data.passedInCount.currentCount, prev, next);

  setLoading(false);
};

/**
 * Create absolute link
 * @param {string} linkToFix - relative url
 * @param {string} page - page name
 * @return {string} - absolute url
 */
const getFullUrlByPage = (linkToFix: string, page: string) => {
  let pathToResource = 'No Path Found';

  switch (page) {
    case 'companies':
      pathToResource = 'company-screenshot';
      break;
    case 'courses':
      if (linkToFix.indexOf('.pdf') !== -1) {
        pathToResource = 'award-pdf';
      } else {
        pathToResource = 'award-images';
      }
      break;
    case 'projects':
      pathToResource = 'project-screenshot';
      break;
  }

  return `${API_BASE}/sites/default/files/${pathToResource}/${linkToFix}`;
};

/**
 * Set/update the current page item counts
 * @param {int} count - number of items
 * @param {int} paginationTotal - last pagination value
 * @param {Object=} prev - (optional) - link to previous results
 * @param {Object=} next - (optional) - link to next results
 */
const setItemCount = (count: number, paginationTotal: number, prev?: any, next?: any) => {
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

  /* Show pagination if there is a next or prev link */
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

    /* configure next and prev links */
    prevLink = prev
      ? `<a href="#" class="pager-navigation" title="View the previous page" onclick="getPage(getCurrentPage(), document.getElementById('searchSite').value,'${prev.href}')">Prev</a>`
      : `<span class="pager-navigation disabled" title="There is no previous page available">Prev</span>`;
    nextLink = next
      ? `<a href="#" class="pager-navigation" title="View the next page" onclick="getPage(getCurrentPage(), document.getElementById('searchSite').value,'${next.href}')">Next</a>`
      : `<span class="pager-navigation disabled" title="There is no next page available">Next</span>`;
  }

  /* hide pagination when the item count is less than the page limit and on the first page */
  if (count < pageLimit && paginationTotal === 1) {
    $('#pagination').hide();
  } else {
    $('#pagination').html(`${prevLink}  ${nextLink}`);
  }
};

/**
 * Set page message
 * @param {string} msg - message text
 */
const setPageMessage = (msg: string) => {
  document.getElementById('msg').innerHTML = `(${msg})`;
  document.getElementById('msg').style.display = 'block';

  setTimeout(function () {
    //document.getElementById('msg').style.display = 'none';
    $('#msg').fadeOut(3000);
  }, 2500);
};

/**
 * Replace static navigation with data from the menu API
 * @param {string} currentPage - page name
 * @param {string} targetContainer - id of html container for the menu items
 */
async function updateMenuPages(currentPage: string, targetContainer: string) {
  await fetch(`${API_BASE}/api/menu_items/main?_format=json`)
    .then((resp) => {
      return resp.ok ? resp.json() : Promise.reject(resp.statusText);
    })
    .then((pageData) => {
      let pageName = '';
      let pageLink = '';

      let homepageStyle = '';
      if (currentPage == 'about') {
        homepageStyle = 'border: 1px dashed rgb(115, 153, 234);';
      }

      let generatedPageLinks = `<a href="index.html" class="navbar-brand" id="logo" style="${homepageStyle}">
        <img src="./images/chriscorchado-initials-logo.png" title="Home" alt="Home">
      </a>`;

      for (let page in pageData) {
        pageName = pageData[page].title;
        if (pageName == 'Home' || pageName == 'About' || !pageData[page].enabled) {
          continue;
        }

        let activeNavItem = '';
        if (currentPage == pageName.toLowerCase()) {
          activeNavItem = 'nav-item-active';
        }

        pageLink = pageName; // capture correct link name before pageName is updated
        if (pageName == 'Companies') pageName = 'History';

        generatedPageLinks += `<a href="${pageLink.toLowerCase()}.html" 
        class="nav-item nav-link ${activeNavItem}" 
        title="${pageName}" 
        id="${pageName.toLowerCase()}-link">${pageName}</a>`;
      }

      document.getElementById(targetContainer).innerHTML = generatedPageLinks;
    })
    .catch((error) => {
      alert(`Sorry an error has occurred: ${error}`);
    });
}

/**
 * Get current page
 * @return {string} - page name
 */
const getCurrentPage = () => {
  //get the page name
  let getCurrentPage = window.location.pathname
    .split('/')
    .filter(function (pathnamePieces) {
      return pathnamePieces.length;
    })
    .pop();

  let pageName = getCurrentPage.split('.')[0];
  if (pageName == 'index' || pageName == 'html5') pageName = 'about';

  return pageName;
};

window.onload = () => {
  getPage(getCurrentPage());
};

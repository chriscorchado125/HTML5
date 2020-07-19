'use strict';

const API_BASE = 'https://chriscorchado.com/drupal8';
const MAX_ITEMS_PER_PAGE = 50;
const SITE_SEARCH_ID = 'searchSite';

$('#navigation').load('includes/nav.html');
$('#footer').load('includes/footer.html');

/**
 * Toggle content and preloader
 * @param {boolean} loadingStatus
 */
function setLoading(loadingStatus: boolean) {
  if (loadingStatus) {
    let preloader = document.createElement('div');

    preloader.innerHTML = `
      <div class="preloadAnimation" id="preloadAnimation">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
        <br />Loading
      </div>`;

    document.body.append(preloader);
  } else {
    document.getElementById('preloadAnimation').remove();
    fadeIn(document.getElementsByClassName('container')[0]);
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
    // ga('send', 'pageview', location.pathname + '?search=' + search);
  }

  if (page == 'contact') {
    await fetch(`${API_BASE}/contact/feedback`) // get the feedback form
      .then((resp) => {
        return resp.ok ? resp.text() : Promise.reject(resp.statusText);
      })
      .then((page) => {
        // generate the contact form as long as it has not been submitted
        if (location.toString().indexOf('submitted') == -1) {
          data = page.replace(/\/drupal8/g, API_BASE); // update the HTML URLs from relative to absolute

          // get the contact form HTML
          let form = data.substr(data.indexOf('<form'), data.indexOf('</form>'));
          form = form.substr(0, form.indexOf('</form>') + 8);

          form = form.replace('Your email address', 'Email');

          // get the contact form JavaScript
          let script = data.substr(
            data.indexOf(
              '<script type="application/json" data-drupal-selector="drupal-settings-json">'
            ),
            data.indexOf('></script>')
          );
          script = script.substr(0, script.indexOf('</script>') + 9);

          data = `<h1>Contact</h1>${form} ${script}`;
        }
      })
      .catch((error) => {
        alert(`Sorry an error has occurred: ${error}`);
      });

    renderPage(data, page);

    setLoading(false);

    return false;
  } else {
    if (pagingURL) {
      data = await getData(pagingURL);
    } else {
      switch (page) {
        case 'about':
          data = await getData(
            `${API_BASE}/jsonapi/node/page?fields[node--page]=id,title,body&
              filter[id][operator]=CONTAINS&
              filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe`
          );
          break;
        case 'companies':
          if (search) {
            data = await getData(
              `${API_BASE}/jsonapi/node/company?filter[or-group][group][conjunction]=OR&
                filter[field_company_name][operator]=CONTAINS&
                filter[field_company_name][value]=${search}&
                filter[field_company_name][condition][memberOf]=or-group&
                filter[field_job_title][operator]=CONTAINS&
                filter[field_job_title][value]=${search}&
                filter[field_job_title][condition][memberOf]=or-group&
                filter[body.value][operator]=CONTAINS&
                filter[body.value][value]=${search}&
                filter[body.value][condition][memberOf]=or-group&
                sort=-field_end_date&
                include=field_company_screenshot&
                page[limit]=${MAX_ITEMS_PER_PAGE}`
            );
          } else {
            data = await getData(
              `${API_BASE}/jsonapi/node/company?sort=-field_end_date&
                include=field_company_screenshot&
                page[limit]=${MAX_ITEMS_PER_PAGE}`
            );
          }
          break;
        case 'courses':
          if (search) {
            data = await getData(
              `${API_BASE}/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&
                filter[title][operator]=CONTAINS&
                filter[title][value]=${search}&
                filter[title][condition][memberOf]=or-group&
                filter[field_award_date][operator]=CONTAINS&
                filter[field_award_date][value]=${search}&
                filter[field_award_date][condition][memberOf]=or-group&
                sort=-field_award_date&
                include=field_award_pdf,field_track_image,field_award_images&
                page[limit]=${MAX_ITEMS_PER_PAGE}`
            );
          } else {
            data = await getData(
              `${API_BASE}/jsonapi/node/awards?sort=-field_award_date&
                include=field_award_pdf,field_track_image,field_award_images&
                page[limit]=${MAX_ITEMS_PER_PAGE}`
            );
          }
          break;
        case 'projects':
          if (search) {
            data = await getData(
              `${API_BASE}/jsonapi/node/project?filter[or-group][group][conjunction]=OR&
              filter[title][operator]=CONTAINS&
              filter[title][value]=${search}&
              filter[title][condition][memberOf]=or-group&
              filter[taxonomy_term--tags][path]=field_project_technology.name&
              filter[taxonomy_term--tags][operator]=CONTAINS&
              filter[taxonomy_term--tags][value]=${search}&
              filter[taxonomy_term--tags][condition][memberOf]=or-group&
              filter[field_company.title][operator]=CONTAINS&
              filter[field_company.title][value]=${search}&
              filter[field_company.title][condition][memberOf]=or-group&
              filter[field_screenshot.meta.alt][operator]=CONTAINS&
              filter[field_screenshot.meta.alt][value]=${search}&
              filter[field_screenshot.meta.alt][condition][memberOf]=or-group&
              filter[field_date][operator]=CONTAINS&filter[field_date][value]=${search}&
              filter[field_date][condition][memberOf]=or-group&
              sort=-field_date&
              include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&
              fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&
              page[limit]=${MAX_ITEMS_PER_PAGE}`
            );
          } else {
            data = await getData(
              `${API_BASE}/jsonapi/node/project?sort=-field_date&
                include=field_project_technology,field_company,field_screenshot&
                fields[node--company]=field_company_name,field_video_url&
                fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&
                page[limit]=${MAX_ITEMS_PER_PAGE}`
            );
          }
          break;
      }
    }
  }

  // create object with the last pagination count or a default of 1
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
 * Toggle the preloader, searchCount, paging-info, pagination and message elements
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

  noRecordsFound('noRecords', search, 'navigation', 'No matches found for');
};

/**
 * Get data
 * @param {string} dataURL - URL to fetch data from
 * @return {Object} - JSON object of data
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
 * Clear current search
 * @param {string} searchTextBoxID - id of search textbox
 */
const searchClear = (searchTextBoxID: string) => {
  const inputSearchBox = document.getElementById(searchTextBoxID)! as HTMLInputElement;
  if (inputSearchBox.value !== '') {
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
 * Highlight search term within a string
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

      let searchWithHTML = searchString.replace('<ul>', '').replace('</ul>', ''); // remove ul tags
      searchStringArray = searchWithHTML.split('<li>'); // break the li items into an array

      searchStringArray.forEach((element) => {
        if (element.length > 3) {
          searchString = element.slice(0, element.lastIndexOf('<')); // remove closing li tag

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
 * After a form is submitted set a thank you message
 * with a countdown that then forward to the homepage
 * @param {number} second - number of seconds to count down
 */
const formSubmitted = (seconds: number) => {
  let countDown = document.createElement('div');
  countDown.style.padding = '50px';

  countDown.innerHTML = `<h2>Thanks For Your Submission</h2>
    <h4>Redirecting to the homepage in <span id="secondCountDown">${seconds}</span> seconds</h4>
    <img id="timer" src="https://chriscorchado.com/images/timer.gif" />`;

  document.getElementsByClassName('container')[0].append(countDown);

  let updateCountDown = setInterval(function () {
    seconds--;
    document.getElementById('secondCountDown').innerHTML = seconds.toString();

    if (seconds === 0) {
      clearInterval(updateCountDown);
      window.location.replace(
        // use replace instead of assign for the sake of history
        location.href.substring(0, location.href.lastIndexOf('/') + 1) // get the base site URL including sub-folder
      );
    }
  }, 1000);
};

/**
 * Change date to name of the month plus the 4 digit year
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
 * Configure the HTML for each page
 * @param {array} values - all item values for the page
 * @return {string} - HTML for the page
 */
const setPageHTML = (values: any) => {
  let page = values[0];
  let data = values[1];
  let itemTitle = values[2];
  let itemJobTitle = values[3];
  let itemBody = values[4];
  let imgPieces = values[5];
  let startDate = values[6];
  let endDate = values[7];
  let itemTrackImage = values[8];
  let itemPDF = values[9];
  let itemDate = values[10];
  let itemCompanyName = values[11];
  let itemTechnology = values[12];
  let searchedFor = values[13];

  switch (page) {
    case 'about': // homepage
      document.getElementById('search-container').style.display = 'none'; // hide search box

      // add a border to the site logo
      document.getElementById('logo').getElementsByTagName('img')[0].style.border =
        '1px dashed #7399EA';

      // TODO: change to a content type vs basic page split
      let aboutData = data.attributes.body.value.toString().split('<hr />');

      document.getElementById('profiles').innerHTML = aboutData[1]; // add resume, linkedin and azure links
      return `<h1>${itemTitle}</h1> ${aboutData[0]}`;

      break;
    case 'contact':
      // form sumitted
      if (location.toString().indexOf('/contact.html?submitted=true') !== -1) {
        formSubmitted(5);
      } else {
        // show the form
        $('.container').html(data.toString());

        $('#contact-link').addClass('nav-item-active');

        // capture the current site URL
        const webLocation = document.getElementById(
          'edit-field-site-0-value'
        )! as HTMLInputElement;

        webLocation.value = location.toString();

        $('#edit-mail').focus();
      }
      break;
    case 'companies':
      return `<div class="company-container col shadow">

          <div class="company-name">${itemTitle}</div>
          <div class="company-job-title">${itemJobTitle}</div>
          <div class="body-container">${itemBody}</div>

          <div class="screenshot-container">
            <img src=${getFullUrlByPage(imgPieces[0], page)} 
            class="company-screenshot" 
            alt="${data.attributes.title} Screenshot" 
            title="${data.attributes.title} Screenshot"/>
          </div>

          <div class="employment-dates">${startDate} - ${endDate}</div>
        </div>`;

      // item += `<div class="employment-type">${itemWorkType}</div>`;
      break;
    case 'courses':
      let item = `<div class="course-box box">
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
                <img src="https://chriscorchado.com/images/pdfIcon.jpg" height="25" 
                title="View the PDF Certificate" alt="View the PDF Certificate"/>
              </a>
            </span>`;

      // TODO: Create bigger version and add to content type
      //  item += `<span class="course-links">
      //   <a href="${getFullUrlByPage(imgPieces[0], page)}" data-featherlight="image">
      //     <img src="https://chriscorchado.com/images/jpg_icon.png" height="25"
      //       title="View the Certificate" alt="View the Certificate"/>
      //   </a></span>`;

      if (itemTrackImage) {
        item += `<span class="course-links">
            <a href="${getFullUrlByPage(itemTrackImage, page)}" data-featherlight="image">
              <img src="https://chriscorchado.com/images/linkedIn-track.png" height="25" 
              title="View the Courses in the Track" alt="View the Courses in the Track" />
            </a>
          </span>`;
      }

      return (item += `</div></div>`); // course-box box
      break;
    case 'projects':
      let imgAltCount = 0;
      item = `<div class="project col">
        <div class="project-title">${itemTitle}</div>
        <div class="project-company">${itemCompanyName} <span class="project-date">(${itemDate})</span></div> 
        <div class="body-container">${itemBody}</div>`;

      // screenshots
      if (imgPieces) {
        let itemGridClass = `project-item-grid project-items${imgPieces.length}`;
        let section = `<section data-featherlight-gallery data-featherlight-filter="a" class="${itemGridClass}">`;

        let screenshotAlt = new Array();
        data.relationships.field_screenshot.data.forEach((screenshot: any) => {
          screenshotAlt.push(screenshot.meta.alt);
        });

        imgAltCount = 0; // reset alt attribute counter
        imgPieces.forEach((img: string) => {
          let projectImage = getFullUrlByPage(img, page);

          section += `<div class="project-item shadow">
            
              <a href=${projectImage} class="gallery">
                <div class="project-item-desc">
                  ${itemWithSearchHighlight(screenshotAlt[imgAltCount], searchedFor)}
                </div>

                <img src=${projectImage} alt=${screenshotAlt[imgAltCount]} 
                  title=${screenshotAlt[imgAltCount]} />
              </a>
            </div>`;
          imgAltCount++;
        });

        section += `</section>`;
        item += section;
      }

      // videos
      if (data.attributes.field_video_url) {
        data.attributes.field_video_url.forEach((img: string) => {
          item += `<a href="${img}" 
          data-featherlight="iframe" 
          data-featherlight-iframe-frameborder="0" 
          data-featherlight-iframe-allowfullscreen="true" 
          data-featherlight-iframe-allow="autoplay; encrypted-media"
          data-featherlight-iframe-style="display:block;border:none;height:85vh;width:85vw;" class="play-video">
            Play Video <img src="images/play_vidoe_icon.png" title="Play Video" alt="Play Video" width="20" />
          </a>`;
        });
      }

      // HTML, CSS, JavaScript, etc..
      item += `<div class="project-technology">${itemTechnology.slice(0, -2)}</div>
      </div>`;

      // Icons for HTML, CSS, JavaScript, etc..
      // item += `<div class="project-technology">`;

      // for (const [key, value] of Object.entries(includedTechnologyItem)) {
      //   item += `<div id="technology-item-wrapper">${value.name}
      //     <img src="${value.image}" class="project-technology-icon" title="${value.name}" alt="${value.name}" /></div>`;
      // }

      // item += `</div>`;

      if (item !== undefined) return item;
      break;
  }
};

/**
 * Handle no records
 * @param {string} noRecordID - id of div to create
 * @param {string} search - searched for text
 * @param {string} appendToID - id of element to append to
 * @param {string} msg - message
 */
const noRecordsFound = (
  noRecordID: string,
  search: string,
  appendToID: string,
  msg: string
) => {
  if (document.getElementById(noRecordID)) {
    document.getElementById(noRecordID).remove();
  }

  if (!document.getElementById(noRecordID) && search) {
    let notFound = document.createElement('div');
    notFound.id = noRecordID;
    notFound.innerHTML = `${msg} '${search}'`;
    document.getElementById(appendToID).appendChild(notFound);
  }
};

/**
 * Generate the webpage
 * @param {Object[]} data - page items
 * @param {string} page - page name
 * @param {string=} searchedFor - (optional) - search string
 * @param {Object=} next - (optional) - link to next page of results
 * @param {Object=} prev - (optional) - link to previous page of the results
 */
const renderPage = (
  data: any,
  page: string,
  searchedFor?: string,
  next?: Object,
  prev?: Object
) => {
  if (page == 'contact') {
    setPageHTML([page, data]);
    return;
  }

  let itemCount = 0;
  let imgPieces = [''];

  let item = '',
    itemBody = '',
    currentNavItem = '',
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
    itemTrackImage = '';

  let pageIsSearchable = false;

  let includedAssetFilename = [''];
  let includedCompanyName = [''];
  let includedTechnologyName = [''];
  let includedTechnologyIcon = [''];
  let includedTechnologyItem = [];

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
      // get course screenshot filename
      if (
        element.relationships.field_award_images &&
        element.relationships.field_award_images.data
      ) {
        imgPieces.push(
          includedAssetFilename[element.relationships.field_award_images.data[0].id]
        );
      }

      // get course PDF filename
      if (
        element.relationships.field_award_pdf &&
        element.relationships.field_award_pdf.data
      ) {
        itemPDF = includedAssetFilename[element.relationships.field_award_pdf.data.id];
      }

      // get course track image filename
      if (
        element.relationships.field_track_image &&
        element.relationships.field_track_image.data
      ) {
        itemTrackImage =
          includedAssetFilename[element.relationships.field_track_image.data.id];
      }

      // get company name
      if (
        element.relationships.field_company &&
        element.relationships.field_company.data
      ) {
        itemCompanyName =
          includedCompanyName[element.relationships.field_company.data.id];
      }

      // get company screenshot filename
      if (
        element.relationships.field_company_screenshot &&
        element.relationships.field_company_screenshot.data
      ) {
        imgPieces.push(
          includedAssetFilename[element.relationships.field_company_screenshot.data[0].id]
        );
      }

      // get project screenshot filename
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

      // get project technology name
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

    // get project and course dates
    if (itemDate) {
      if (page == 'projects') itemDate = itemDate.split('-')[0]; // only the year
      if (page == 'courses') itemDate = getMonthYear(itemDate);
    }

    // get work history dates - month and year
    if (startDate) startDate = getMonthYear(startDate);
    if (endDate) endDate = getMonthYear(endDate);

    itemTitle = itemTitle.replace('&amp;', '&');

    if (searchedFor) {
      // TODO pass in array[itemTitle, itemDate, etc..] and searchedFor then destructure
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

    const allValues = [
      page,
      element,
      itemTitle,
      itemJobTitle,
      itemBody,
      imgPieces,
      startDate,
      endDate,
      itemTrackImage,
      itemPDF,
      itemDate,
      itemCompanyName,
      itemTechnology,
      searchedFor,
    ];

    switch (page) {
      case 'about':
        item = setPageHTML(allValues);
        break;
      case 'companies':
        item += setPageHTML(allValues);
        break;
      case 'courses':
        item += setPageHTML(allValues);
        break;
      case 'projects':
        item += setPageHTML(allValues);
        break;
    }
  }); // data.data forEach

  switch (page) {
    case 'about':
      currentNavItem = 'about-link';
      break;
    case 'companies':
      currentNavItem = 'companies-link';
      pageIsSearchable = true;
      break;
    case 'courses':
      currentNavItem = 'courses-link';
      pageIsSearchable = true;
      break;
    case 'projects':
      currentNavItem = 'projects-link';
      pageIsSearchable = true;
      break;
  }

  $('#' + currentNavItem).addClass('nav-item-active');

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

  setPagination(itemCount, data.passedInCount.currentCount, prev, next);

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
 * Get the current search count
 * @param {number} count - item count
 * @param {string} searchCountID - search count container id
 * @return {string} - item count with either 'Items' or 'Item'
 */
const getSearchCount = (count: number, searchCountID: string) => {
  if ($(`#${SITE_SEARCH_ID}`).val()) {
    if (count <= MAX_ITEMS_PER_PAGE) {
      document.getElementById(searchCountID).innerHTML =
        count + `  ${count == 1 ? 'Item' : 'Items'}`;
    } else {
      document.getElementById(searchCountID).innerHTML =
        MAX_ITEMS_PER_PAGE + `  ${+MAX_ITEMS_PER_PAGE == 1 ? 'Item' : 'Items'}`;
    }

    return `${count} ${count == 1 ? 'Item' : 'Items'} `;
  }
};

/**
 * Get the search item offset
 * @param {link} any - URL
 * @return {number} - offset number
 */
const getSearchOffset = (link: any) => {
  let nextURL = link.href.replace(/%2C/g, ',').replace(/%5B/g, '[').replace(/%5D/g, ']');
  return nextURL.substring(nextURL.search('offset') + 8, nextURL.search('limit') - 6);
};

/**
 * Setup pagination
 * @param {int} count - number of items
 * @param {int} paginationTotal - last pagination value
 * @param {Object=} prev - (optional) - link to previous results
 * @param {Object=} next - (optional) - link to next results
 */
const setPagination = (
  count: number,
  paginationTotal: number,
  prev?: any,
  next?: any
) => {
  let dataOffset = 0;
  let prevLink = '';
  let nextLink = '';

  if (next) dataOffset = getSearchOffset(next);

  let dataOffsetText = getSearchCount(count, 'searchCount');

  // if there is a next or prev link then show the pagination
  if (!next && !prev) {
    document.getElementById(
      'searchCount'
    ).innerHTML = `<span id="totalItems">${count}</span>
   ${count == 1 ? 'Item' : 'Items'}`;
  } else {
    let currentCount = +dataOffset / MAX_ITEMS_PER_PAGE;

    // first page item count
    if (count == dataOffset) {
      dataOffsetText = `Items 1-<span id="lastCount">${MAX_ITEMS_PER_PAGE}</span>`;
    } else {
      // middle pages item counts
      if (currentCount !== 0) {
        dataOffsetText = `Items ${
          currentCount * MAX_ITEMS_PER_PAGE - MAX_ITEMS_PER_PAGE
        }-<span id="lastCount">${currentCount * MAX_ITEMS_PER_PAGE}</span>`;
      } else {
        // last page item count
        dataOffsetText = `Items ${paginationTotal}-<span id="lastCount">${
          +paginationTotal + count
        }</span>`;
      }
    }

    // add item counts to the page
    document.getElementById(
      'searchCount'
    ).innerHTML = `<span id="paging-info">${dataOffsetText}</span>`;

    // configure next and prev links
    prevLink = prev
      ? `<a href="#" class="pager-navigation" title="View the previous page" 
          onclick="getPage(getCurrentPage(), document.getElementById('${SITE_SEARCH_ID}').value,'${prev.href}')">Prev</a>`
      : `<span class="pager-navigation disabled" title="There is no previous page available">Prev</span>`;
    nextLink = next
      ? `<a href="#" class="pager-navigation" title="View the next page" 
          onclick="getPage(getCurrentPage(), document.getElementById('${SITE_SEARCH_ID}').value,'${next.href}')">Next</a>`
      : `<span class="pager-navigation disabled" title="There is no next page available">Next</span>`;
  }

  // hide pagination when the item count is less than the page limit and on the first page
  if (count < MAX_ITEMS_PER_PAGE && paginationTotal === 1) {
    $('#pagination').hide();
  } else {
    $('#pagination').html(`${prevLink}  ${nextLink}`);
  }
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
 * Get the current page name
 * @return {string} - page name
 */
const getCurrentPage = () => {
  let thisPage = window.location.pathname
    .split('/')
    .filter(function (pathnamePieces) {
      return pathnamePieces.length;
    })
    .pop();

  let pageName = thisPage.split('.')[0];
  if (pageName == 'index' || pageName == 'html5') pageName = 'about';

  return pageName;
};

/**
 * Debounce search requests in order to improve performance
 * @param {any} function
 * @param {number} wait - time to wait in milliseconds before invoking search
 * @return {function} - as long as it continues to be invoked the function will not be triggered.
 */
const debounce = (func: any, wait: number) => {
  let timeout: any;

  return function executedFunction(...args: any) {
    // callback to be executed
    const later = () => {
      timeout = null; // indicate the debounce ended
      func(...args); // execute the callback
    };

    clearTimeout(timeout); // on every function execution
    timeout = setTimeout(later, wait); // restart the waiting period timeout
  };
};

/**
 * Triggered on the keyup event within search input box
 */
const debounceMe = debounce(() => {
  const inputSearchBox = document.getElementById(SITE_SEARCH_ID)! as HTMLInputElement;

  getPage(getCurrentPage(), inputSearchBox.value);

  if (!inputSearchBox.value) updateInterface();
}, 500);

/**
 * Pure JS fade in using opacity
 * @param {any} HTML element
 */
function fadeOut(el: any) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

/**
 * Pure JS fade out using opacity
 * @param {any} HTML element
 */
function fadeIn(el: any) {
  el.style.opacity = 0;

  (function fade() {
    var val = parseFloat(el.style.opacity);

    if (!((val += 0.1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

window.onload = () => {
  getPage(getCurrentPage());
};

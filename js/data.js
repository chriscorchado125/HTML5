var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as utilityJS from './utilities.js';
import * as searchJS from './search.js';
import { formSubmitted } from './form.js';
window.dataLayer = window.dataLayer || [];
const getData = (dataURL) => __awaiter(void 0, void 0, void 0, function* () {
    let result = {};
    try {
        yield fetch(utilityJS.cleanURL(dataURL))
            .then((response) => response.json())
            .then((data) => {
            result = data;
        });
        return result;
    }
    catch (error) {
        utilityJS.showMessage(`Sorry an error has occurred: ${error}`);
    }
    return result;
});
const addProfiles = (id) => {
    const baseDir = window.location.toString().toLocaleLowerCase().indexOf('/html5') !== -1 ? '/html5' : '';
    let docEl = HTMLInputElement;
    if (document.getElementById(id)) {
        docEl = document.getElementById(id);
    }
    docEl.innerHTML = `
  <div class='icon' id='html-resume'>
    <a href='${baseDir}/resume.html'>
      <img alt='Link to HTML Resume with PDF and Word options' src='https://chriscorchado.com/images/htmlIcon.jpg' />
      <span>Resume</span>
    </a>
  </div>

  <div class='icon' id='profile-linkedin'>
    <a href='https://www.linkedin.com/in/chriscorchado/' target='_blank' rel='noopener' title='Opening a new window'>
      <img alt='LinkedIn Icon' title='Link to LinkedIn Profile' src='https://chriscorchado.com/images/linkedInIcon.jpg' />
      <span>LinkedIn</span>
    </a>
  </div>

  <div class='icon' id='profile-azure'>
    <a href='https://docs.microsoft.com/en-us/users/corchadochrisit-2736/' target='_blank' rel='noopener' title='Opening a new window'>
      <img alt='Azure Icon' title='Link to Azure Profile' src='https://chriscorchado.com/images/azureIcon.png' />
      <span>Azure</span>
    </a>

    <!--a href='https://chriscorchado.com/resume/ChrisCorchadoIT-2736_microsoft-en-us-users.pdf' target='_blank' rel='noopener' title='Opening a new window'>
    <img alt='Azure Icon' title='Link to Azure Profile' src='https://chriscorchado.com/images/azureIcon.png' />
    <span>Azure</span>
    </a-->
  </div>`;
};
const addResumes = () => {
    if (document.getElementById('profiles')) {
        const docEl = document.getElementById('profiles');
        docEl.innerHTML = `
    <div class='icon' id='pdf-resume'>
      <a href='https://chriscorchado.com/resume/Chris-Corchado-resume-2020.pdf' target='_blank' rel='noopener' title='Opening a new window'>
        <img alt='Link to PDF Resume' src='https://chriscorchado.com/images/pdfIcon.jpg' />
        <span>PDF</span>
      </a>
    </div>

    <div class='icon' id='word-resume'>
      <a href='https://chriscorchado.com/resume/Chris-Corchado-resume-2020.docx' title='File will download'>
        <img alt='Link to MS Word Resume' src='https://chriscorchado.com/images/wordIcon.jpg' />
        <span>Word</span>
      </a>
    </div>`;
    }
};
const setPageHTML = (values) => {
    let item = '';
    const page = values[0];
    const data = values[1];
    const itemTitle = values[2];
    const itemJobTitle = values[3];
    const itemBody = values[4];
    const imgPieces = values[5];
    const startDate = values[6];
    const endDate = values[7];
    const itemTrackImage = values[8];
    const itemPDF = values[9];
    const itemDate = values[10];
    const itemCompanyName = values[11];
    const itemTechnology = values[12];
    const searchedFor = values[13];
    const docLogo = document.getElementById('logo');
    let aboutData;
    if (data && data.attributes && data.attributes.body) {
        aboutData = data.attributes.body.value.toString();
    }
    let imgAltCount = 0;
    const screenshotAlt = [];
    const encodedName = encodeURIComponent(itemTitle);
    let resumeData;
    if (page === 'resume') {
        resumeData = data.attributes.body.value.toString();
    }
    let itemGridClass;
    let section = '';
    switch (page) {
        case 'about':
            docLogo.getElementsByTagName('img')[0].style.border = '1px dashed #7399EA';
            addProfiles('profiles');
            return aboutData;
        case 'contact':
            if (location.toString().indexOf('/contact.html?submitted=true') !== -1) {
                formSubmitted(5);
            }
            else {
                addProfiles('profiles');
                document.getElementsByClassName('container')[0].innerHTML = data.toString();
                const docContact = document.getElementById('contact-link');
                docContact.className += ' nav-item-active';
                const webLocation = document.getElementById('edit-field-site-0-value');
                webLocation.value = location.toString();
                const docEditMail = document.getElementById('edit-mail');
                docEditMail.focus();
            }
            break;
        case 'companies':
            return `<div class='company-container col shadow'>

          <div class='company-name'>${itemTitle}</div>
          <div class='company-job-title'>${itemJobTitle}</div>
          <div class='body-container'>${itemBody}</div>

          <div class='screenshot-container'>
            <img loading='lazy' src=${utilityJS.getFullUrlByPage(imgPieces[0], page)}
            class='company-screenshot'
            alt='${data.attributes.title} Screenshot'
            title='Screenshot of ${data.attributes.title}' />
          </div>

          <div class='employment-dates'>${startDate} - ${endDate}</div>
        </div>`;
        case 'courses':
            item = `<div class='course-box box'>
          <h2>${itemTitle}</h2>

          <div>
            <img loading='lazy' src='${utilityJS.getFullUrlByPage(imgPieces[0], page)}'
              alt='${itemTitle.replace(/(<([^>]+)>)/gi, '')}'
              title='${itemTitle.replace(/(<([^>]+)>)/gi, '')}' />
          </div>

          <div class='course-wrapper'>

            <span class='course-date'>${itemDate}</span>

            <span class='course-links'>
              <a href='${utilityJS.getFullUrlByPage(itemPDF, page)}' target='_blank' rel='noopener' title='Opens in a new window'>
                <img loading='lazy' src='https://chriscorchado.com/images/pdfIcon.jpg' height='25'
                title='View the PDF Certificate' alt='PDF Icon'/>
              </a>
            </span>`;
            if (itemTrackImage) {
                item += `<span class='course-links'>
            <a href='${utilityJS.getFullUrlByPage(itemTrackImage, page)}' data-featherlight='image'>
              <img loading='lazy' src='https://chriscorchado.com/images/linkedIn-track.png' height='25'
              title='View the Courses in the Track' alt='Trophy Icon' />
            </a>
          </span>`;
            }
            item += '</div></div>';
            return item;
        case 'projects':
            item = `<div class='project col'>
        <div class='project-title'>${itemTitle}</div>
        <div class='project-company'>${itemCompanyName} <span class='project-date'>(${itemDate})</span></div>
        <div class='body-container'>${itemBody}</div>`;
            if (imgPieces) {
                data.relationships.field_screenshot.data.forEach((screenshot) => {
                    screenshotAlt.push(screenshot.meta.alt);
                });
                itemGridClass = `project-item-grid project-items${data.relationships.field_screenshot.data.length}`;
                section = `<section data-featherlight-gallery data-featherlight-filter='a' class='${itemGridClass}'>`;
                imgAltCount = 0;
                imgPieces.forEach((img) => {
                    const pieces = img.split(',');
                    pieces.forEach((innerItem) => {
                        const projectImage = utilityJS.getFullUrlByPage(innerItem, page);
                        section += `<div class='project-item shadow' title='${screenshotAlt[imgAltCount]}'>

              <a href=${projectImage} class='gallery'>
                <div class='project-item-desc'>
                  ${searchJS.itemWithSearchHighlight(screenshotAlt[imgAltCount], searchedFor)}
                </div>

                <img loading='lazy' src='${projectImage}' alt='Screenshot of ${screenshotAlt[imgAltCount]}' />
              </a>
            </div>`;
                        imgAltCount++;
                    });
                });
                section += '</section>';
                item += section;
            }
            if (data.attributes.field_video_url) {
                data.attributes.field_video_url.forEach(() => {
                    item += `<span title='Play Video'><a href='https://chriscorchado.com/video.html?url=${data.attributes.field_video_url}&name=${encodedName}' target='_blank' class='play-video' rel='noopener' title='Opens in a new window'>
            Play Video <img loading='lazy' src='https://chriscorchado.com/images/play_video_new_window_icon.png' alt='Play Video Icon' width='20' />
          </a></span>`;
                });
            }
            item += `<div class='project-technology'>${itemTechnology.slice(0, -2)}</div>`;
            item += '</div>';
            return item;
        case 'resume':
            addResumes();
            return resumeData;
        default:
    }
    return '';
};
const setPageDataLayer = (values, pageName, site) => {
    const items = [];
    let itemTitle = '';
    values.forEach((element) => {
        if (pageName === 'companies') {
            itemTitle = element.attributes.field_company_name;
        }
        else {
            itemTitle = element.attributes.title;
        }
        const thisItem = {
            'item_name': `${itemTitle}`,
            'item_id': `${element.id}`,
            'price': '.99',
            'item_brand': `${site}`,
            'item_category': `${pageName}`,
            'quantity': '1'
        };
        items.push(thisItem);
    });
    const eventList = {
        event: 'view_item_list',
        ecommerce: {
            items
        }
    };
    window.dataLayer.push(eventList);
};
const renderPage = (data, page, searchedFor, next, prev) => {
    var _a, _b;
    let pageIsSearchable = false;
    (_a = document.getElementById('container')) === null || _a === void 0 ? void 0 : _a.classList.add('hide');
    if (page === 'contact') {
        setPageHTML([page, data]);
        document.getElementsByClassName('container')[0].classList.remove('hide');
        (_b = document.getElementById('search-container')) === null || _b === void 0 ? void 0 : _b.classList.add('hide');
        utilityJS.animateLogo('logo-image', '');
        return;
    }
    let includedCompanyName = [];
    let includedAssetFilename = [];
    let includedTechnologyName = [];
    let includedTechnologyIcon = [];
    if (data.included) {
        const allIncludedData = searchJS.getIncludedData(data);
        includedCompanyName = allIncludedData[0];
        includedAssetFilename = allIncludedData[1];
        includedTechnologyName = allIncludedData[2];
        includedTechnologyIcon = allIncludedData[3];
    }
    let item = '';
    let itemBody = '';
    let currentNavItem = '';
    let itemTitle = '';
    let itemDate = '';
    let startDate = '';
    let endDate = '';
    let itemJobTitle = '';
    let itemTechnology = '';
    let itemCompanyName = '';
    let itemWorkType = '';
    let itemPDF = '';
    let itemTrackImage = '';
    let itemCount = 0;
    let imgPieces = [];
    data.data.forEach((element) => {
        itemTitle = element.attributes.title;
        itemBody = element.attributes.body ? element.attributes.body.value : '';
        itemDate = element.attributes.field_date || element.attributes.field_award_date;
        itemJobTitle = element.attributes.field_job_title;
        startDate = element.attributes.field_start_date;
        endDate = element.attributes.field_end_date;
        itemWorkType = element.attributes.field_type === 'full' ? 'Full-Time' : 'Contract';
        itemTechnology = '';
        itemTrackImage = '';
        imgPieces = [];
        if (element.relationships) {
            const relationshipData = searchJS.getElementRelationships(element, includedAssetFilename, includedCompanyName, includedTechnologyName, includedTechnologyIcon);
            if (!imgPieces.includes(relationshipData[0].toString())) {
                imgPieces.push(relationshipData[0].toString());
            }
            itemPDF = relationshipData[1].toString();
            if (relationshipData[2])
                itemTrackImage = relationshipData[2].toString();
            itemCompanyName = relationshipData[3].toString();
            itemTechnology += relationshipData[4].toString();
        }
        if (itemDate) {
            if (page === 'projects')
                itemDate = itemDate.split('-')[0];
            if (page === 'courses')
                itemDate = utilityJS.getMonthYear(itemDate);
        }
        if (startDate)
            startDate = utilityJS.getMonthYear(startDate);
        if (endDate)
            endDate = utilityJS.getMonthYear(endDate);
        itemTitle = itemTitle.replace('&amp;', '&');
        if (searchedFor) {
            itemTitle = searchJS.itemWithSearchHighlight(itemTitle, searchedFor);
            itemDate = searchJS.itemWithSearchHighlight(itemDate, searchedFor);
            startDate = searchJS.itemWithSearchHighlight(startDate, searchedFor);
            endDate = searchJS.itemWithSearchHighlight(endDate, searchedFor);
            itemBody = searchJS.itemWithSearchHighlight(itemBody, searchedFor);
            itemJobTitle = searchJS.itemWithSearchHighlight(itemJobTitle, searchedFor);
            itemTechnology = searchJS.itemWithSearchHighlight(itemTechnology, searchedFor);
            itemCompanyName = searchJS.itemWithSearchHighlight(itemCompanyName, searchedFor);
            if (itemWorkType !== 'node-company') {
                itemWorkType = searchJS.itemWithSearchHighlight(itemWorkType, searchedFor);
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
            searchedFor
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
            case 'resume':
                item = setPageHTML(allValues);
                break;
            default:
        }
    });
    setPageDataLayer(data.data, page, 'HTML5');
    let pageHasGallery = false;
    switch (page) {
        case 'about':
            currentNavItem = 'about-link';
            item = `<h1 id='content'>About Me</h1>${item}`;
            break;
        case 'companies':
            currentNavItem = 'companies-link';
            pageIsSearchable = true;
            item = `<h1 id='content'>Work History</h1><div class='container company'>${item}</div>`;
            break;
        case 'courses':
            currentNavItem = 'courses-link';
            pageIsSearchable = true;
            item = `<h1 id='content'>Courses and Awards</h1><div class='container courses-container row'>${item}</div>`;
            break;
        case 'projects':
            currentNavItem = 'projects-link';
            pageIsSearchable = true;
            pageHasGallery = true;
            item = `<h1 id='content'>Project Samples</h1><div class='project-container'>${item}</div>`;
            break;
        case 'resume':
            item = `<h1 id='content'>Resume</h1>${item}`;
            break;
        default:
    }
    if (page !== 'about' && page !== 'resume') {
        const docCurrentNavItem = document.getElementById(currentNavItem);
        docCurrentNavItem.className += ' nav-item-active';
    }
    document.getElementsByClassName('container')[0].innerHTML = item;
    if (pageIsSearchable) {
        const docSearchContainer = document.getElementById('search-container');
        docSearchContainer.style.display = 'block';
    }
    if (pageHasGallery) {
        $('a.gallery').featherlightGallery({
            previousIcon: '<img src="https://chriscorchado.com/lightbox/images/left-arrow.png" alt="Prev" />',
            nextIcon: '<img src="https://chriscorchado.com/lightbox/images/right-arrow.png" alt="Next" />',
            galleryFadeIn: 200,
            galleryFadeOut: 300
        });
    }
    if (page !== 'about' && page !== 'contact' && page !== 'resume') {
        searchJS.setPagination(itemCount, data.passedInCount.currentCount, prev, next);
    }
    utilityJS.animateLogo('logo-image', '');
    document.getElementsByClassName('container')[0].classList.remove('hide');
};
export const getPage = (page, search, pagingURL, pagingDirection) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let data = null;
    (_a = document.getElementById('no-records')) === null || _a === void 0 ? void 0 : _a.remove();
    if (pagingDirection === 'next' || search) {
        utilityJS.animateLogo('logo-image', 'spin');
    }
    if (pagingDirection === 'prev') {
        utilityJS.animateLogo('logo-image', 'spin-reverse');
    }
    if (search) {
        window.dataLayer.push({
            'event': 'search',
            'searchTerm': search
        });
    }
    if (page === 'contact') {
        if (location.toString().indexOf('submitted') === -1) {
            yield fetch(`${utilityJS.API_BASE}/contact/feedback`)
                .then((resp) => {
                return resp.ok ? resp.text() : Promise.reject(resp.statusText);
            })
                .then((innerPage) => {
                data = innerPage.replace(/\/drupal8/g, utilityJS.API_BASE);
                let form = data.substr(data.indexOf('<form class='), data.indexOf('</form>'));
                form = form.substr(0, form.indexOf('</form>') + 8);
                form = form.replace('Your email address', 'Email');
                let script = data.substr(data.indexOf('<script type="application/json" data-drupal-selector="drupal-settings-json">'), data.indexOf('></script>'));
                script = script.substr(0, script.indexOf('</script>') + 9);
                data = `<h1 id='content'>Contact Me</h1>${form} ${script}`;
            }).catch((error) => {
                utilityJS.showMessage(`Sorry an error has occurred: ${error}`);
            });
        }
        renderPage(data, page);
    }
    else {
        if (pagingURL) {
            data = yield getData(pagingURL);
        }
        else {
            switch (page) {
                case 'about':
                    data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/page?fields[node--page]=id,title,body&
              filter[id][operator]=CONTAINS&
              filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe`);
                    break;
                case 'companies':
                    if (search) {
                        data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/company?filter[or-group][group][conjunction]=OR&
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
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`);
                    }
                    else {
                        data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/company?sort=-field_end_date&
                include=field_company_screenshot&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`);
                    }
                    break;
                case 'courses':
                    if (search) {
                        data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&
                filter[title][operator]=CONTAINS&
                filter[title][value]=${search}&
                filter[title][condition][memberOf]=or-group&
                filter[field_award_date][operator]=CONTAINS&
                filter[field_award_date][value]=${search}&
                filter[field_award_date][condition][memberOf]=or-group&
                sort=-field_award_date,title&
                include=field_award_pdf,field_track_image,field_award_images&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`);
                    }
                    else {
                        data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/awards?sort=-field_award_date,title&
                include=field_award_pdf,field_track_image,field_award_images&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`);
                    }
                    break;
                case 'projects':
                    if (search) {
                        data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/project?filter[or-group][group][conjunction]=OR&
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
              sort=-field_date&field_company.title&
              include=field_project_technology,field_company,field_screenshot&fields[node--company]=field_company_name,field_video_url&
              fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&
              page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`);
                    }
                    else {
                        data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/project?sort=-field_date&field_company.title&
                include=field_project_technology,field_company,field_screenshot&
                fields[node--company]=field_company_name,field_video_url&
                fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`);
                    }
                    break;
                case 'resume':
                    data = yield getData(`${utilityJS.API_BASE}/jsonapi/node/page?fields[node--page]=id,title,body&
              filter[id][operator]=CONTAINS&
              filter[id][value]=815cf534-a677-409c-be7a-b231c24827b5`);
                    break;
                default:
            }
        }
        const lastCount = document.getElementById('lastCount');
        const passedInCount = {
            currentCount: document.getElementById('lastCount')
                ? lastCount.textContent
                : 1
        };
        data = Object.assign(Object.assign({}, data), { passedInCount });
        if (data.data && data.data.length) {
            renderPage(data, page, search, data.links.next, data.links.prev);
        }
        else {
            searchJS.noRecordsFound('no-records', search, 'navigation', 'No matches found for');
        }
        utilityJS.animateLogo('logo-image', '');
    }
    return true;
});

import * as utilityJS from './utilities.js'
import * as searchJS from './search.js'
import { formSubmitted } from './form.js'
/* eslint-env jquery */

/**
 * Load page
 * @param {string} page - page name
 * @param {string=} search - (optional) - search string
 * @param {string=} pagingURL - (optional) - Prev/Next links
 */
export const getPage = async (page: string, search: string, pagingURL?: string, pagingDirection?: string) => {
  let data = null
  document.getElementById('no-records')?.remove()

  if (pagingDirection === 'next' || search) {
    utilityJS.animateLogo('logo-image', 'spin')
  }

  if (pagingDirection === 'prev') {
    utilityJS.animateLogo('logo-image', 'spin-reverse')
  }

  if (search) {
    // ga('send', 'pageview', location.pathname + '?search=' + search)
  }

  if (page === 'contact') {
    // Generate the contact form as long as it has not been submitted
    if (location.toString().indexOf('submitted') === -1) {
      await fetch(`${utilityJS.API_BASE}/contact/feedback`) // get the feedback form as text
        .then((resp) => {
          return resp.ok ? resp.text() : Promise.reject(resp.statusText)
        })
        .then((page) => {
          data = page.replace(/\/drupal8/g, utilityJS.API_BASE) // update the HTML URLs from relative to absolute

          // Get the contact form HTML
          let form = data.substr(data.indexOf('<form class='), data.indexOf('</form>'))
          form = form.substr(0, form.indexOf('</form>') + 8)

          form = form.replace('Your email address', 'Email')

          // Get the contact form JavaScript
          let script = data.substr(
            data.indexOf(
              '<script type="application/json" data-drupal-selector="drupal-settings-json">'
            ),
            data.indexOf('></script>')
          )
          script = script.substr(0, script.indexOf('</script>') + 9)

          data = `<h1 id='content'>Contact</h1>${form} ${script}`
        })
        .catch((error) => {
          alert(`Sorry an error has occurred: ${error}`)
        })
    }

    renderPage(data, page)

    return false
  } else {
    if (pagingURL) {
      data = await getData(pagingURL)
    } else {
      switch (page) {
        case 'about':
          data = await getData(
            `${utilityJS.API_BASE}/jsonapi/node/page?fields[node--page]=id,title,body&
              filter[id][operator]=CONTAINS&
              filter[id][value]=ca23f416-ad70-41c2-9228-52ba6577abfe`
          )
          break
        case 'companies':
          if (search) {
            data = await getData(
              `${utilityJS.API_BASE}/jsonapi/node/company?filter[or-group][group][conjunction]=OR&
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
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`
            )
          } else {
            data = await getData(
              `${utilityJS.API_BASE}/jsonapi/node/company?sort=-field_end_date&
                include=field_company_screenshot&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`
            )
          }
          break
        case 'courses':
          if (search) {
            data = await getData(
              `${utilityJS.API_BASE}/jsonapi/node/awards?filter[or-group][group][conjunction]=OR&
                filter[title][operator]=CONTAINS&
                filter[title][value]=${search}&
                filter[title][condition][memberOf]=or-group&
                filter[field_award_date][operator]=CONTAINS&
                filter[field_award_date][value]=${search}&
                filter[field_award_date][condition][memberOf]=or-group&
                sort=-field_award_date&
                include=field_award_pdf,field_track_image,field_award_images&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`
            )
          } else {
            data = await getData(
              `${utilityJS.API_BASE}/jsonapi/node/awards?sort=-field_award_date&
                include=field_award_pdf,field_track_image,field_award_images&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`
            )
          }
          break
        case 'projects':
          if (search) {
            data = await getData(
              `${utilityJS.API_BASE}/jsonapi/node/project?filter[or-group][group][conjunction]=OR&
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
              page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`
            )
          } else {
            data = await getData(
              `${utilityJS.API_BASE}/jsonapi/node/project?sort=-field_date&field_company.title&
                include=field_project_technology,field_company,field_screenshot&
                fields[node--company]=field_company_name,field_video_url&
                fields[node--project]=title,body,field_date,field_screenshot,field_project_technology,field_company,field_video_url&
                page[limit]=${utilityJS.MAX_ITEMS_PER_PAGE}`
            )
          }
          break
        case 'resume':
          data = await getData(
            `${utilityJS.API_BASE}/jsonapi/node/page?fields[node--page]=id,title,body&
              filter[id][operator]=CONTAINS&
              filter[id][value]=815cf534-a677-409c-be7a-b231c24827b5`
          )
          break
      }
    }
  }

  // Create object with the last pagination count or a default of 1
  const lastCount = document.getElementById('lastCount') as HTMLElement
  const passedInCount = {
    currentCount: document.getElementById('lastCount')
      ? lastCount.textContent
      : 1
  }

  data = { ...data, passedInCount }

  if (data.data && data.data.length) {
    renderPage(data, page, search, data.links.next, data.links.prev)
  } else {
    searchJS.noRecordsFound('no-records', search, 'navigation', 'No matches found for')
  }

  utilityJS.animateLogo('logo-image', '')
}

/**
 * Get data
 * @param {string} dataURL - URL to fetch data from
 * @return {Object} - JSON object of data
 */
const getData = async (dataURL: string) => {
  let result: any = {}
  try {
    await fetch(utilityJS.cleanURL(dataURL))
      .then((response) => response.json())
      .then((data) => (result = data))
    return result
  } catch (error) {
    alert(`Sorry an error has occurred: ${error}`)
  }
}

/**
 * Add profile links
 * @param {string} id - ID of element to insert into
 */
const addProfiles = (id: string) => {
  const baseDir = window.location.toString().toLocaleLowerCase().indexOf('/html5') !== -1 ? '/html5' : ''

  const docEl = document.getElementById(id)! as HTMLInputElement
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
  </div>`
}

/**
 * Add PDF and Word resume links
 * @param {string} id - ID of element to insert into
 */
const addResumes = (id: string) => {
  const docEl = document.getElementById(id)! as HTMLInputElement
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
  </div>`
}

/**
 * Configure the HTML for each page
 * @param {array} values - all item values for the page
 * @return {string} - HTML for the page
 */
const setPageHTML = (values: any) => {
  let item = ''
  const page = values[0]
  const data = values[1]
  const itemTitle = values[2]
  const itemJobTitle = values[3]
  const itemBody = values[4]
  const imgPieces = values[5]
  const startDate = values[6]
  const endDate = values[7]
  const itemTrackImage = values[8]
  const itemPDF = values[9]
  const itemDate = values[10]
  const itemCompanyName = values[11]
  const itemTechnology = values[12]
  const searchedFor = values[13]
  // const includedTechnologyItem = values[14]

  const docLogo = document.getElementById('logo')! as HTMLInputElement

  // TODO: change to a content type vs basic page split
  let aboutData
  if (data && data.attributes && data.attributes.body) {
    aboutData = data.attributes.body.value.toString()
  }

  let imgAltCount = 0
  const screenshotAlt:any = []

  const encodedName = encodeURIComponent(itemTitle)

  let resumeData
  if (page === 'resume') {
    resumeData = data.attributes.body.value.toString()
  }

  let itemGridClass
  let section = ''

  switch (page) {
    // Homepage
    case 'about':
      // Add a border to the site logo
      docLogo.getElementsByTagName('img')[0].style.border = '1px dashed #7399EA'

      // Add resume, linkedin and azure links
      addProfiles('profiles')

      return aboutData
    case 'contact':

      // Form sumitted
      if (location.toString().indexOf('/contact.html?submitted=true') !== -1) {
        formSubmitted(5)
      } else {
        // Add resume, linkedin and azure links
        addProfiles('profiles')

        // Show the form
        document.getElementsByClassName('container')[0].innerHTML = data.toString()

        const docContact = document.getElementById('contact-link')! as HTMLInputElement
        docContact.className += ' nav-item-active'

        // Capture the current site URL
        const webLocation = document.getElementById('edit-field-site-0-value')! as HTMLInputElement
        webLocation.value = location.toString()

        const docEditMail = document.getElementById('edit-mail')! as HTMLInputElement
        docEditMail.focus()
      }
      break
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
        </div>`
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
            </span>`

      // TODO: Create bigger version and add to content type
      //  item += `<span class='course-links'>
      //   <a href='${getFullUrlByPage(imgPieces[0], page)}' data-featherlight='image'>
      //     <img loading='lazy' src='https://chriscorchado.com/images/jpg_icon.png' height='25'
      //       title='View the Certificate' alt='View the Certificate'/>
      //   </a></span>`

      if (itemTrackImage) {
        item += `<span class='course-links'>
            <a href='${utilityJS.getFullUrlByPage(itemTrackImage, page)}' data-featherlight='image'>
              <img loading='lazy' src='https://chriscorchado.com/images/linkedIn-track.png' height='25'
              title='View the Courses in the Track' alt='Trophy Icon' />
            </a>
          </span>`
      }

      // Course-box box
      return (item += '</div></div>')
    case 'projects':

      item = `<div class='project col'>
        <div class='project-title'>${itemTitle}</div>
        <div class='project-company'>${itemCompanyName} <span class='project-date'>(${itemDate})</span></div>
        <div class='body-container'>${itemBody}</div>`

      // Screenshots
      if (imgPieces) {
        data.relationships.field_screenshot.data.forEach((screenshot: any) => {
          screenshotAlt.push(screenshot.meta.alt)
        })

        itemGridClass = `project-item-grid project-items${data.relationships.field_screenshot.data.length}`
        section = `<section data-featherlight-gallery data-featherlight-filter='a' class='${itemGridClass}'>`

        // Reset alt attribute counter
        imgAltCount = 0
        imgPieces.forEach((img: string) => {
          const pieces = img.split(',')

          pieces.forEach((item: string) => {
            const projectImage = utilityJS.getFullUrlByPage(item, page)

            section += `<div class='project-item shadow' title='${
              screenshotAlt[imgAltCount]
            }'>

              <a href=${projectImage} class='gallery'>
                <div class='project-item-desc'>
                  ${searchJS.itemWithSearchHighlight(screenshotAlt[imgAltCount], searchedFor)}
                </div>

                <img loading='lazy' src='${projectImage}' alt='Screenshot of ${
              screenshotAlt[imgAltCount]
            }' />
              </a>
            </div>`

            imgAltCount++
          })
        })

        section += '</section>'
        item += section
      }

      // Videos
      if (data.attributes.field_video_url) {
        data.attributes.field_video_url.forEach((img: string) => {
          item += `<span title='Play Video'><a href='https://chriscorchado.com/video.html?url=${data.attributes.field_video_url}&name=${encodedName}' target='_blank' class='play-video' rel='noopener' title='Opens in a new window'>
            Play Video <img loading='lazy' src='https://chriscorchado.com/images/play_video_new_window_icon.png' alt='Play Video Icon' width='20' />
          </a></span>`
        })
      }

      // Text for HTML, CSS, JavaScript, etc..
      item += `<div class='project-technology'>${itemTechnology.slice(0, -2)}</div>`

      // Icons for HTML, CSS, JavaScript, etc..
      // item += `<div class='project-technology'>`
      // for (const [key, value] of Object.entries(includedTechnologyItem)) {
      //   for (const [key1, value1] of Object.entries(value)) {
      //     item += `<div id='technology-item-wrapper'>${value1.name}
      //     <img loading='lazy' src='${value1.image}' class='project-technology-icon' title='${value1.name}' alt='${value1.name}' /></div>`
      //   }
      // }
      // item += `</div>`

      item += '</div>'
      return item
    case 'resume':
      // Add PDF and Word resumes
      addResumes('profiles')

      return resumeData
  }
}

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
  let pageIsSearchable = false

  if (page === 'contact') {
    setPageHTML([page, data])
    document.getElementsByClassName('container')[0].classList.remove('hide')
    document.getElementById('search-container')?.classList.add('hide')
    utilityJS.animateLogo('logo-image', '')
    return
  }

  let includedCompanyName:any = []
  let includedAssetFilename:any = []
  let includedTechnologyName:any = []
  let includedTechnologyIcon:any = []

  if (data.included) {
    const allIncludedData = searchJS.getIncludedData(data)
    includedCompanyName = allIncludedData[0]
    includedAssetFilename = allIncludedData[1]
    includedTechnologyName = allIncludedData[2]
    includedTechnologyIcon = allIncludedData[3]
  }

  let item = ''
  let itemBody = ''
  let currentNavItem = ''
  let itemTitle = ''
  let itemDate = ''
  let startDate = ''
  let endDate = ''
  let itemJobTitle = ''
  let itemTechnology = ''
  // itemTechnologyIcon = ''
  let itemCompanyName = ''
  let itemWorkType = ''
  let itemPDF = ''
  let itemTrackImage = ''

  let itemCount = 0
  let imgPieces: any = []
  // let includedTechnologyItem = []

  data.data.forEach((element: any) => {
    itemTitle = element.attributes.title
    itemBody = element.attributes.body ? element.attributes.body.value : ''
    itemDate = element.attributes.field_date || element.attributes.field_award_date
    itemJobTitle = element.attributes.field_job_title
    startDate = element.attributes.field_start_date
    endDate = element.attributes.field_end_date
    itemWorkType = element.attributes.field_type === 'full' ? 'Full-Time' : 'Contract'
    itemTechnology = ''
    itemTrackImage = ''
    imgPieces = []
    // includedTechnologyItem = []

    if (element.relationships) {
      const relationshipData = searchJS.getElementRelationships(
        element,
        includedAssetFilename,
        includedCompanyName,
        includedTechnologyName,
        includedTechnologyIcon
      )

      // Course, company and project screenshot filenames
      if (!imgPieces.includes(relationshipData[0].toString())) {
        imgPieces.push(relationshipData[0].toString())
      }

      // Course PDF filename and track image
      itemPDF = relationshipData[1].toString()
      if (relationshipData[2]) itemTrackImage = relationshipData[2].toString()

      itemCompanyName = relationshipData[3].toString()
      itemTechnology += relationshipData[4].toString()
      // itemTechnologyIcon += relationshipData[5].toString()
      // includedTechnologyItem.push(relationshipData[6])
    }

    // Get project and course dates
    if (itemDate) {
      if (page === 'projects') itemDate = itemDate.split('-')[0] // only the year
      if (page === 'courses') itemDate = utilityJS.getMonthYear(itemDate)
    }

    // Get work history dates - month and year
    if (startDate) startDate = utilityJS.getMonthYear(startDate)
    if (endDate) endDate = utilityJS.getMonthYear(endDate)

    itemTitle = itemTitle.replace('&amp;', '&')

    if (searchedFor) {
      itemTitle = searchJS.itemWithSearchHighlight(itemTitle, searchedFor)
      itemDate = searchJS.itemWithSearchHighlight(itemDate, searchedFor)
      startDate = searchJS.itemWithSearchHighlight(startDate, searchedFor)
      endDate = searchJS.itemWithSearchHighlight(endDate, searchedFor)
      itemBody = searchJS.itemWithSearchHighlight(itemBody, searchedFor)
      itemJobTitle = searchJS.itemWithSearchHighlight(itemJobTitle, searchedFor)
      itemTechnology = searchJS.itemWithSearchHighlight(itemTechnology, searchedFor)
      itemCompanyName = searchJS.itemWithSearchHighlight(itemCompanyName, searchedFor)

      if (itemWorkType !== 'node-company') {
        itemWorkType = searchJS.itemWithSearchHighlight(itemWorkType, searchedFor)
      }
    }

    itemCount++

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
      // includedTechnologyItem
    ]

    switch (page) {
      case 'about':
        item = setPageHTML(allValues)
        break
      case 'companies':
        item += setPageHTML(allValues)
        break
      case 'courses':
        item += setPageHTML(allValues)
        break
      case 'projects':
        item += setPageHTML(allValues)
        break
      case 'resume':
        item = setPageHTML(allValues)
        break
    }
  }) // data.data forEach

  let pageHasGallery = false
  switch (page) {
    case 'about':
      currentNavItem = 'about-link'
      item = `<h1 id='content'>About Me</h1>${item}`
      break
    case 'companies':
      currentNavItem = 'companies-link'
      pageIsSearchable = true
      item = `<h1 id='content'>History</h1><div class='container company'>${item}</div>`
      break
    case 'courses':
      currentNavItem = 'courses-link'
      pageIsSearchable = true
      item = `<h1 id='content'>Courses</h1><div class='container courses-container row'>${item}</div>`
      break
    case 'projects':
      currentNavItem = 'projects-link'
      pageIsSearchable = true
      pageHasGallery = true
      item = `<h1 id='content'>Projects</h1><div class='container project-container row'>${item}</div>`
      break
    case 'resume':
      item = `<h1 id='content'>Resume</h1>${item}`
      break
  }

  if (page !== 'about' && page !== 'resume') {
    const docCurrentNavItem = document.getElementById(currentNavItem)! as HTMLInputElement
    docCurrentNavItem.className += ' nav-item-active'
  }

  document.getElementsByClassName('container')[0].innerHTML = item

  if (pageIsSearchable) {
    const docSearchContainer = document.getElementById('search-container')! as HTMLInputElement
    docSearchContainer.style.display = 'block'
  }

  if (pageHasGallery) {
    // @ts-ignore
    $('a.gallery').featherlightGallery({
      previousIcon: '<img src="https://chriscorchado.com/lightbox/images/left-arrow.png" alt="Prev" />', // &#dsfsd Code that was used as previous icon
      nextIcon: '<img src="https://chriscorchado.com/lightbox/images/right-arrow.png" alt="Next" />', // &#9654 Code that was used as next icon
      galleryFadeIn: 200, // FadeIn speed when slide is loaded
      galleryFadeOut: 300 // FadeOut speed before slide is loaded
    })
  }

  if (page !== 'about' && page !== 'contact' && page !== 'resume') {
    searchJS.setPagination(itemCount, data.passedInCount.currentCount, prev, next)
  }

  utilityJS.animateLogo('logo-image', '')
  document.getElementsByClassName('container')[0].classList.remove('hide')
}

import * as utilityJS from './utilities.js'
import * as dataJS from './data.js'

const searchElement = <HTMLInputElement>document.getElementById(utilityJS.SITE_SEARCH_ID)
/**
 * Get the current search count
 * @param {number} count - item count
 * @param {string} searchCountID - search count container id
 * @return {string} - item count with either 'Items' or 'Item'
 */
const getSearchCount = (count: number, searchCountID: string) => {
  if (searchElement && searchElement.value) {
    const searchCountEL = document.getElementById(searchCountID) as HTMLElement

    if (searchCountEL && (count <= utilityJS.MAX_ITEMS_PER_PAGE)) {
      searchCountEL.innerHTML = `${count}  ${count === 1 ? 'Item' : 'Items'}`
    } else {
      searchCountEL.innerHTML = `${utilityJS.MAX_ITEMS_PER_PAGE} ${+utilityJS.MAX_ITEMS_PER_PAGE === 1 ? 'Item' : 'Items'}`
    }

    return `${count} ${count === 1 ? 'Item' : 'Items'} `
  }
  return ''
}

/**
 * Get the search item offset
 * @param {link} any - URL
 * @return {number} - offset number
 */
const getSearchOffset = (link: any) => {
  const nextURL = link.href.replace(/%2C/g, ',').replace(/%5B/g, '[').replace(/%5D/g, ']')
  return nextURL.substring(nextURL.search('offset') + 8, nextURL.search('limit') - 6)
}

/**
 * Setup pagination
 * @param {int} count - number of items
 * @param {int} paginationTotal - last pagination value
 * @param {Object=} prev - (optional) - link to previous results
 * @param {Object=} next - (optional) - link to next results
 */
export const setPagination = (
  count: number,
  paginationTotal: number,
  prev?: any,
  next?: any
): void => {
  let dataOffset = 0
  let prevLink = ''
  let nextLink = ''

  if (next) dataOffset = getSearchOffset(next)

  let dataOffsetText = getSearchCount(count, 'search-count')

  // if there is a next or prev link then show the pagination
  const searchContainer = document.getElementById('search-container') as HTMLElement
  const searchContainerCount = document.getElementById('search-count') as HTMLElement

  if (!next && !prev) {
    searchContainer.className = 'pagination-no'

    if (searchContainerCount) {
      searchContainerCount.innerHTML = `<span id='totalItems'>${count}</span> ${count === 1 ? 'Item' : 'Items'}`
    }
  } else {
    searchContainer.className = 'pagination-yes'
    const currentCount = +dataOffset / utilityJS.MAX_ITEMS_PER_PAGE

    // first page item count
    if (count === dataOffset) {
      dataOffsetText = `Items 1-<span id="lastCount">${utilityJS.MAX_ITEMS_PER_PAGE}</span>`
    } else {
      // middle pages item counts
      if (currentCount !== 0) {
        dataOffsetText = `Items ${(currentCount * utilityJS.MAX_ITEMS_PER_PAGE - utilityJS.MAX_ITEMS_PER_PAGE) + 1}-<span id="lastCount">${currentCount * utilityJS.MAX_ITEMS_PER_PAGE}</span>`
      } else {
        // last page item count
        dataOffsetText = `Items ${+paginationTotal + 1}-<span id="lastCount">${+paginationTotal + count}</span>`
      }
    }

    // add item counts to the page
    if (searchContainerCount) {
      searchContainerCount.innerHTML = `<span id="paging-info">${dataOffsetText}</span>`
    }

    // configure next and prev links
    prevLink = prev
      ? `<a href="#" class="pager-navigation" title="View the previous page" role="button" id="pagePrev" onclick="getPage(getCurrentPage(), document.getElementById("${utilityJS.SITE_SEARCH_ID}").value,"${prev.href}")">Prev</a>`
      : '<span class="pager-navigation disabled" title="There is no previous page available" role="button">Prev</span>'
    nextLink = next
      ? '<a href="#" class="pager-navigation" title="View the next page" role="button" id="pageNext">Next</a>'
      : '<span class="pager-navigation disabled" title="There is no next page available" role="button">Next</span>'
  }

  const SITE_SEARCH_ID = document.getElementById(utilityJS.SITE_SEARCH_ID) as HTMLInputElement

  // hide pagination when the item count is less than the page limit and on the first page
  const paginationCount = document.getElementById('pagination') as HTMLElement

  if (count < utilityJS.MAX_ITEMS_PER_PAGE && paginationTotal === 1) {
    paginationCount.style.display = 'none'
  } else {
    paginationCount.style.display = 'inline-block'
    paginationCount.innerHTML = `${prevLink}  ${nextLink}`

    const pagePrev = document.getElementById('pagePrev') as HTMLElement
    const pageNext = document.getElementById('pageNext') as HTMLElement

    if (pagePrev) pagePrev.onclick = () => dataJS.getPage(utilityJS.getCurrentPage(), SITE_SEARCH_ID.value, prev.href, 'prev')
    if (pageNext) pageNext.onclick = () => dataJS.getPage(utilityJS.getCurrentPage(), SITE_SEARCH_ID.value, next.href, 'next')
  }
}

/**
 * Triggered search
 */
export const search = (e: Event): void => {
  utilityJS.clearMessage()

  // only allow the alphabet and spaces when searching
  const re = /[A-Za-z\s]/

  let inputSearchBox
  if (document.getElementById(utilityJS.SITE_SEARCH_ID)) {
    inputSearchBox = document.getElementById(utilityJS.SITE_SEARCH_ID)! as HTMLInputElement
  }

  if (inputSearchBox && (inputSearchBox.value === '' || re.exec(inputSearchBox.value) === null)) {
    e.preventDefault()

    if (inputSearchBox.value === '') {
      utilityJS.showMessage('Please enter something to search for')
    } else if (re.exec(inputSearchBox.value) === null) {
      utilityJS.showMessage('Searching with numbers and/or special characters is not enabled')
    }
    inputSearchBox.focus()
  }
  if (inputSearchBox && inputSearchBox.value) {
    dataJS.getPage(utilityJS.getCurrentPage(), inputSearchBox.value)
    inputSearchBox.select()
  }
}

/**
 * Filter what a user is allowed to enter in the search field
 * Only allow searching with letters and spaces.  No numbers or special characters
 * @param {KeyboardEvent} event - key event
 * @return {boolean} - true if valid, otherwise false
 */
export const searchFilter = (event: KeyboardEvent): boolean => {
  const allowOnlyLettersAndSpace = /[A-Za-z\s]/
  return allowOnlyLettersAndSpace.test(event.key)
}

/**
 * Clear current search
 * @param {string} searchTextBoxID - id of search textbox
 */
export const searchClear = (searchTextBoxID: string): void => {
  utilityJS.clearMessage()

  const inputSearchBox = document.getElementById(searchTextBoxID)! as HTMLInputElement

  if (inputSearchBox.value === '') return

  inputSearchBox.value = ''

  document.getElementById('no-records')?.remove()

  dataJS.getPage(utilityJS.getCurrentPage(), '')
  utilityJS.animateLogo('logo-image', 'spin-reverse')
}

/**
 * Handle no records
 * @param {string} noRecordID - id of div to create
 * @param {string} searchedFor - searched for text
 * @param {string} appendToID - id of element to append to
 * @param {string} msg - message
 */
export const noRecordsFound = (
  noRecordID: string,
  searchedFor: string,
  appendToID: string,
  msg: string
): void => {
  const noRecordEL = document.getElementById(noRecordID) as HTMLElement
  const pagination = document.getElementById('pagination') as HTMLElement

  if (!noRecordEL && searchedFor) {
    // hide the content container
    document.getElementsByClassName('container')[0].classList.add('hide')

    pagination.style.display = 'none'

    // create a div with the error
    const notFound = document.createElement('div')
    notFound.id = noRecordID
    notFound.innerHTML = `${msg} '${searchedFor}'`

    // add error message
    const appendToEL = document.getElementById(appendToID) as HTMLElement
    appendToEL.appendChild(notFound)

    const preloadAnimationEL = document.getElementById('preloadAnimation') as HTMLElement
    if (preloadAnimationEL) {
      preloadAnimationEL.remove()
    }

    const searchCountEL = document.getElementById('search-count') as HTMLElement
    if (searchCountEL) {
      searchCountEL.innerHTML = '0 items'
    }
  } else {
    pagination.style.display = 'inline-block'
  }
}

/**
 * Parse out included data and return arrays
 * @param {Object} data - array of included data
 * @return {Array} - array of included data arrays
 */
export const getIncludedData = (data: any): Array<any> => {
  const includedAssetFilename = ['']
  const includedCompanyName = ['']
  const includedTechnologyName = ['']
  const includedTechnologyIcon = ['']

  data.included.forEach((includedElement: any) => {
    if (includedElement.attributes.description) {
      // extract image URL within quotes
      const iconFileNamePath = /'(.*?)'/.exec(includedElement.attributes.description.value) || ''

      includedTechnologyIcon[includedElement.id] = iconFileNamePath[1]
    }

    if (includedElement.attributes.filename) {
      includedAssetFilename[includedElement.id] = includedElement.attributes.filename
    }

    if (includedElement.attributes.field_company_name) {
      includedCompanyName[includedElement.id] = includedElement.attributes.field_company_name
    }

    if (includedElement.attributes.name) {
      includedTechnologyName[includedElement.id] = includedElement.attributes.name
    }
  })

  return [
    includedCompanyName,
    includedAssetFilename,
    includedTechnologyName,
    includedTechnologyIcon
  ]
}

/**
 * Parse out element relationship data
 * @param {Object} element -  relationship data
 * @param {Array} includedAssetFilename
 * @param {Array} includedCompanyName
 * @param {Array} includedTechnologyName
 * @param {Array} includedTechnologyIcon
 * @return {Array} array of element relationship arrays
 */
export const getElementRelationships = (
  element: any,
  includedAssetFilename: any,
  includedCompanyName: any,
  includedTechnologyName: any,
  includedTechnologyIcon: any
): Array<any> => {
  const imgPieces = []
  let itemPDF = ''
  let itemTrackImage = ''
  let itemCompanyName = ''
  let itemTechnology = ''
  let itemTechnologyIcon = ''
  const includedTechnologyItem = []

  // get course screenshot filename
  if (
    element.relationships.field_award_images && element.relationships.field_award_images.data
  ) {
    imgPieces.push(includedAssetFilename[element.relationships.field_award_images.data[0].id])
  }

  // get course PDF filename
  if (element.relationships.field_award_pdf && element.relationships.field_award_pdf.data) {
    itemPDF = includedAssetFilename[element.relationships.field_award_pdf.data.id]
  }

  // get course track image filename
  if (element.relationships.field_track_image && element.relationships.field_track_image.data) {
    itemTrackImage = includedAssetFilename[element.relationships.field_track_image.data.id]
  }

  // get company name
  if (element.relationships.field_company &&
    element.relationships.field_company.data) {
    itemCompanyName = includedCompanyName[element.relationships.field_company.data.id]
  }

  // get company screenshot filename
  if (element.relationships.field_company_screenshot &&
    element.relationships.field_company_screenshot.data) {
    imgPieces.push(includedAssetFilename[element.relationships.field_company_screenshot.data[0].id])
  }

  // get project screenshot filename
  if (element.relationships.field_screenshot &&
    element.relationships.field_screenshot.data) {
    for (let i = 0; i < element.relationships.field_screenshot.data.length; i++) {
      imgPieces.push(includedAssetFilename[element.relationships.field_screenshot.data[i].id])
    }
  }

  // get project technology name
  if (
    element.relationships.field_project_technology &&
    element.relationships.field_project_technology.data
  ) {
    for (let i = 0; i < element.relationships.field_project_technology.data.length; i++) {
      itemTechnology += `${includedTechnologyName[element.relationships.field_project_technology.data[i].id]} , `

      itemTechnologyIcon += `${includedTechnologyIcon[element.relationships.field_project_technology.data[i].id]} , `

      const technologyItem = {
        name: includedTechnologyName[element.relationships.field_project_technology.data[i].id],
        image: includedTechnologyIcon[element.relationships.field_project_technology.data[i].id]
      }
      includedTechnologyItem.push(technologyItem)
    }
  }

  return [
    imgPieces,
    itemPDF,
    itemTrackImage,
    itemCompanyName,
    itemTechnology,
    itemTechnologyIcon,
    includedTechnologyItem
  ]
}

/**
 * Highlight search term within a string
 * @param {string} itemToHighlight - string to search
 * @param {string} searchedFor - string to search for
 * @return {string} - search result with/without highlight
 */
export const itemWithSearchHighlight = (itemToHighlight: string, searchedFor: string): string => {
  let dataToReturn = ''

  if (searchedFor) {
    const searchTerm = new RegExp(searchedFor, 'gi')
    let results = ''

    let searchString = ''
    let searchStringArray = []

    if (itemToHighlight && +itemToHighlight !== -1) {
      searchString = itemToHighlight.replace('&amp;', '&').replace('&#039;', '\'')
    }

    /* check for HTML
     * TODO: use entities within Drupal to avoid adding body content with HTML
     */
    if (searchString.indexOf('<ul>') !== -1) {
      let listItem = ''

      const searchWithHTML = searchString.replace('<ul>', '').replace('</ul>', '') // remove ul tags
      searchStringArray = searchWithHTML.split('<li>') // break the li items into an array

      searchStringArray.forEach((element) => {
        if (element.length > 3) {
          searchString = element.slice(0, element.lastIndexOf('<')) // remove closing li tag

          if (searchString.match(searchTerm)) {
            results = searchString.replace(
              searchTerm,
              (match) => `<span class='highlightSearchText'>${match}</span>`
            )

            listItem += `<li>${results}</li>`
          } else {
            listItem += `<li>${searchString}</li>`
          }
        }
      })

      dataToReturn = `<ul>${listItem}</ul>`
    } else {
      if (searchString.match(searchTerm)) {
        results = searchString.replace(
          searchTerm,
          (match) => `<span class='highlightSearchText'>${match}</span>`
        )

        dataToReturn += results
      } else {
        dataToReturn += searchString
      }
    }
  }

  return dataToReturn || itemToHighlight
}

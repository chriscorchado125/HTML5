import * as dataJS from './data.js'
import * as utilityJS from './utilities.js'
import * as searchJS from './search.js'

window.onload = () => {
  document.getElementsByClassName('container')[0].classList.add('hide')

  fetch('./includes/nav.html')
    .then((response) => {
      return response.text()
    })
    .then((data) => {
      const thisNav = document.getElementById('navigation') as HTMLElement
      thisNav.innerHTML = data

      utilityJS.animateLogo('logo-image', 'spin')

      // Setup search functionality
      if (document.getElementById('search-container')) {
        const thisSearchSite = document.getElementById('search-site') as HTMLElement
        if (thisSearchSite) {
          thisSearchSite.onkeydown = (event) => searchJS.searchFilter(event)
        }

        const thisSearchSubmit = document.getElementById('search-submit') as HTMLElement
        if (thisSearchSubmit) {
          thisSearchSubmit.onclick = (event) => searchJS.search(event)
        }

        const thisSearchClearBtn = document.getElementById('search-clear-btn') as HTMLElement
        if (thisSearchClearBtn) {
          thisSearchClearBtn.onclick = (event) => searchJS.searchClear(utilityJS.SITE_SEARCH_ID)
        }
      }
    }).catch((error) => {
      alert(`Sorry an error has occurred: ${error}`)
    })

  fetch('./includes/footer.html')
    .then((response) => {
      return response.text()
    })
    .then((data) => {
      const footerEL = document.getElementById('footer') as HTMLElement

      if (footerEL) {
        footerEL.innerHTML = data
      }
    }).catch((error) => {
      alert(`Sorry an error has occurred: ${error}`)
    })

  dataJS.getPage(utilityJS.getCurrentPage(), '')
}

/**
 * Replace static navigation with data from the menu API
 * @param {string} currentPage - page name
 * @param {string} targetContainer - id of html container for the menu items
 */
export const updateMenuPages = async (baseURL: string, currentPage: string, targetContainer: string) => {
  await fetch(`${baseURL}/api/menu_items/main?_format=json`)
    .then((resp) => {
      return resp.ok ? resp.json() : Promise.reject(resp.statusText)
    })
    .then((pageData) => {
      let pageName = ''
      let pageLink = ''

      let homepageStyle = ''
      if (currentPage === 'about') {
        homepageStyle = 'border: 1px dashed rgb(115, 153, 234)'
      }

      let generatedPageLinks = `<a href='index.html' class='navbar-brand' id='logo' style='${homepageStyle}'>
        <img src='./images/chriscorchado-initials-logo.png' title='Home' alt='Home' id="logo-image">
      </a>`

      for (const page in pageData) {
        pageName = pageData[page].title
        if (pageName === 'Home' || pageName === 'About' || !pageData[page].enabled) {
          continue
        }

        let activeNavItem = ''
        if (currentPage === pageName.toLowerCase()) {
          activeNavItem = 'nav-item-active'
        }

        pageLink = pageName // capture correct link name before pageName is updated
        if (pageName === 'Companies') pageName = 'History'

        generatedPageLinks += `<a href='${pageLink.toLowerCase()}.html'
        class='nav-item nav-link ${activeNavItem}'
        title='${pageName}'
        id='${pageName.toLowerCase()}-link'>${pageName}</a>`
      }

      const targetContainerEL = document.getElementById(targetContainer) as HTMLElement
      targetContainerEL.innerHTML = generatedPageLinks
    })
    .catch((error) => {
      alert(`Sorry an error has occurred: ${error}`)
    })
}

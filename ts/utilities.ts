export const API_BASE = 'https://chriscorchado.com/drupal8'
export const MAX_ITEMS_PER_PAGE = 50
export const SITE_SEARCH_ID = 'search-site'

/**
 * Show message
 * @param {string} msg - message
 */
export const showMessage = (
  msg: string
): void => {
  // TODO: attach and then use timer to have message go away
  const userMessage = document.createElement('div')
  userMessage.id = 'user-message'
  userMessage.innerHTML = msg
}

/**
 * Create absolute link
 * @param {string} linkToFix - relative url
 * @param {string} page - page name
 * @return {string} - absolute url
 */
export const getFullUrlByPage = (linkToFix: string, page: string): string => {
  let pathToResource = 'No Path Found'

  switch (page) {
    case 'companies':
      pathToResource = 'company-screenshot'
      break
    case 'courses':
      if (linkToFix.indexOf('.pdf') !== -1) {
        pathToResource = 'award-pdf'
      } else {
        pathToResource = 'award-images'
      }
      break
    case 'projects':
      pathToResource = 'project-screenshot'
      break
    default:
  }

  return `${API_BASE}/sites/default/files/${pathToResource}/${linkToFix}`
}

/**
 * Change date to name of the month plus the 4 digit year
 * @param {string} dateString - date value
 * @return {string} - month and year - example: January 2020
 */
export const getMonthYear = (dateString: string): string => {
  const newDate = new Date(dateString)

  return (
    `${newDate.toLocaleString('default', { month: 'long' })}  ${newDate.getFullYear().toString()}`
  )
}

/**
 * Remove newline characters and spaces from URLs created using multi-line template literals
 * @param {string} urlToClean - URL to fix
 * @return {string} - fixed URL
 */
export const cleanURL = (urlToClean: string): string => {
  let fixedURL = ''
  const strings = urlToClean.split(' ')
  strings.forEach((element: string) => {
    if (element) fixedURL += element.replace(/$\n^\s*/gm, '')
  })
  return fixedURL
}

/**
 * Animate logo as a way to show loading, paging or any other processing
 * @param {string} logoID - ID of the HTML image tag
 * @param {string} animationID - options [spin, spin-reverse, breath] or empty string '' to disable
 */
export const animateLogo = (logoID: string, animationID: string): void => {
  const logoElement = document.getElementById(logoID) as HTMLElement

  const checkExist = setInterval(function () {
    if (logoElement) {
      if (animationID) {
        logoElement.setAttribute('src', `https://chriscorchado.com/images/chriscorchado-initials-logo-animated-${animationID}.gif`)
      } else {
        logoElement.setAttribute('src', 'https://chriscorchado.com/images/chriscorchado-initials-logo.png')
      }

      clearInterval(checkExist)
    }
  }, 100)
}

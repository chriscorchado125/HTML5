/**
 * Get the current page name
 * @return {string} - page name
 */
const getCurrentPage = () => {
    const thisPage = window.location.pathname
      .split('/')
      .filter(function (pathnamePieces) {
        return pathnamePieces.length
      })
      .pop()

    let pageName = ''
    if (thisPage) pageName = thisPage.split('.')[0]

    if (pageName === 'index' || pageName === 'html5' || !pageName) pageName = 'about'

    return pageName
  }

test('get homepage', () => {
    expect(getCurrentPage()).toMatch("about")
})
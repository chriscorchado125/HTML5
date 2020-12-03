/**
 * After a form is submitted set a thank you message
 * with a countdown that then forward to the homepage
 * @param {number} second - number of seconds to count down
 */
export const formSubmitted = (seconds: number) => {
  const countDown = document.createElement('div')
  countDown.style.padding = '50px'

  countDown.innerHTML = `<h2>Thanks For Your Submission</h2>
    <h4>Redirecting to the homepage in <span id="secondCountDown">${seconds}</span> seconds</h4>
    <img id="timer" src="https://chriscorchado.com/images/timer.gif" />`

  document.getElementsByClassName('container')[0].append(countDown)

  const updateCountDown = setInterval(function () {
    seconds--
    const secondCountDown = document.getElementById('secondCountDown') as HTMLElement
    secondCountDown.innerHTML = seconds.toString()

    if (seconds === 0) {
      clearInterval(updateCountDown)
      window.location.replace(

        // use replace instead of assign for the sake of history
        location.href.substring(0, location.href.lastIndexOf('/') + 1) // get the base site URL including sub-folder
      )
    }
  }, 1000)
}

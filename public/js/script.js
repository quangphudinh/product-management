
//Show alert chang trang thai
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("span[close-alert]");
   
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");        
    },time)
    // console.log(showAlert);

    closeAlert.addEventListener('click', () => {
        showAlert.classList.add("alert-hidden");
    })
}

// end Show alert
// Button status
const buttonStatus = document.querySelectorAll('[button-status]');
// console.log(buttonStatus);

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);

    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');
            console.log(status);
            if (status) {
                url.searchParams.set('status', status);
            }
            else {
                url.searchParams.delete('status');
            }
            window.location.href = url;
        })
    })
}
//end button

//form search
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url;
    })
}
//end form search

// pagination

const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            // console.log(page);
            url.searchParams.set('page', page);
            window.location.href = url;
        })
    })
}

//end pagination

//check-box-multi all products

const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputIdList = checkboxMulti.querySelectorAll("input[name='id']");
    // console.log(inputCheckAll , inputIdList);

    inputCheckAll.addEventListener('click', () => {
        if (inputCheckAll.checked) {
            inputIdList.forEach(input => {
                input.checked = true;
            })
        } else {
            inputIdList.forEach(input => {
                input.checked = false;
            })
        }
    })

    inputIdList.forEach(input => {
        input.addEventListener('click', () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked === inputIdList.length) {
                inputCheckAll.checked = true;
            }

            if (!input.checked) {
                inputCheckAll.checked = false;
            }
        })
    })
}

//end check-box-multi

// Form change multi

const formChangMulti = document.querySelector('[form-change-multi]');
if (formChangMulti) {
    formChangMulti.addEventListener('submit', (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector('[checkbox-multi]');
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;


        if (typeChange === 'delete-all') {
            const isConfirm = confirm('Bạn có muốn xóa những sản phẩm đã chọn ?');
            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange === 'change-position') {
                    //đứng từ thẻ (td) checkbox đã được tích , tìm đến th cha của nó (thẻ tr) , từ thẻ tr đó tìm đến thẻ input có name = position 
                    const position = input.closest('tr').querySelector('input[name="position"]').value;
                    ids.push(`${id}-${position}`);
                }
                else {
                    ids.push(id);
                }
            })

            inputIds.value = ids.join(',');
            formChangMulti.submit();
        } else {
            alert('Vui lòng chọn ít nhất một sản phẩm');
        }
    })
}

// end form change multi

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

//Prewiew image upload
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview]');
    const closeImage = document.querySelector('.btn-close');
    uploadImageInput.addEventListener('change', (e) => {
        // console.log(e.target.files[0]);
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
            closeImage.style.display = "block";
        }
    })
}
//end Prewiew image upload

// Remove image
const removeImage = document.querySelector('[remove-image-upload]');
if (removeImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview]');
    removeImage.addEventListener('click', () => {
        uploadImagePreview.src = "";
        uploadImageInput.value = "";
        removeImage.style.display = "none";
    })
}
// end Remove image

// Sort
const sort = document.querySelector('[sort]');
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector('[sort-select]');
    const sortClear = sort.querySelector('[sort-clear]');

    sortSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const [sortKey , sortValue] = value.split('-');
        
        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);

        window.location.href = url;
    })

    // Them selected cho option
    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');
    if (sortKey && sortValue) {
        const option = sortSelect.querySelector(`option[value="${sortKey}-${sortValue}"]`);
        option.selected = true;
    }

    // clear sort
    sortClear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');
        window.location.href = url;
    })
}
// End Sort
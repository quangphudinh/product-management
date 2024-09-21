// Cập nhật số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
        input.addEventListener("change" , (event) => {
            const prodcutId = event.target.getAttribute("product-id");
            const quantity = input.value;

            window.location.href = `/cart/update/${prodcutId}/${quantity}`
        })
    })
}
// Hết cập nhật so luong san pham trong giỏ hang
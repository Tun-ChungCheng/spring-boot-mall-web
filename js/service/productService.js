$(document).ready(function () {
  checkAccessToken()
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get('id')

  getProduct(productId)
})

function getProduct(productId) {
  $.ajax({
    type: 'get',
    url: `http://localhost:8080/api/products/${productId}`,
    success: function (response) {
      console.log(response)
    },
  })
}

function addToCart() {
  const productId = parseInt(selectedProductId)
  const quantity = parseInt($('#quantityVal').text())

  let amount = 0
  if (isProductInCart(productId)) showToast('此商品已存在購物車')
  else if (isQuantityEnough(productId, quantity)) showToast('此商品庫存不足')
  else {
    products.map((product) => {
      if (product.productId == productId) {
        amount = quantity * product.price

        $('#cart').append(`
        <div id="cartItem_${cart.length}" class="col mb-1">
          <div class="card">
            <img
              src="${product.imageUrl}"
              class="card-img-top"
              alt="${product.productName}"
            />
            <div class="card-footer">
              <small class="text-body-secondary">
                <button id="${cart.length}" onclick="deleteFromCart(this)" 
                class="btn btn-primary me-5" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                  </svg>
                </button>
                ${product.productName} ${quantity} $${amount}
              </small>
            </div>
          </div>
        </div>
    `)

        const data = {
          productId: product.productId,
          productName: product.productName,
          quantity: quantity,
          amount: amount,
        }
        cart[cart.length] = data
      }
    })
    showToast('成功加入購物車')
    addCreateOrderButton()
  }
}

function isProductInCart(productId) {
  let exist = false
  cart.map((cartItem) => {
    if (cartItem.productId == productId) exist = true
  })

  return exist
}

function isQuantityEnough(productId, quantity) {
  let enough = false
  products.map((product) => {
    if (product.productId === productId && product.stock < quantity)
      enough = true
  })

  return enough
}

function deleteFromCart(button) {
  if (cart.length === 1) cart = []
  else console.log(cart.splice(button.id, 1))
}

// function createOrder() {
//   let buyItemList = []
//   cart.map((cartItem, index) => {
//     buyItemList[index] = {
//       productId: cartItem.productId,
//       quantity: cartItem.quantity,
//     }
//   })

//   const data = {
//     buyItemList: buyItemList,
//   }

//   $.ajax({
//     contentType: 'application/json',
//     type: 'post',
//     headers: {
//       Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//     },
//     url: `http://localhost:8080/api/users/${localStorage.getItem(
//       'userId'
//     )}/orders`,
//     data: JSON.stringify(data),
//     success: function (response) {
//       showToast('訂單建立成功')
//       orderId = response.orderId
//     },
//     statusCode: {
//       403: function () {
//         showToast('請先註冊登入')
//       },
//     },
//   })
// }

// function calculateTotalAmount() {
//   let totalAmount = 0
//   cart.map((cartItem) => {
//     totalAmount += cartItem.amount
//   })
//   return totalAmount
// }

// function checkout() {
//   $.ajax({
//     contentType: 'application/json',
//     type: 'post',
//     headers: {
//       Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//     },
//     url: `http://localhost:8080/api/users/${localStorage.getItem(
//       'userId'
//     )}/orders/${orderId}`,
//     success: function (response) {
//       $('body').html(response)
//     },
//     statusCode: {
//       403: function () {
//         showToast('請先註冊登入')
//       },
//     },
//   })

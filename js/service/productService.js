const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'

let productId = 0
let product = {}
let cart = []

$(document).ready(function () {
  checkAccessToken()
  loadCart()
  const urlParams = new URLSearchParams(window.location.search)
  productId = urlParams.get('id')
  getProduct(productId)
})

function loadCart() {
  let savedCart = localStorage.getItem('cart')

  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
}

function addToCart() {
  let itemIndex = cart.findIndex(
    (cartItem) => cartItem.productId === parseInt(productId)
  )

  if (itemIndex !== -1) {
    $('#addToCartBtn').attr('disabled', true)
    showToast('商品已存在')
  } else {
    const item = {
      productId: product.productId,
      productName: product.productName,
      quantity: 1,
      amount: product.price,
    }

    cart.push({ ...item })
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('成功加入購物車')
    $('#addToCartBtn').attr('disabled', true)
    console.log(JSON.parse(localStorage.getItem('cart')))
  }
}

function getProduct(productId) {
  $.ajax({
    type: 'get',
    url: serverUrl + `/api/products/${productId}`,
    success: function (response) {
      console.log(response)
      setProduct(response)
    },
  })
}

function setProduct(response) {
  product = response

  $('#productName').text(product.productName)
  $('#description').text(product.description)
  $('#category').text(product.category)
  $('#createdDate').text(product.createdDate)
  $('#price').text('$' + product.price)
  $('.image').attr('src', 'data:image/png;base64,' + product.image)
}

function deleteFromCart() {
  if (cart.length === 1) cart = []
  else console.log(cart.splice(productId, 1))
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

const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'

let productId = 0
let product = {}
let cart = []

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search)
  productId = urlParams.get('id')

  checkAccessToken()
  loadCart()
  getProduct(productId)
})

function loadCart() {
  let savedCart = localStorage.getItem('cart')

  if (savedCart) cart = JSON.parse(savedCart)
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
      image: product.image,
    }
    cart.push({ ...item })
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('成功加入購物車')
    $('#addToCartBtn').attr('disabled', true)
  }
}

function getProduct(productId) {
  $.ajax({
    type: 'get',
    url: serverUrl + `/api/products/${productId}`,
    success: function (response) {
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

function buyNow() {
  addToCart()
  window.location.href = './cart.html'
}

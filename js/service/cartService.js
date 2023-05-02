const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'

let cart = []

$(document).ready(function () {
  checkAccessToken()
  loadCart()
})

function loadCart() {
  let savedCart = localStorage.getItem('cart')

  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  console.log(cart)
}

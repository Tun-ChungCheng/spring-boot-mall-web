let cart = []

$(document).ready(function () {
  checkAccessToken()
  cart = localStorage.getItem('cart')
  console.log(cart)
})

const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'
const userId = localStorage.getItem('userId')
const token = localStorage.getItem('accessToken')

let cart = []

$(document).ready(function () {
  checkAccessToken()
  loadCart()
  setCart()
})

function loadCart() {
  let savedCart = localStorage.getItem('cart')

  if (savedCart) {
    cart = JSON.parse(savedCart)
  }

  console.log(cart)
}

function setCart() {
  const cartList = $('#cartList')
  let totalAmount = 0
  cartList.empty()

  if (cart.length === 0) {
    $('#cartList').css({
      'background-image': 'url("./public/dogCart.png")',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
    })
  } else {
    cart.map((cartItem) => {
      totalAmount += cartItem.amount * cartItem.quantity
      cartList.append(`
      <div class="list">
        <div class="row ">
          <div id="image" class="col-4 item-img">
            <img
              id="itemIcon"
              class="image"
              src="data:image/png;base64,${cartItem.image}"
              style="object-fit: cover"
            />
            
          </div>
          <div class="col-6 item-name">
            <div class="row text-start">
              <div class="col-12 col-lg-6 product">
                <h4>${cartItem.productName}</h4>
              </div>
              <div class="col-12 col-lg-6 price">
                <h5>$${cartItem.amount * cartItem.quantity}</h5>
              </div>
            </div>
          </div>
          <div class="col-2">
            <a id="delete-${
              cartItem.productId
            }" class="btn btn-danger" onclick="deleteFromCart(this)"
              style="position: relative; right: 0.5rem;"><i class="fa-solid fa-x"></i
            ></a>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-lg-6 quantity">
            <div class="row">
              <div class="col-4 col-lg-3">
                <a id="reduce-${
                  cartItem.productId
                }" class="btn btn-outline-secondary" onclick="reduceQuantity(this)">
                  <i class="fa-solid fa-minus"></i>
                </a>
              </div>
              <div class="col-2 col-lg-2">
                <h5>${cartItem.quantity}</h5>
              </div>
              <div class="col-4 col-lg-3">
                <a id="add-${
                  cartItem.productId
                }" class="btn btn-outline-success" onclick="addQuantity(this)">
                  <i class="fa-solid fa-plus"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    })
    cartList.append(`
    <div class="text-center">
      <div class="col-12 col-lg-12 checkout">
        <button id="checkoutBtn" class="btn btn-success" onclick="createOrder()">
          <div class="d-flex justify-content-around">
            <div>結帳</div>
            <div class="total">$${totalAmount}</div>
          </div>
        </button>
      </div>
    </div>
  `)
  }
}

function reduceQuantity(button) {
  const productId = parseInt(button.id.substring(7))
  cart.forEach(function (item, index) {
    if (item.productId === productId) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        cart.splice(index, 1)
      }
    }
  })
  localStorage.setItem('cart', JSON.stringify(cart))
  setCart()
}

function addQuantity(button) {
  const productId = parseInt(button.id.substring(4))
  cart.forEach(function (item) {
    if (item.productId === productId) {
      if (item.quantity < 10) {
        item.quantity++
      }
    }
  })
  localStorage.setItem('cart', JSON.stringify(cart))
  setCart()
}

function deleteFromCart(button) {
  const productId = parseInt(button.id.substring(7))
  cart = cart.filter((item) => item.productId !== productId)
  localStorage.setItem('cart', JSON.stringify(cart))
  setCart()
}

function createOrder() {
  let buyItemList = []
  cart.map((cartItem, index) => {
    buyItemList[index] = {
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    }
  })
  const data = {
    buyItemList: buyItemList,
  }

  if (token === null) window.location.href = './auth.html'

  $('#checkoutBtn').empty()
  $('#checkoutBtn').append(
    '<div class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></div>'
  )
  $('#checkoutBtn').attr('disabled', true)

  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + `/api/users/${userId}/orders`,
    data: JSON.stringify(data),
    success: function (response) {
      const orderId = response.orderId
      checkout(orderId)
    },
    error: function (e) {
      console.log(e)
    },
  })
}

function checkout(orderId) {
  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + `/api/users/${userId}/orders/${orderId}`,
    success: function (response) {
      localStorage.removeItem('cart')
      $('body').html(response)
    },
    error: function (e) {
      console.log(e)
    },
  })
}

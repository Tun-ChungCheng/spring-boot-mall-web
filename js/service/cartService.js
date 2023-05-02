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

  cart.map((cartItem) => {
    totalAmount += cartItem.amount
    cartList.append(`
      <div class="list">
        <div class="row ">
          <div id="image" class="col-4 item-img ">
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
                <h5>NT${cartItem.amount}</h5>
              </div>
            </div>
          </div>
          <div class="col-2">
            <a id="${cartItem.productId}" class="btn btn-danger" onclick="deleteFromCart(this)"
              ><i class="fa-solid fa-x"></i
            ></a>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-lg-6 quantity">
            <div class="row">
              <div class="col-4 col-lg-3">
                <a class="btn btn-outline-secondary"
                  ><i class="fa-solid fa-minus"></i
                ></a>
              </div>
              <div class="col-2 col-lg-2">
                <h5>${cartItem.quantity}</h5>
              </div>
              <div class="col-4 col-lg-3">
                <a class="btn btn-outline-success" 
                  ><i class="fa-solid fa-plus"></i
                ></a>
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
      <button class="btn btn-success" onclick="createOrder()">
        <div class="d-flex justify-content-around">
          <div>結帳</div>
          <div class="total">$${totalAmount}</div>
        </div>
      </button>
    </div>
    </div>
  `)
}

function deleteFromCart(button) {
  const productId = button.id
  if (cart.length === 1) cart = []
  else console.log(cart.splice(productId, 1))
  localStorage.setItem('cart', cart)
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

  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + `/api/users/${userId}/orders`,
    data: JSON.stringify(data),
    success: function (response) {
      console.log(response.orderId)
      checkout(response.orderId)
    },
    error: function (e) {
      console.log(e)
    },
  })
}

function checkout(orderId) {
  console.log()
  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + `/api/users/${userId}/orders/${orderId}`,
    success: function (response) {
      console.log(response)
    },
    error: function (e) {
      console.log(e)
    },
  })
}

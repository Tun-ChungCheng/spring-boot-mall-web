const size = 6

let products = []
let cart = []
let page = 1
let category = ''
let search = ''
let orderId = 0
let selectedProductId = 0

ScrollReveal({ reset: true }).reveal('.game-type', {
  delay: 300,
})
ScrollReveal({ reset: true }).reveal('#myCarousel', {
  delay: 500,
})

function showToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: true,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    onClick: function () {}, // Callback after click
  }).showToast()
}

$(document).ready(function () {
  checkAccessToken()
  getProducts(1)
  getCategories()
})

function getProducts(page) {
  const url = `http://localhost:8080/api/products?page=${page}&size=${size}&category=${category}&search=${search}`

  $.ajax({
    type: 'get',
    url: url,
    success: function (response) {
      setProduct(response)
      setPages(response)
    },
  })
}

function setProduct(response) {
  products = [...response.results]
  const cardsEl = $('#cards')
  cardsEl.empty()

  // 建立商品卡
  for (let i = 0; i < products.length; i++) {
    cardsEl.append(cardComponent(products[i]))
  }
}

function cardComponent(product) {
  return `
  <div class="col">
    <div class="card">
      <img
        src="${product.imageUrl}"
        class="card-img-top"
        alt="${product.productName}"
      />
      <div class="card-body">
        <h5 class="card-title">
          <p class="mb-3">
            ${product.productName} 
          </p>
          <p> $${product.price}</p>
        </h5>
        <div class="d-grid gap-2 col-6 mx-auto">
          <button id='${product.productId}' type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropProduct" onclick="showProductDetail(this)">
            商品細節
          </button>
        </div>
      </div>
      <div class="card-footer">
        <small class="text-body-secondary">
          <span class="badge bg-secondary">${product.category}</span>
          庫存 ${product.stock}
        </small>
      </div>
    </div>
  </div>
  `
}

function setPages(response) {
  const totalPage = response.totalPages
  const pagesEl = $('#pages')

  pagesEl.empty()
  pagesEl.append(`
    <li id="previous" class="page-item">
      <a class="page-link" onclick="queryPreviousOrNext(${
        parseInt(page) - 1
      })">前一頁</a>
    </li>
  `)

  for (let pageNum = 1; pageNum < totalPage + 1; pageNum++) {
    pagesEl.append(`
      <li class="page-item" data-bs-toggle="tooltip" data-bs-placement="top" title="${pageNum}">
        <a id="page_${pageNum}" class="page-link" onclick="queryPage(this)">${pageNum}</a>
      </li>
    `)
  }

  pagesEl.append(`
    <li id="next" class="page-item">
      <a class="page-link" onclick="queryPreviousOrNext(${
        parseInt(page) + 1
      })">後一頁</a>
    </li>
  `)
  stylePageButton(totalPage)
}

$('#searchBtn').click(function (event) {
  event.preventDefault()
  search = $('#search').val()
  getProducts(1)
})

$('#confirmOrderBtn').click(function (event) {
  event.preventDefault()
  checkout()
})

function showProductDetail(button) {
  // const productId = button.id
  selectedProductId = button.id

  products.map((product) => {
    if (product.productId == selectedProductId) {
      $('#productName').text(product.productName)
      $('#addToCartBtn').attr('id', product.productId)
      $('#productDescription').text(product.description)
    }
  })
}

function queryPreviousOrNext(clickedPage) {
  page = clickedPage
  getProducts(page)
}

function queryPage(button) {
  page = button.innerText
  getProducts(page)
}

function stylePageButton(totalPage) {
  $('#page_' + page).addClass('active')

  if (page == 1 && page == totalPage) {
    $('#previous').addClass('disabled')
    $('#next').addClass('disabled')
  } else if (page == 1) {
    $('#previous').addClass('disabled')
  } else if (page == totalPage) {
    $('#next').addClass('disabled')
  }
}

function getCategories() {
  $.ajax({
    type: 'get',
    url: 'http://localhost:8080/api/products/categories',
    success: function (response) {
      setCategories(response)
    },
  })
}

function setCategories(response) {
  const categories = response
  const categoryMenuEl = $('#categoryMenu')

  categoryMenuEl.empty()
  categoryMenuEl.append(`
      <li><a class="dropdown-item" onclick="selectCategory()">ALL</a></li>
    `)
  for (const category of categories) {
    categoryMenuEl.append(`
      <li><a class="dropdown-item" onclick="selectCategory(this)">${category}</a></li>
    `)
  }
}

function selectCategory(anchor) {
  if (anchor === undefined) {
    $('#categoryBtn').text('ALL')
    category = ''
  } else {
    $('#categoryBtn').text(anchor.innerText)
    category = anchor.innerText
  }
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

function addCreateOrderButton() {
  const cartEl = $('#cart')

  if ($('#createOrderBtn')) $('#createOrderBtn').remove()

  cartEl.append(`
    <div id="createOrderBtn" class="text-center my-5">
      <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="createOrderTable()">
        建立訂單
      </button>
    </div>
  `)
}

function createOrderTable() {
  if (!localStorage.getItem('accessToken')) {
    showToast('請先註冊登入')
  } else {
    ceateOrder()

    const orderListEl = $('#orderList')
    orderListEl.empty()
    orderListEl.append(`
    <table id="orderTable" class="table table-hover">
      <thead class="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">商品</th>
          <th scope="col">數量</th>
          <th scope="col">價格</th>
        </tr>
      </thead>
      <tbody id="orderItem"></tbody>
    </table>
  `)

    const orderItemEl = $('#orderItem')
    for (let i = 0; i < cart.length; i++) {
      orderItemEl.append(`   
        <tr>
          <th scope="row">${i + 1}</th>
          <td>${cart[i].productName}</td>
          <td>${cart[i].quantity}</td>
          <td>${cart[i].amount}</td>
        </tr>  
    `)
    }

    orderItemEl.append(`
    <tr>
      <th scope="row">總額</th>
      <td colspan="2"></td>
      <td>${calculateTotalAmount()}</td>
    </tr>  
  `)
  }
}

function ceateOrder() {
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
    contentType: 'application/json',
    type: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
    url: `http://localhost:8080/api/users/${localStorage.getItem(
      'userId'
    )}/orders`,
    data: JSON.stringify(data),
    success: function (response) {
      showToast('訂單建立成功')
      orderId = response.orderId
    },
    statusCode: {
      403: function () {
        showToast('請先註冊登入')
      },
    },
  })
}

function calculateTotalAmount() {
  let totalAmount = 0
  cart.map((cartItem) => {
    totalAmount += cartItem.amount
  })
  return totalAmount
}

function checkout() {
  $.ajax({
    contentType: 'application/json',
    type: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
    url: `http://localhost:8080/api/users/${localStorage.getItem(
      'userId'
    )}/orders/${orderId}`,
    success: function (response) {
      $('body').html(response)
    },
    statusCode: {
      403: function () {
        showToast('請先註冊登入')
      },
    },
  })
}

function deleteFromCart(button) {
  if (cart.length === 1) cart = []
  else console.log(cart.splice(button.id, 1))

  $('#cartItem_' + button.id).remove()
}

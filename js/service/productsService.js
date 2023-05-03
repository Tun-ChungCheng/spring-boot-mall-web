const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'
const size = 6

let products = []
let cart = []
let page = 1
let category = ''
let search = ''
let orderId = 0
let selectedProductId = 0

$(document).ready(function () {
  checkAccessToken()
  getProducts(1)
  getCategories()
})

ScrollReveal({ reset: true }).reveal('.game-type', {
  delay: 300,
})

ScrollReveal({ reset: true }).reveal('#myCarousel', {
  delay: 500,
})

function getCategories() {
  $.ajax({
    type: 'GET',
    url: serverUrl + '/api/products/categories',
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

function getProducts(page) {
  $.ajax({
    type: 'GET',
    url:
      serverUrl +
      `/api/products?page=${page}&size=${size}&category=${category}&search=${search}`,
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

  products.map((product) => {
    cardsEl.append(`
    <div class="col">
      <div id="${product.productId}" class="card" style="cursor: pointer;" onclick="redirectProductPage(this)">
      <img src="data:image/png;base64,${product.image}" class="card-img-top" style='object-fit: cover' />
        <div class="card-body">
          <h5 class="card-title">
            <p class="mb-3" style="height:50px">
              ${product.productName} 
            </p>
            <p> $${product.price}</p>
          </h5>
        </div>
        <div class="card-footer">
          <small class="text-body-secondary">
            <span class="badge bg-secondary">${product.category}</span>
            庫存 ${product.stock}
          </small>
        </div>
      </div>
    </div>
    `)
  })
  $('.card').mouseover(function () {
    $(this).css('backgroundColor', '#ffd6ba')
  })
  $('.card').mouseout(function () {
    $(this).css('backgroundColor', '#fff')
  })
}

function redirectProductPage(divEl) {
  const productId = divEl.id
  window.location.href = `./product.html?id=${productId}`
  console.log(divEl)
}

function setPages(response) {
  const totalPage = response.totalPages

  const pagesEl = $('#pages')

  pagesEl.empty()

  pagesEl.append(`
    <li id="previous" class="page-item">
      <a class="page-link page-previous" style="background-color: #fff; font-size:24px; color: #000; cursor: pointer;" onclick="queryPreviousOrNext(${
        parseInt(page) - 1
      })">前一頁</a>
    </li>
  `)

  for (let pageNum = 1; pageNum < totalPage + 1; pageNum++) {
    pagesEl.append(`
      <li class="page-item" data-bs-toggle="tooltip" data-bs-placement="top" title="${pageNum}">
        <a id="page_${pageNum}" class="page-link" style="background-color: #fff; font-size:24px; color: #000; cursor: not-allowed;" onclick="queryPage(this)">${pageNum}</a>
      </li>
    `)
  }

  pagesEl.append(`
    <li id="next" class="page-item">
      <a class="page-link page-next" style="background-color: #fff; font-size:24px; color: #000; cursor: pointer;" onclick="queryPreviousOrNext(${
        parseInt(page) + 1
      })">後一頁</a>
    </li>
  `)
  $('.page-next').mouseover(function () {
    $('.page-next').css('backgroundColor', '#ffd6ba')
  })
  $('.page-next').mouseout(function () {
    $('.page-next').css('backgroundColor', '#fff')
  })
  $('.page-previous').mouseover(function () {
    $('.page-previous').css('backgroundColor', '#ffd6ba')
  })
  $('.page-previous').mouseout(function () {
    $('.page-previous').css('backgroundColor', '#fff')
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

function selectCategory(anchor) {
  if (anchor === undefined) {
    $('#categoryBtn').text('ALL')
    category = ''
  } else {
    $('#categoryBtn').text(anchor.innerText)
    category = anchor.innerText
  }
}

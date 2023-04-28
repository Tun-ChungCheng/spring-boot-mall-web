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

  products.map((product) => {
    cardsEl.append(`
    <div class="col">
      <div id="${product.productId}" class="card" onclick="redirectProductPage(this)">
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

// $('#searchBtn').click(function (event) {
//   event.preventDefault()
//   search = $('#search').val()
//   getProducts(1)
// })

// $('#confirmOrderBtn').click(function (event) {
//   event.preventDefault()
//   checkout()
// })

function selectCategory(anchor) {
  if (anchor === undefined) {
    $('#categoryBtn').text('ALL')
    category = ''
  } else {
    $('#categoryBtn').text(anchor.innerText)
    category = anchor.innerText
  }
}

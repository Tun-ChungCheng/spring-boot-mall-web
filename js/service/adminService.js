const token = localStorage.getItem('accessToken')

let products = []
let main = $('main')
let selectedProduct = 0 // 0 代表新增

$(document).ready(function () {
  checkAccessToken()
  getCategories()
})

function getCategories() {
  $.ajax({
    type: 'get',
    url: 'http://localhost:8080/api/products/categories',
    dataType: 'json',
    success: function (response) {
      setCategories(response)
    },
  })
}

function setCategories(response) {
  const categories = response
  const categoryEl = $('#category')
  categoryEl.empty()

  for (const category of categories) {
    categoryEl.append(`
      <option value="${category}">${category}</option>
    `)
  }
}

function showAllOrders() {}

function showAllProducts() {
  $.ajax({
    type: 'get',
    url: 'http://localhost:8080/api/products?page=0&size=10',
    dataType: 'json',
    success: function (response) {
      main.empty()
      setProductTable(response)
    },
  })
}

function setProductTable(response) {
  products = response.results

  main.append(`
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">名稱</th>
          <th scope="col">價格</th>
          <th scope="col">庫存</th>
          <th scope="col">類別</th>
          <th scope="col">敘述</th>
          <th scope="col">更新日期</th>
          <th scope="col">建立日期</th>
          <th scope="col"><button id="0" class="btn btn-primary" onclick="showProductForm(this)" data-bs-toggle="modal" data-bs-target="#productModal">新增</button></th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table> 
  `)

  const tbodyEl = $('tbody')
  products.map((product, index) => {
    tbodyEl.append(`    
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${product.productName}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.description}</td>
        <td>${product.lastModifiedDate}</td>
        <td>${product.createdDate}</td>
        <td><button id="${
          product.productId
        }" class="btn btn-info" onclick="showProductForm(this)" data-bs-toggle="modal" data-bs-target="#productModal">
          修改
            </button>
        </td>
      </tr>
    `)
  })
}

function showProductForm(button) {
  const productId = button.id
  selectedProduct = productId

  products.map((product) => {
    if (productId == product.productId) {
      $('#productName').attr({
        placeholder: product.productName,
        value: product.productName,
      })
      $('#price').attr({ placeholder: product.price, value: product.price })
      $('#stock').attr({ placeholder: product.stock, value: product.stock })
      $('#description').attr({
        placeholder: product.description,
        value: product.description,
      })
    }
  })
  if (selectedProduct == 0) {
    $('#productName, #price, #stock, #description').attr({
      placeholder: '',
      value: '',
    })
  }
}

function updateOrSaveProduct() {
  const data = {
    productName: $('#productName').val(),
    price: $('#price').val(),
    stock: $('#stock').val(),
    category: $('#category').val(),
    description: $('#description').val(),
    imageUrl: 'No Image',
  }

  selectedProduct != 0
    ? $.ajax({
        headers: {
          Authorization: token,
        },
        contentType: 'application/json',
        type: 'put',
        url: `http://localhost:8080/api/products/${selectedProduct}`,
        data: JSON.stringify(data),
        success: function () {
          showAllProducts()
        },
      })
    : $.ajax({
        headers: {
          Authorization: token,
        },
        contentType: 'application/json',
        type: 'post',
        url: `http://localhost:8080/api/products`,
        data: JSON.stringify(data),
        success: function () {
          showAllProducts()
        },
      })
}

function deleteProduct() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: 'application/json',
    type: 'delete',
    url: `http://localhost:8080/api/products/${selectedProduct}`,
    success: function () {
      showAllProducts()
    },
  })
}

function showAllCustomers() {}

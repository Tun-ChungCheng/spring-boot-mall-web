const token = localStorage.getItem('accessToken')
const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'

let products = []
let main = $('main')
let selectedProduct = 0 // 0 代表新增

$(document).ready(function () {
  checkAccessToken()
  getCategories()
})

function getCategories() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'GET',
    url: serverUrl + '/api/products/categories',
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
    type: 'GET',
    url: serverUrl + '/api/products?page=0&size=10',
    success: function (response) {
      main.empty()
      setProductTable(response)
    },
  })
}

function setProductTable(response) {
  products = response.results

  main.append(`
    <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover caption-top fw-bold">
        <caption>商品總覽</caption>
        <thead class="table-dark ">
          <tr>
            <th scope="col">#</th>
            <th scope="col">圖片</th>
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
    </div>
  `)

  const tbodyEl = $('tbody')
  products.map((product, index) => {
    tbodyEl.append(`    
      <tr>
        <th scope="row">${index + 1}</th>
        <td><img width="64" height="64" src="data:image/png;base64,${
          product.image
        }" style='object-fit: cover' /></td>
        <td>${product.productName}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>
          <span class="d-inline-block text-truncate" style="max-width: 100px;">
            ${product.description}
          </span>
        </td>
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

  const totalPages = response.totalPages
  if (totalPages > 1) {
    tbodyEl.append(`
      <button>next</button>
    `)
  }
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
  const formData = new FormData()
  formData.append('productName', $('#productName').val())
  formData.append('price', $('#price').val())
  formData.append('stock', $('#stock').val())
  formData.append('category', $('#category').val())
  formData.append('description', $('#description').val())
  formData.append('image', $('#image')[0].files[0])

  selectedProduct != 0
    ? $.ajax({
        headers: {
          Authorization: token,
        },
        type: 'PUT',
        url: serverUrl + `/api/products/${selectedProduct}`,
        processData: false,
        contentType: false,
        data: formData,
        success: function (rs) {
          console.log(rs)
          showToast('更新商品成功!')
          showAllProducts()
        },
        error: function () {
          showToast('更新商品失敗!')
        },
      })
    : $.ajax({
        headers: {
          Authorization: token,
        },
        type: 'POST',
        url: serverUrl + `/api/products`,
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
          showToast('新增商品成功!')
          showAllProducts()
        },
        error: function () {
          showToast('新增商品失敗!')
        },
      })
}

function deleteProduct() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'DELETE',
    url: serverUrl + `/api/products/${selectedProduct}`,
    success: function () {
      showToast('刪除商品成功!')
      showAllProducts()
    },
    error: function () {
      showToast('刪除商品失敗!')
    },
  })
}

function showAllCustomers() {}

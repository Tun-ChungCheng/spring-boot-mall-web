const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'
const token = localStorage.getItem('accessToken')
const userId = localStorage.getItem('userId')

let main = $('main')

$(document)
  .ready(function () {
    checkAccessToken()
    getOrders()
    $('#loadingSpinner').hide()
  })
  .ajaxStart(function () {
    $('#loadingSpinner').show()
  })
  .ajaxStop(function () {
    $('#loadingSpinner').hide()
  })

function getOrders() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'GET',
    url: serverUrl + `/api/users/${userId}/orders?size=100`,
    success: function (response) {
      console.log(response)
      setOrderTable(response)
    },
  })
}

function setOrderTable(response) {
  const orders = response.results
  const tbodyEl = $('tbody')

  orders.map((order, index) => {
    tbodyEl.append(`    
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${order.uuid}</td>
        <td>${order.totalAmount}</td>
        <td>${order.paymentStatus}</td>
        <td>${order.paymentDate}</td>
        <td>${order.createdDate}</td>
        <td>
          <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#order${
            order.uuid
          }" aria-expanded="false" aria-controls="order${order.uuid}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-down-square-fill" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6H4z"/>
            </svg>
          </button>
        </td>
      </tr>
      <tr class="bg-tertiary">
        <td colspan="7">
          <div class="collapse" id="order${order.uuid}">
            123
          </div>
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

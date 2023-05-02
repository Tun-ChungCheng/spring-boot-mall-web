const token = localStorage.getItem('accessToken')
const userId = localStorage.getItem('userId')
const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'

let main = $('main')

$(document).ready(function () {
  checkAccessToken()
  getOrders()
})

function getOrders() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'GET',
    url: serverUrl + `/api/users/${userId}/orders`,
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
        <td>${order.lastModifiedDate}</td>
        <td>${order.createdDate}</td>
        <td><button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
          v
        </button>
        <div class="collapse" id="collapseExample">
          <div class="card card-body">
            
          </div>
        </div></td>
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

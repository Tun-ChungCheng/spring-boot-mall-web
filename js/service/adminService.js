const token = localStorage.getItem('accessToken')
const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'
const size = 5
const role = {
  ROLE_ADMIN: '管理員',
  ROLE_MEMBER: '會員',
  ROLE_UNVERIFIED: '未驗證',
}
const gameType = {
  SURVIVAL: '生存',
  LEISURE: '休閒',
  CARD_GAME: '卡牌',
  GAME_THEORY: '博弈',
  UNIVERSE: '宇宙',
  MIDDLE_AGES: '中世紀',
  FANTASY: '奇幻',
  RHYTHM_GAME: '音遊',
  FPS: '射擊',
  SPORTS: '運動',
  RACING: '賽車',
  HORROR: '恐怖',
  VR_SIMULATION: 'VR模擬',
}

let products = []
let main = $('main')
let selectedProduct = 0 // 0 代表新增
let totalPages = 0
let productPage = 0
let userPage = 0
let orderPage = 0
let selectedAPI = ''

$(document)
  .ready(function () {
    checkAccessToken()
    showAllUsers()
  })
  .ajaxStart(function () {
    $('#loadingSpinner').show()
  })
  .ajaxStop(function () {
    $('#loadingSpinner').hide()
  })

// -----------------------------------------------------------------------------

function showAllProducts() {
  $.ajax({
    type: 'GET',
    url: `${serverUrl}/api/products?page=${productPage}&size=${size}`,
    success: function (response) {
      selectedAPI = 'products'
      totalPages = response.totalPages
      setProductTable(response)
    },
  })
}

function setProductTable(response) {
  products = response.results

  main.empty().append(`
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
          ${products
            .map(
              (product, index) =>
                `<tr>
                <th scope="row">${index + 1}</th>
                <td><img width="64" height="64" src="data:image/png;base64,${
                  product.image
                }" style='object-fit: cover' /></td>
                <td>${product.productName}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${gameType[product.category]}</td>
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
              `
            )
            .join('')}
        </tbody>
      </table> 
    </div>
  `)
  setPagination()
}

function getCategories() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'GET',
    url: `${serverUrl}/api/products/categories`,
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
      <option value="${category}">${gameType[category]}</option>
    `)
  }
}

function showProductForm(button) {
  resetProductForm()
  getCategories()
  const productId = button.id
  selectedProduct = productId

  if (selectedProduct == 0) {
    $('#deleteBtn').hide()
    $('#productModalLabel').text('新增商品')
  } else {
    products.map((product) => {
      $('#deleteBtn').show()
      $('#productModalLabel').text('修改商品')
      if (parseInt(productId) === product.productId) {
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
  }
}

function resetProductForm() {
  $('#form').empty().append(`
      <!-- 名稱 -->
      <div class="row mb-3">
        <label for="productName" class="col-sm-2 col-form-label"
          >名稱</label
        >
        <div class="col-sm-10">
          <input
            id="productName"
            name="productName"
            class="form-control"
            type="email"
          />
        </div>
      </div>
      <!-- 名稱 -->
      <!-- 價格 -->
      <div class="row mb-3">
        <label for="price" class="col-sm-2 col-form-label">價格</label>
        <div class="col-sm-10">
          <input
            name="price"
            type="number"
            class="form-control"
            id="price"
          />
        </div>
      </div>
      <!-- 價格 -->
      <!-- 庫存 -->
      <div class="row mb-3">
        <label for="stock" class="col-sm-2 col-form-label">庫存</label>
        <div class="col-sm-10">
          <input
            id="stock"
            name="stock"
            class="form-control"
            type="number"
          />
        </div>
      </div>
      <!-- 庫存 -->
      <!-- 類別 -->
      <div class="row mb-3">
        <label for="category" class="col-sm-2 col-form-label"
          >類別</label
        >
        <div class="col-sm-10">
          <select
            name="category"
            class="form-select"
            id="category"
          ></select>
        </div>
      </div>
      <!-- 類別 -->
      <!-- 敘述 -->
      <div class="row mb-3">
        <label for="description" class="col-sm-2 col-form-label"
          >敘述</label
        >
        <div class="col-sm-10">
          <textarea
            id="description"
            name="description"
            class="form-control"
          ></textarea>
        </div>
      </div>
      <!-- 敘述 -->
      <!-- 圖片 -->
      <div class="input-group">
        <input
          name="file"
          type="file"
          class="form-control"
          id="image"
          accept="image/jpeg, image/png, image/jpg"
          aria-describedby="inputGroupFileAddon04"
          aria-label="Upload"
        />
      </div>
      <!-- 圖片 -->
    </form>
  `)
}

function updateProduct() {
  const formData = new FormData()
  formData.append('productName', $('#productName').val())
  formData.append('price', $('#price').val())
  formData.append('stock', $('#stock').val())
  formData.append('category', $('#category').val())
  formData.append('description', $('#description').val())
  formData.append('image', $('#image')[0].files[0])

  parseInt(selectedProduct) !== 0
    ? $.ajax({
        headers: {
          Authorization: token,
        },
        type: 'PUT',
        url: `${serverUrl}/api/products/${selectedProduct}`,
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
          showToast('更新商品成功!')
          showAllProducts()
        },
        error: function () {
          showToast($('#image')[0].files[0] ? '更新商品失敗!' : '未加入圖片!')
        },
      })
    : $.ajax({
        headers: {
          Authorization: token,
        },
        type: 'POST',
        url: `${serverUrl}/api/products`,
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
          showToast('新增商品成功!')
          showAllProducts()
        },
        error: function () {
          showToast($('#image')[0].files[0] ? '新增商品失敗!' : '未加入圖片!')
        },
      })
}

function deleteProduct() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'DELETE',
    url: `${serverUrl}/api/products/${selectedProduct}`,
    success: function () {
      showToast('刪除商品成功!')
      showAllProducts()
    },
    error: function () {
      showToast('刪除商品失敗!')
    },
  })
}

// -----------------------------------------------------------------------------

function showAllUsers() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'GET',
    url: `${serverUrl}/api/users?page=${userPage}&size=${size}`,
    success: function (response) {
      selectedAPI = 'users'
      totalPages = response.totalPages
      setUserTable(response)
    },
  })
}

function setUserTable(response) {
  users = response.results
  main.empty().append(`
    <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover caption-top fw-bold">
        <caption>用戶總覽</caption>
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">信箱</th>
            <th scope="col">名稱</th>
            <th scope="col">權限</th>
            <th scope="col">上次登入</th>
            <th scope="col">建立日期</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user, index) =>
                `    
              <tr>
                <th scope="row">${index + 1}</th>
                <td>${user.email}</td>
                <td>${user.userName}</td>
                <td>${role[user.role]}</td>
                <td>${user.lastModifiedDate}</td>
                <td>${user.createdDate}</td>
              </tr>
              `
            )
            .join('')}
        </tbody>
      </table> 
    </div>
  `)
  setPagination()
}

// -----------------------------------------------------------------------------

function showAllOrders() {
  $.ajax({
    headers: {
      Authorization: token,
    },
    type: 'GET',
    url: `${serverUrl}/api/users/all/orders?page=${orderPage}&size=${size}`,
    success: function (response) {
      totalPages = response.totalPages
      selectedAPI = 'orders'
      setOrderTable(response)
    },
  })
}

function setOrderTable(response) {
  const orders = response.results

  main.empty().append(`
    <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover caption-top fw-bold">
        <caption>訂單總覽</caption>
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">編號</th>
            <th scope="col">用戶</th>
            <th scope="col">總價</th>
            <th scope="col">狀態</th>
            <th scope="col">交易日期</th>
            <th scope="col">建立日期</th>
            <th scope="col">細節</th>
          </tr>
        </thead>
        <tbody>
          ${orders
            .map(
              (order, index) =>
                `    
              <tr>
                <th scope="row">${index + 1}</th>
                <td>${order.uuid}</td>
                <td>${order.user.userName}</td>
                <td>${order.totalAmount}</td>
                <td>${
                  order.paymentStatus === 'UNPAY' ? '未付款' : '已付款'
                }</td>
                <td>${
                  !order.paymentDate ? '待交易完成後生成' : order.paymentDate
                }</td>
                <td>${order.createdDate}</td>
                <td>
                  <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#uuid${
                    order.uuid
                  }" aria-expanded="false" aria-controls="uuid${order.uuid}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-caret-down-square-fill" viewBox="0 0 16 16">
                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6H4z"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr class="bg-tertiary">
                <td colspan="8">
                  <div class="collapse" id="uuid${order.uuid}">
                    <table
                      class="table table-striped table-bordered table-hover fw-bold"
                    >
                      <thead class="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">名稱</th>
                          <th scope="col">數量</th>
                          <th scope="col">價格</th>
                        </tr>
                      </thead>
                
                      <tbody>
                        ${order.orderItems
                          .map(
                            (orderItem, index) =>
                              `<tr>
                                <th scope="row">${index + 1}</th>
                                <td>${orderItem.product.productName}</td>
                                <td>${orderItem.quantity}</td>
                                <td>${orderItem.amount}</td>
                              </tr>`
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
                `
            )
            .join('')}
        </tbody>
      </table> 
    </div>
  `)
  setPagination()
}

// -----------------------------------------------------------------------------

function setPagination() {
  const paginationEl = $('.pagination')

  paginationEl.empty()
  for (let i = 1; i < totalPages + 1; i++) {
    paginationEl.append(`
      <li id="page${i}" class="page-item" onclick="selectPage(this)">
        <span class="page-link">${i}</span>
      </li> 
    `)
  }
}

function selectPage(li) {
  const liEl = li
  switch (selectedAPI) {
    case 'products':
      productPage = liEl.id.substring(4)
      showAllProducts()
      break
    case 'users':
      userPage = liEl.id.substring(4)
      showAllUsers()
      break
    case 'orders':
      orderPage = liEl.id.substring(4)
      showAllOrders()
      break
  }
}

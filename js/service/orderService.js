const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'
const token = localStorage.getItem('accessToken')
const userId = localStorage.getItem('userId')

let main = $('main')

$(document)
  .ready(function () {
    checkAccessToken()
    getOrders()
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
    url: `${serverUrl}/api/users/${userId}/orders?size=5`,
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
        <td>${order.paymentStatus === 'UNPAY' ? '未付款' : '已付款'}</td>
        <td>${
          !order.paymentDate
            ? `<button id="${order.orderId}" class="btn btn-success" onclick="checkout(this)">結帳</button>`
            : order.paymentDate
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
        <td colspan="7">
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
    `)
  })
}

function checkout(button) {
  const orderId = button.id

  if (token === null) window.location.href = './auth.html'

  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: 'application/json',
    type: 'POST',
    url: `${serverUrl}/api/users/${userId}/orders/${orderId}`,
    success: function (response) {
      $('body').html(response)
    },
    error: function (e) {},
  })
}

const serverUrl = 'https://spring-boot-mall-api-production.up.railway.app'

$(document)
  .ready(function () {
    checkAccessToken()
    $('#loadingSpinner').hide()
  })
  .ajaxStart(function () {
    $('#loadingSpinner').show()
  })
  .ajaxStop(function () {
    $('#loadingSpinner').hide()
  })

$('#registerBtn').click(function (event) {
  event.preventDefault()
  register()
})

function register() {
  const data = {
    userName: $('#registerName').val(),
    email: $('#registerEmail').val(),
    password: $('#registerPassword').val(),
  }

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + '/api/users/register',
    data: JSON.stringify(data),
    success: function (response) {
      showToast('註冊成功，請驗證此帳號')
      console.log(response)
    },
    error: function () {
      showToast('使用者資料填寫有誤或已經註冊')
    },
  })
}

$('#loginBtn').click(function (event) {
  event.preventDefault()
  login()
})

function login() {
  const data = {
    email: $('#loginEmail').val(),
    password: $('#loginPassword').val(),
  }

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + '/api/users/login',
    data: JSON.stringify(data),
    success: function (response) {
      const role = response.role

      localStorage.setItem('userId', response.userId)
      localStorage.setItem('userName', response.userName)
      localStorage.setItem('accessToken', 'Bearer ' + response.accessToken)
      if (role === 'ROLE_UNVERIFIED') {
        showToast('請先驗證信箱')
      } else if (role === 'ROLE_ADMIN') {
        window.location.href = './admin.html'
      } else {
        window.location.href = './products.html'
      }
    },
    error: function () {
      showToast('使用者資料填寫有誤或尚未註冊')
    },
  })
}

$('#forgetPasswordBtn').click(function (event) {
  event.preventDefault()
  forgetPassword()
})

function forgetPassword() {
  const data = {
    email: $('#forgetPasswordEmail').val(),
  }

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    url: serverUrl + '/api/users/forget',
    data: JSON.stringify(data),
    success: function () {
      showToast('請前往信箱修改密碼')
    },
    error: function () {
      showToast('使用者資料填寫有誤或信箱未註冊')
    },
  })
}

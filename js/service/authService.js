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

$(document)
  .ready(function () {
    identifyUser()
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
    type: 'post',
    url: 'http://localhost:8080/api/users/register',
    data: JSON.stringify(data),
    success: function (response) {
      showToast('註冊成功，請驗證此帳號')
      console.log(response)
    },
    statusCode: {
      403: function () {
        showToast('使用者資料填寫有誤或已經註冊')
      },
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
    type: 'post',
    url: 'http://localhost:8080/api/users/login',
    data: JSON.stringify(data),
    success: function (response) {
      const role = response.role

      localStorage.setItem('userId', response.userId)
      localStorage.setItem('userName', response.userName)
      localStorage.setItem('accessToken', response.accessToken)
      if (role === 'ROLE_UNVERIFIED') {
        showToast('請先驗證信箱')
      } else {
        window.location.href = './user.html'
      }
    },
    statusCode: {
      403: function () {
        showToast('使用者資料填寫有誤或尚未註冊')
      },
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
    type: 'post',
    url: 'http://localhost:8080/api/users/forget',
    data: JSON.stringify(data),
    success: function () {
      showToast('請前往信箱修改密碼')
    },
    statusCode: {
      403: function () {
        showToast('使用者資料填寫有誤或信箱未註冊')
      },
    },
  })
}

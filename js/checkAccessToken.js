function checkAccessToken() {
  const token = localStorage.getItem('accessToken')
  const userName = localStorage.getItem('userName')

  console.log(token)
  if (token === null) {
    $('#authBtn').empty()
    $('#authBtn').append(`
      <li class="nav-item">
        <a class="nav-link" href="./auth.html"> 登入 </a>
      </li>
    `)
  }

  if (userName === 'ADMIN') {
    $('#authBtn').empty()
    $('#authBtn').append(`
      <li class="nav-item">
        <a class="nav-link" href="./admin.html"> 後台 </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="./index.html" onclick="logout()"> 登出 </a>
      </li>
    `)
  }
}

function logout() {
  localStorage.clear()
}

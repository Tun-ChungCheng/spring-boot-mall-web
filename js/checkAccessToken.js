function checkAccessToken() {
  const token = localStorage.getItem('accessToken')

  console.log(token)
  if (token === null) {
    $('#authBtn').empty()
    $('#authBtn').append(`
      <li class="nav-item">
        <a class="nav-link" href="./auth.html"> 登入 </a>
      </li>
    `)
  }
}

function logout() {
  localStorage.clear()
}

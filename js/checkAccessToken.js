function checkAccessToken() {
  const token = localStorage.getItem('accessToken')

  console.log(token)
  if (token !== null) {
    $('#authBtn').empty()
    $('#authBtn').append(`
      <a class="nav-link" href="./index.html" onclick="logout()"> 登出 </a>
    `)
  }
}

function logout() {
  localStorage.clear()
}

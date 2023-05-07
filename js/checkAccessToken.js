function checkAccessToken() {
  const url = new URL(location.href)
  let token = localStorage.getItem('accessToken')

  if (url.searchParams.get('token')) {
    token = `Bearer ${url.searchParams.get('token')}`
    localStorage.setItem('accessToken', token)
  }

  if (url.searchParams.get('userId')) {
    const userId = url.searchParams.get('userId')
    localStorage.setItem('userId', userId)
  }

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

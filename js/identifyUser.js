function identifyUser() {
  const token = localStorage.getItem('accessToken')
  const authBtn = $('#authBtn')

  console.log(token)
  // if (token !== null) {
  //   authBtn.empty()
  //   authBtn.append(`
  //     <button type="button" class="btn btn-secondary">
  //       個人資料
  //     </button>
  //   `)
  //   authBtn.attr('href', './user.html')
  // }
}

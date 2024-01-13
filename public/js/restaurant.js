(() => {

  const searchParams = new URLSearchParams(window.location.search)
  const tables = document.getElementById('tables')
  const lblUser = document.getElementById('user')

  if (!searchParams.has('user')) {
    window.location = 'index.html'
    throw new Error('Escritorio es requerido')
  }

  const userName = searchParams.get('user')
  console.log(userName)
  lblUser.innerText = userName


  tables.addEventListener('click', onClickTable)


  function onClickTable(event) {
    const target = event.target
    const Li = target.closest('LI')

    if (!Li) return
    if (!tables.contains(Li)) return
    // console.log(Li.id);
    const confirm = window.confirm('¿Quieres cambiar el estado de esta mesa?')
    if (confirm) {
      changeTableState({ idTable: Li.id })
    }

  }

  async function loadTables() {
    const tables = await fetch('http://localhost:3000/api/restaurant')
      .then(res => res.json())
      .catch(error => error)
    if (Array.isArray(tables)) {
      printTable(tables)
    }
  }


  function printTable(listOfTables) {
    const ulTemp = document.createDocumentFragment()
    let li = null
    for (let item of listOfTables) {
      const state = item.state[0] || 'EMPTY'
      li = document.createElement('li')
      li.innerHTML = `
      <li class="table ${state === 'BUSY' ? 'bussy' : ''}" id="${item.id}">
        <h3>M-${item.name}</h3>
      </li>
    `
      ulTemp.appendChild(li)
    }
    tables.innerHTML = ''
    tables.appendChild(ulTemp)
  }

  function changeTableState({ idTable }) {
    const url = 'http://localhost:3000/api/restaurant/updateState'

    const data = {
      id: idTable,
      userUpdate: userName
    }

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(data => {
      console.log(data);
      loadTables()
    })
      .catch(error => console.log(error))
  }

  function updateTable(tableUpdate) {
    const { id, name, state, userUpdate } = tableUpdate
    const table = document.getElementById(id)
    table.classList.toggle('bussy')

    const message = `${userUpdate}: ${state[0] === 'BUSY' ? 'Ocupado' : 'Libre'} mesa ${name}   `
    showAlert({ message })
  }

  function showAlert({ message, duration = 3000 }) {
    const alertShow = document.getElementById('alert-table-update')
    alertShow.innerHTML = `<span class="alet__message"> ${message}</span>`
    alertShow.style.right = '10px'

    setTimeout(() => {
      alertShow.style.right = '-100%'
    }, duration)

  }



  /******** SOCKET ************/

  function connectToWebSockets() {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data)
      if (type === 'on-table-state-change') {
        updateTable(payload)
      }
      // console.log(payload); // on-ticket-count-change
    };

    socket.onclose = (event) => {
      console.log('Connection closed');
      setTimeout(() => {
        console.log('retrying to connect');
        connectToWebSockets();
      }, 1500);
    };
    socket.onopen = (event) => {
      console.log('Connected');
    };
  }


  loadTables()
  connectToWebSockets()
})()
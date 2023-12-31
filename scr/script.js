                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          let map;
let marker;

let center = { lat: -6.577989, lng: -38.597960 };

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  marker = new google.maps.Marker({
    map: map,
    position: center,
    draggable: true
  });

  map.addListener("click", (evt) => {
    addMarker(evt);
  });

  marker.addListener('position_changed', () => {
    map.setCenter(marker.position);
  }); if (document.getElementById('form')) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });

    marker = new google.maps.Marker({
      map: map,
      position: center,
      draggable: true
    });

    map.addListener("click", (evt) => {
      addMarker(evt);
    });

  } if (document.getElementById('exibir')) {
    listar(google.maps)
  }

  if (document.getElementById('exibir-resultados')) {
    let map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    window.initMap = initMap;
    resultados(google.maps, map);
  }
}

function addMarker(evt) {
  marker.setPosition(evt.latLng);
}

async function salvar() {

  const obj = {
    nome: document.getElementById('nome').value,
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    dataInicio: document.getElementById('dataInicio').value,
    dataFim: document.getElementById('dataFim').value,
    lat: marker.getPosition().lat(),
    lng: marker.getPosition().lng()
  };
  await fetch("http://localhost:3000/evento/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }).then(response => {
    alert('Salvo com sucesso');
    window.location.assign('/');
  }).catch(error => alert('Falha ao salvar!'));

}
async function listar(maps) {

  fetch('http://localhost:3000/evento')
    .then((response) => response.json()).then((dados) => {
      const marcar = dados;
      const ul = document.getElementById('exibir')
      let infoWindow = new maps.InfoWindow();
      marcar.forEach(marcar => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const pDataInicio = document.createElement('p');
        const pDataFim = document.createElement('p');
        const p = document.createElement('p');
        const buttonEdit = document.createElement('button');
        const buttonDelet = document.createElement('button');
        ul.appendChild(li);
        li.appendChild(h3);
        li.appendChild(pDataInicio);
        li.appendChild(pDataFim);
        li.appendChild(p);
        li.appendChild(buttonEdit);
        li.appendChild(buttonDelet);
        h3.textContent = marcar.titulo;
        pDataInicio.textContent = `Inicio: ${marcar.dataInicio}`;
        pDataFim.textContent = `Fim: ${marcar.dataFim}`;
        p.textContent = `Descrição: ${marcar.descricao}`;
        buttonEdit.textContent = "Editar";
        buttonEdit.setAttribute('onclick', `window.location.assign('editar.html?id=${marcar._id}')`);
        buttonDelet.setAttribute('id', 'button-del')
        buttonDelet.textContent = "Deletar";
        buttonDelet.setAttribute('onclick', `deletar('${marcar._id}')`);


        const latLng = new maps.LatLng(
          marcar.lat,
          marcar.lng
        );

        let marker = new maps.Marker({
          position: latLng,
          map: map,
        });

        marker.addListener('click', () => {
          infoWindow.close();
          infoWindow.setContent(marcar.nome);
          infoWindow.open(marker.getMap(), marker);
        });

        map.addListener('click', () => {
          infoWindow.close();
        });
      });
    })
}

async function editar() {
  const url = new URLSearchParams(window.location.search);
  const id = url.get('id');

  const obj = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    dataInicio: document.getElementById('dataInicio').value,
    dataFim: document.getElementById('dataFim').value,
    lat: marker.getPosition().lat(),
    lng: marker.getPosition().lng()
  };
  await fetch(`http://localhost:3000/evento/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }).then(response => {
    alert('Alterado com sucesso');
    window.location.assign('/');
  }).catch(error => alert('Falha ao alterar!'));
}

async function deletar(id) {

  await fetch(`http://localhost:3000/evento/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    alert('Evento removido!');
    window.location.assign('/');
  }).catch(error => alert('Falha ao remover!'));
}

async function buscar() {
  const descricao = document.getElementById('input-buscar').value;
  window.location.assign(`buscar.html?descricao=${descricao}`);
}

async function resultados(maps, map) {
  const url = new URLSearchParams(window.location.search);
  const descricao = url.get('descricao');

  fetch(`http://localhost:3000/evento/${descricao}`)
    .then((response) => response.json()).then((dados) => {
      const marcar = dados;
      const ul = document.getElementById('exibir-resultados')
      if (marcar.length <= 0) ul.textContent = 'sem resultados'
      let infoWindow = new maps.InfoWindow();
      marcar.forEach(marcar => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const pDataInicio = document.createElement('p');
        const pDataFim = document.createElement('p');
        const p = document.createElement('p');
        const buttonEdit = document.createElement('button');
        const buttonDelet = document.createElement('button');
        ul.appendChild(li);
        li.appendChild(h3);
        li.appendChild(pDataInicio);
        li.appendChild(pDataFim);
        li.appendChild(p);
        li.appendChild(buttonEdit);
        li.appendChild(buttonDelet);
        h3.textContent = marcar.titulo;
        pDataInicio.textContent = `Inicio: ${marcar.dataInicio}`;
        pDataFim.textContent = `Fim: ${marcar.dataFim}`;
        p.textContent = `Descrição: ${marcar.descricao}`;
        buttonEdit.textContent = "Editar";
        buttonEdit.setAttribute('onclick', `window.location.assign('editar.html?id=${marcar._id}')`);
        buttonDelet.setAttribute('id', 'button-del')
        buttonDelet.textContent = "Deletar";
        buttonDelet.setAttribute('onclick', `deletar('${marcar._id}')`);


        const latLng = new maps.LatLng(
          marcar.lat,
          marcar.lng
        );

        let marker = new maps.Marker({
          position: latLng,
          map: map,
        });

        marker.addListener('click', () => {
          infoWindow.close();
          infoWindow.setContent(marcar.titulo);
          infoWindow.open(marker.getMap(), marker);
        });

        map.addListener('click', () => {
          infoWindow.close();
        });
      });
    })

    async function alter(lat, lng, id){
      const obj = {
        titulo: document.getElementById("titulo").value,
        dataInicio: document.getElementById("dataInicio").value,
        dataFim: document.getElementById("dataFim").value,
        descricao: document.getElementById("descricao").value,
        lat,
        lng,
      };
  
      try {
        const response = await axios.put(`http://localhost:3000/evento/${id}`, obj);
        response.status ? alert("Atualizado com sucesso") : null;
        window.location.assign('register.html');
      } catch (error) {
        alert("Erro ao atualizar");
      }
    };
  
    async function delet (id){
      try {
        await axios.delete(`http://localhost:3000/evento/${id}`);
        alert("O evento foi deletado.");
        window.location.reload();
      } catch (error) {
        alert("Ocorreu um erro ao deletar o evento.");
      }  
    }
  
    async function curtir(id){
      try {
        await axios.get(`http://localhost:3000/like/${id}`, {
          headers: {
            Authorization: document.cookie.substring(13),
          }
        });
        alert("Evento curtido.");
        window.location.reload();
      } catch (error) {
        const statusCode = error.response.status;
        if(statusCode == 404){
          alert("O usuário precisa estar logado para curtir eventos.");
        }
        if(statusCode == 500){
          alert('Ocorreu um erro ao curtir o evento.');
        }
      }  
    }
  
    async function recomendados(id, prop){
      try {
        const response = await axios.get(`http://localhost:3000/liked/${id}`);
        const array = response.data;
        array.map((event, index) => {
          prop.innerHTML = prop.innerHTML.concat(`
            <p style="padding:0;margin: 0;margin-top: 2px;">
              ${index+1}° - ${event.titulo}
            </p>  
          `);
        })
  
  
      } catch (error) {
        alert('Erro no servidor');
      }
    }
  }
  
window.initMap = initMap;
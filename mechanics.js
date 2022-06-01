//API UTILIZADA: api.covidtracking.com
//API DE LA INFORMACIÓN DE LOS ESTADOS: https://api.covidtracking.com/v1/states/info.json
//API DE DATOS DEL COVID DIARIOS DE LOS ESTADOS DE EEUU: https://api.covidtracking.com/v1/states/current.json

const app = document.getElementById('root');

function onload(){
//cargamos los datos básicos en pantalla

  //cargamos la lista de estados.
   let request = new XMLHttpRequest();
        request.open('GET', 'https://api.covidtracking.com/v1/states/info.json', true);
        request.onload = function () {
          let data = JSON.parse(this.response);
          const combostates = document.createElement('select');
          combostates.setAttribute('id', 'combostates');
          combostates.setAttribute('onchange','rellenodatos(document.getElementById("combostates").value)');
          let opcioninicial = document.createElement("option");
          opcioninicial.text="Elige un estado...";
          opcioninicial.value="Elige un estado...";
          combostates.appendChild(opcioninicial);
          document.getElementById("searchbar-container").appendChild(combostates);
          if (request.status >= 200 && request.status < 400) {
            data.forEach(data => {       
              let option = document.createElement("option");
              option.text = data.name;
              option.value = data.state;
              combostates.appendChild(option);
            });
          }
        }

       request.send();

    const logo = document.createElement('img');
    logo.src = 'https://static.vecteezy.com/system/resources/previews/002/640/725/original/account-info-profile-personal-data-icon-vector.jpg';
    logo.setAttribute ('id', 'logo');
    logo.setAttribute ('width', '150');
    app.appendChild(logo);
    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    app.appendChild(container);

}

    const floatingalert = async (strMessage) => {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      let newdiv = document.createElement('div');
      newdiv.id="errorpopup";
      newdiv.textContent=strMessage;
      newdiv.setAttribute('class', 'errorpopup');
      document.body.appendChild(newdiv);
          await delay(3000);
           document.body.removeChild(newdiv);
  }

    function clearresults(){
      const parent = document.querySelector('#root');
      const keepElem = document.querySelector('#logo');
                  
      [...parent.children]
       .forEach(child => child !== keepElem ? parent.removeChild(child) : null);
  }

function rellenodatos(strInput){

      //Borramos los datos del anterior estado del espacio de trabajo.
      clearresults();
      let request = new XMLHttpRequest();
      request.open('GET', 'https://api.covidtracking.com/v1/states/current.json', true);
      request.onload = function () {
        let data = JSON.parse(this.response);
        let data2 = JSON.parse(this.response);
        
        if (request.status >= 200 && request.status < 400) {
          data.forEach(data => {
            if (data.state==strInput){
              const card = document.createElement('div');
              card.setAttribute('class', 'card');
              const h1 = document.createElement('h1');
              let e = document.getElementById("combostates");
              let str = e.options[e.selectedIndex].text;
              h1.textContent = str+" ("+data.state+")";
              const listado = document.createElement("ul");   
                //Obtenemos los campos que nos interesan para mostrar sus datos en pantalla.
                let muertes = document.createElement("li");
                let contagios = document.createElement("li");
                let hospitalizados = document.createElement("li");
                let hospitalizados_actualmente = document.createElement("li");
                let fechadeactualizacion = document.createElement("li");

                //voy por aqui, si algún valor es null poner 0 en vez de null **************
                muertes.innerText = "Muertes totales:"+data.death;
                contagios.innerText= "Contagiados actualmente: "+data.positive;
                hospitalizados.innerText= "hospitalizados totales: "+data.hospitalized;
                hospitalizados_actualmente.innerText= "hospitalizados actualmente: "+data.hospitalizedCurrently;
                fechadeactualizacion.innerText= "Fecha de actualización de los datos: "+data.lastUpdateEt;

                listado.appendChild(muertes);
                listado.appendChild(contagios);
                listado.appendChild(hospitalizados);
                listado.appendChild(hospitalizados_actualmente);
                listado.appendChild(fechadeactualizacion);

              app.appendChild(card);
              app.appendChild(h1);
              app.appendChild(listado);
            }
           
          });
        } else {
          const errorMessage = document.createElement('marquee');
          errorMessage.textContent = `Gah, it's not working!`;
          app.appendChild(errorMessage);
        }
      }

      request.send();
}
    
    
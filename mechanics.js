//API UTILIZADA: api.covidtracking.com
//API DE LA INFORMACIÓN DE LOS ESTADOS: https://api.covidtracking.com/v1/states/info.json
//API DE DATOS DEL COVID DIARIOS DE LOS ESTADOS DE EEUU: https://api.covidtracking.com/v1/states/current.json

const url_info = 'https://api.covidtracking.com/v1/states/info.json';
const url_dataset = 'https://api.covidtracking.com/v1/states/current.json';
const app = document.getElementById('root');

function onload(){

          fetch(url_info)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    const combostates = document.createElement('select');
                combostates.setAttribute('id', 'combostates');
                combostates.setAttribute('onchange','rellenodatos(document.getElementById("combostates").value)');
                let opcioninicial = document.createElement("option");
                opcioninicial.text="Elige un estado...";
                opcioninicial.value="Elige un estado...";
                combostates.appendChild(opcioninicial);
                document.getElementById("searchbar-container").appendChild(combostates);
    for (let i = 0; i < data.length; i++) {
     //recorremos los datos del JSON
     let estados = data.results;
                
              let option = document.createElement("option");
              option.text = data[i].name;
              option.value = data[i].state;
              combostates.appendChild(option);
  
}
})
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

function comprobarvalor(valor){
  return (valor === null) ? "No hay datos de hoy" : valor;
}

function rellenodatos(strInput){

      //Borramos los datos del anterior estado del espacio de trabajo.
      clearresults();
          fetch(url_dataset)
.then(function (response) {
    return response.json();
})
.then(function (data) {
              const boxinfo = document.createElement('div');
              boxinfo.setAttribute('class', 'boxinfo');

              const h1 = document.createElement('h1');
              let tabladatos = document.createElement("ul");
              tabladatos.setAttribute ('id', 'tabladatos');

              let muertes = document.createElement("li");
              let contagios = document.createElement("li");
              let hospitalizados = document.createElement("li");
              let hospitalizados_actualmente = document.createElement("li");
              let fechadeactualizacion = document.createElement("li");
              let e = document.getElementById("combostates");
              let str = e.options[e.selectedIndex].text;
              
                //Obtenemos los campos que nos interesan para mostrar sus datos en pantalla.
                for (let i = 0; i < data.length; i++) {
                  if(data[i].state==strInput){
                  h1.textContent = str+" ("+data[i].state+")";
                  h1.setAttribute ('class', 'h1estado');
                  muertes.innerText = "Muertes totales: "+comprobarvalor(data[i].death);
                  contagios.innerText= "Contagiados actualmente: "+comprobarvalor(data[i].positive);
                  hospitalizados.innerText= "hospitalizados totales: "+comprobarvalor(data[i].hospitalized);
                  hospitalizados_actualmente.innerText= "hospitalizados actualmente: "+comprobarvalor(data[i].hospitalizedCurrently);
                  fechadeactualizacion.innerText= "Fecha de actualización de los datos: "+comprobarvalor(data[i].lastUpdateEt);
                  
                  tabladatos.appendChild(h1);
                  tabladatos.appendChild(muertes);
                  tabladatos.appendChild(contagios);
                  tabladatos.appendChild(hospitalizados);
                  tabladatos.appendChild(hospitalizados_actualmente);
                  tabladatos.appendChild(fechadeactualizacion);

                  boxinfo.appendChild(tabladatos);
                  app.appendChild(boxinfo);
                  
                  }
                  
                }
})
    
}
    
    
//API UTILIZADA: api.covidtracking.com
//API DE LA INFORMACIÓN DE LOS ESTADOS: https://api.covidtracking.com/v1/states/info.json
//API DE DATOS DEL COVID DIARIOS DE LOS ESTADOS DE EEUU: https://api.covidtracking.com/v1/states/current.json
const url_info = 'https://api.covidtracking.com/v1/states/info.json';
const url_dataset = 'https://api.covidtracking.com/v1/states/current.json';
const app = document.getElementById('root');
const divmedio = document.createElement('div');
let datos_estados=[];
let datos_covid=[];

//método para obtener los datos una vez y no pedirlos constantemente
async function obtenerDatosAPI(url) {
  const response = await fetch(url);
  return response.json();
}

async function onload() {
//declaramos como variable global los datos para que durante la ejecución no haga falta hacer fetch constantemente.
datos_estados = await obtenerDatosAPI(url_info); 
datos_covid = await obtenerDatosAPI(url_dataset);
const combostates = document.createElement('select');
combostates.setAttribute('id', 'combostates');
combostates.setAttribute('onchange', 'rellenodatos(document.getElementById("combostates").value)');
let opcioninicial = document.createElement("option");
opcioninicial.text = "Elige un estado...";
combostates.appendChild(opcioninicial);
document.getElementById("searchbar-container").appendChild(combostates);
    
  for (var i = 0; i < datos_estados.length; i++) { 
    let option = document.createElement("option");
    option.text = datos_estados[i].name;
    option.value = datos_estados[i].state;
    combostates.appendChild(option);

  }
       
    const logo = document.createElement('img');
    divmedio.setAttribute('id', 'divmedio');
    divmedio.setAttribute('class','divmedio');
    app.appendChild(divmedio);
    logo.src = 'https://static.vecteezy.com/system/resources/previews/002/640/725/original/account-info-profile-personal-data-icon-vector.jpg';
    logo.setAttribute('id', 'logo');
    logo.setAttribute('width', '150');
    divmedio.appendChild(logo);
    toptentoday();
}

function toptentoday(){
  //función para sacar el top TEN de fallecimientos por COVID diarios.

            const h1 = document.createElement('h1');
            h1.textContent = "TOP 10 estados con más fallecimientos en el día de hoy";
            divmedio.appendChild(h1);

            let tablatop = document.createElement("ul");
            tablatop.appendChild(h1);
            tablatop.setAttribute('id', 'tablatop');
            tablatop.setAttribute('class', 'tablatop');

            datos_covid.sort((a, b) => parseFloat(b.death) - parseFloat(a.death));

            for (let i = 0; i<10; i++) {
            let estadodeltop = document.createElement("li");
            estadodeltop.textContent=datos_covid[i].state+" "+datos_covid[i].death;
            tablatop.appendChild(estadodeltop);
              }
            divmedio.appendChild(tablatop);

}

function clearresults() {
    let oldresults= document.getElementById('boxinfo');
    if(oldresults==null){
      return;
    }else{
      oldresults.remove();
    }
}

function comprobarvalor(valor) {
    return (valor === null) ? "No hay datos de hoy" : valor;
}

function rellenodatos(strInput) {

            //Borramos los datos del anterior estado del espacio de trabajo.
            clearresults();
            const boxinfo = document.createElement('div');
            boxinfo.setAttribute('class', 'boxinfo');
            boxinfo.setAttribute('id', 'boxinfo');

            const h1 = document.createElement('h1');
            let tabladatos = document.createElement("ul");
            tabladatos.setAttribute('id', 'tabladatos');

            let muertes = document.createElement("li");
            let contagios = document.createElement("li");
            let hospitalizados = document.createElement("li");
            let hospitalizados_actualmente = document.createElement("li");
            let fechadeactualizacion = document.createElement("li");
            let e = document.getElementById("combostates");
            let str = e.options[e.selectedIndex].text;

            //Obtenemos los campos que nos interesan para mostrar sus datos en pantalla.
            for (let i = 0; i < datos_covid.length; i++) {

            //construimos el objeto estado_selectionado
            let estado_seleccionado = new Map();
            estado_seleccionado.set("estado",datos_covid[i].state);
            estado_seleccionado.set("muertes",datos_covid[i].death);
            estado_seleccionado.set("contagios",datos_covid[i].positive);
            estado_seleccionado.set("hospitalizados",datos_covid[i].hospitalized);
            estado_seleccionado.set("hospitalizados_actualmente",datos_covid[i].hospitalizedCurrently);
            estado_seleccionado.set("fechadeactualizacion",datos_covid[i].lastUpdateEt);

                if (datos_covid[i].state == strInput) {
                    h1.textContent = "Datos de "+str + " (" + estado_seleccionado.get("estado") + ")";
                    h1.setAttribute('class', 'h1estado');
                    muertes.innerText = "Muertes totales: " + comprobarvalor(estado_seleccionado.get("muertes"));
                    contagios.innerText = "Contagiados actualmente: " + comprobarvalor(estado_seleccionado.get("contagios"));
                    hospitalizados.innerText = "Hospitalizados totales: " + comprobarvalor(estado_seleccionado.get("hospitalizados"));
                    hospitalizados_actualmente.innerText = "Hospitalizados actualmente: " + comprobarvalor(estado_seleccionado.get("hospitalizados_actualmente"));
                    fechadeactualizacion.innerText = "Fecha de actualización de los datos: " + comprobarvalor(estado_seleccionado.get("fechadeactualizacion"));

                    tabladatos.appendChild(h1);
                    tabladatos.appendChild(muertes);
                    tabladatos.appendChild(contagios);
                    tabladatos.appendChild(hospitalizados);
                    tabladatos.appendChild(hospitalizados_actualmente);
                    tabladatos.appendChild(fechadeactualizacion);

                    boxinfo.appendChild(tabladatos);
                    app.appendChild(boxinfo);
                    return; //paramos de recorrer una vez obtenidos los datos.
                }

            }

}
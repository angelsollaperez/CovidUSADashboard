//API UTILIZADA: api.covidtracking.com
//API DE LA INFORMACIÓN DE LOS ESTADOS: https://api.covidtracking.com/v1/states/info.json
//API DE DATOS DEL COVID DIARIOS DE LOS ESTADOS DE EEUU: https://api.covidtracking.com/v1/states/current.json
const url_info = 'https://api.covidtracking.com/v1/states/info.json';
const url_dataset = 'https://api.covidtracking.com/v1/states/current.json';
const app = document.getElementById('root');
const divmedio = document.createElement('div');

//constructor del objeto estado_seleccionado
function estadoOBJ (nombre,muertes,contagios,hospitalizados,hospitalizados_actualmente,fechadeactualizacion) {
    this.nombre = nombre;
    this.muertes = muertes;
    this.contagios = contagios;
    this.hospitalizados = hospitalizados;
    this.hospitalizados_actualmente = hospitalizados_actualmente;
    this.fechadeactualizacion = fechadeactualizacion;
}

function onload() {
    fetch(url_info)
        .then(function(response) {
            return response.json();

        })
        .then(function(data) {
            const combostates = document.createElement('select');
            combostates.setAttribute('id', 'combostates');
            combostates.setAttribute('onchange', 'rellenodatos(document.getElementById("combostates").value)');
            let opcioninicial = document.createElement("option");
            opcioninicial.text = "Elige un estado...";
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
    clearresults();
    fetch(url_dataset)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const h1 = document.createElement('h1');
            h1.textContent = "TOP 10 estados con más fallecimientos en el día de hoy";
            divmedio.appendChild(h1);

            let tablatop = document.createElement("ul");
            tablatop.appendChild(h1);
            tablatop.setAttribute('id', 'tablatop');
            tablatop.setAttribute('class', 'tablatop');

            data.sort((a, b) => parseFloat(b.death) - parseFloat(a.death));

            for (let i = 0; i<10; i++) {
            let estadodeltop = document.createElement("li");
            estadodeltop.textContent=data[i].death+" "+data[i].state;
            tablatop.appendChild(estadodeltop);
              }
                divmedio.appendChild(tablatop);
            })

}

function clearresults() {
    const parent = document.querySelector('#boxinfo');
    const keepElem = document.querySelector('#logo');

    if(parent==null){
      return;
    }else{
        [...parent.children]
    .forEach(child => child !== keepElem ? parent.removeChild(child) : null);
    }
  
}

function comprobarvalor(valor) {
    return (valor === null) ? "No hay datos de hoy" : valor;
}

function rellenodatos(strInput) {

    //Borramos los datos del anterior estado del espacio de trabajo.
    clearresults();
    fetch(url_dataset)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
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
            for (let i = 0; i < data.length; i++) {

            //construimos el objeto estado_selectionado
            var estado_seleccionado = new estadoOBJ(data[i].state, data[i].death,data[i].positive,data[i].hospitalized,data[i].hospitalizedCurrently,data[i].lastUpdateEt);

                if (data[i].state == strInput) {
                    h1.textContent = "Datos de "+str + " (" + estado_seleccionado.nombre + ")";
                    h1.setAttribute('class', 'h1estado');
                    muertes.innerText = "Muertes totales: " + comprobarvalor(estado_seleccionado.muertes);
                    contagios.innerText = "Contagiados actualmente: " + comprobarvalor(estado_seleccionado.contagios);
                    hospitalizados.innerText = "Hospitalizados totales: " + comprobarvalor(estado_seleccionado.hospitalizados);
                    hospitalizados_actualmente.innerText = "Hospitalizados actualmente: " + comprobarvalor(estado_seleccionado.hospitalizados_actualmente);
                    fechadeactualizacion.innerText = "Fecha de actualización de los datos: " + comprobarvalor(estado_seleccionado.fechadeactualizacion);

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
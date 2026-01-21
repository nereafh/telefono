
/*
let TECLAS = null;

//Cargar JSON primero
fetch("teclas.json")
    .then(res => res.json())
    .then(data => {
        TECLAS = data;
        iniciarTelefono();
    })
    .catch(err => console.error("Error cargando JSON:", err));

*/

/*
const TECLAS ={
    "1": ["1"],
    "2": ["2", "A", "B", "C"],
    "3": ["3", "D", "E", "F"],
    "4": ["4", "G", "H", "I"],
    "5": ["5", "J", "K", "L"],
    "6": ["6", "M", "N", "O"],
    "7": ["7", "P", "Q", "R", "S"],
    "8": ["8", "T", "U", "V"],
    "9": ["9", "W", "X", "Y", "Z"],
    "0": ["0"]
};
*/


/*

Para utilizar el json local necesito sí o sí utilizar un servidor local, 
si no lo tengo para hacer la prueba rápida pongo en el terminal: 
el cd y php -S localhost:8000, me voy a la url localhost:8000 y ya puedo probar el json, sino 
descomentar, utilizar el array y borrar el json fetch 
*/

let TECLAS = null;

fetch("teclas.json")
    .then(response => response.json())
    .then(data => { 
        TECLAS = data;
        iniciarTelefono();
    })
    .catch(err => console.error("Error cargando JSON:", err));

class Telefono {
    constructor() {
        this.texto = ""; //lo que se ve en la pantalla del telefono (las letras al pulsar mas de una vez)
        this.ultimaTecla = null; //la ultima tecla pulsada, para saber si se pulsa la misma o no, multiclick
        this.indice = 0; //para saber que letra de la tecla se debe mostrar dentro del array TECLAS
        this.timer = null; //una vez que pasan 800ms sin pulsar, se resetea la ultimaTecla e indice
        this.pantalla = document.getElementById('pantalla'); //para no tener que buscarla cada vez
    }
    
    pulsar(tecla){ //se ejecuta al pulsar una tecla del telefono
        //if (!TECLAS || !TECLAS[tecla]) return; //si no se ha cargado el JSON o la tecla no existe, salir
        if (this.ultimaTecla === tecla) { //si es la misma tecla cambiamos a letra
            this.indice = (this.indice + 1) % TECLAS[tecla].length; //ciclo entre las letras de la tecla
            this.texto = this.texto.slice(0, -1) + TECLAS[tecla][this.indice]; //borra la ultima letra y pone la nueva
        } else { 
            this.ultimaTecla = tecla;
            this.indice = 0;
            this.texto += TECLAS[tecla][0];
        }


        this.actualizarPantalla();
        this.reiniciarTimer();
    }

    //Si pasan 800ms sin pulsar, resetea ultimaTecla e indice
    reiniciarTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
        this.ultimaTecla = null;
        this.indice = 0;
        }, 800);
    }


    actualizarPantalla() {
        this.pantalla.value = this.texto;
        this.validar();
    }

    validar() {
        const regex = /^[6789]\d{8}$/;
        if (regex.test(this.texto)) {
        this.pantalla.style.background = "#b6fcb6";
        } else {
        this.pantalla.style.background = "#fcb6b6";
        }


        if (this.texto.includes("CUMPLE")) {
        this.colgar();
        }
    }

    colgar() {
        this.texto = "";
        this.actualizarPantalla();
    }

    llamar() {
    if (!/^[6789]\d{8}$/.test(this.texto)) return;


    sessionStorage.setItem("ultimoNumero", this.texto);


    //Guardar el último número válido marcado uno tras otro en el historial
    const input = document.createElement("input");
    input.value = this.texto;
    input.readOnly = true;
    document.getElementById("historial").appendChild(input); //añade el elemento creado al historial


    this.texto = "";
    this.actualizarPantalla();
    }



}

function iniciarTelefono() {
    const telefono = new Telefono();


    /*Ambos permiten delegación de eventos

    getElementById("miElemento").addEventListener("click", miFunción);
    - Selecciona un elemento por su id, solo funciona con ids, devuelve el elemento

    querySelector(".miClase").addEventListener("mouseover", otraFunción, true);
    - También permite id pero se pone con #miId
    - Permite clases .miClase
    - Por etiqueta <button>1</button> -> "button"
    - Por atributos [data-atributo="valor"]
    */
    //element.addEventListener(evento, función, extras);
    document.getElementById("teclado").addEventListener("mouseup", e => {
    e.preventDefault();

    /*
    Siempre que se quiera hacer una delegación de eventos, hay que poner e.target
    para saber en qué elemento se ha hecho click realmente.

    Para acceder a atributos personalizados (data-*) se usa dataset + . + nombreAtributo
    */
    if (e.target.dataset.tecla) {
    telefono.pulsar(e.target.dataset.tecla);
    }
    });

    document.getElementById("llamar").addEventListener("mouseup", e => {
    e.preventDefault();
    telefono.llamar();
    });


    document.getElementById("colgar").addEventListener("mouseup", e => {
    e.preventDefault();
    telefono.colgar();
    });
}
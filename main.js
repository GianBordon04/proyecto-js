const personajes = './data.json';

let enemigos = [];
let roles = [];

fetch(personajes)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json();
    })
    .then(data => {
        enemigos = data.enemigos;
        roles = data.roles;
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });

let playerName;
let playerRace;
let playerRol;

let playerHealth = 100;
let playerEvasion = 1;
let round = 1;

let damage = 0;

let enemigoAleatorio;

let mensajeCombate = "";

let padre = document.getElementById("padre");
padre.innerHTML = `
        <div>
            <p>Ingresa tu nombre</p>
            <input id="nombre" type="text" placeholder="Nombre"></input>
        </div>
        <div>
            <p>¿Que raza eliges?(humano, elfo, enano)</p>
            <select id="raza">
                <option value="humano">Humano</option>
                <option value="elfo">Elfo</option>
                <option value="enano">Enano</option>
            </select>
        </div>
        <div>
            <p>¿Qué rol eliges? (guerrero, mago, arquero)</p>
            <select id="roles">
                <option value="guerrero">Guerrero</option>
                <option value="mago">Mago</option>
                <option value="arquero">Arquero</option>
            </select>
        </div>
        <button id="btnJugar"> Jugar </button>
    `;
    let integrantesDeLaBatalla = document.getElementById("integrantesDeLaBatalla");

    function actualizarIntegrantesDeLaBatalla() {
        
        // Vacía el contenido anterior de la sección de batalla
        integrantesDeLaBatalla.innerHTML = '';
        
        // Div del jugador
        const jugadorDiv = document.createElement("div");
        jugadorDiv.innerHTML = `
            <h4 class="titulos">Jugador</h4>
            <p class="nombres">Nombre: ${playerName}</p>
            <p class="datos">Rol: ${playerRol}</p>
            <p class="datos">Raza: ${playerRace}</p>
        `;
        integrantesDeLaBatalla.appendChild(jugadorDiv);
        
        // Div del enemigo
        const enemigoDiv = document.createElement("div");
        enemigoDiv.innerHTML = `
            <h4 class="titulos">Enemigo</h4>
            <p class="nombre">Nombre: ${enemigoAleatorio.enemyName}</p>
            <p class="datos">Salud: ${enemigoAleatorio.enemyHealth}</p>
        `;
        integrantesDeLaBatalla.appendChild(enemigoDiv);
    }

let enemyAttack;

function disabledPlay() {
    const btnJugar = document.getElementById("btnJugar");
    btnJugar.disabled = true;
}

// Generador de enemigos aleatorio
function generarEnemigoAleatorio() {
    if (enemigos && enemigos.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * enemigos.length);
        enemigoAleatorio = enemigos[indiceAleatorio];

        enemyName = enemigoAleatorio.enemyName;
        enemyID = enemigoAleatorio.enemyID;
        enemyHealth = enemigoAleatorio.enemyHealth;
        enemyAttack = enemigoAleatorio.enemyAttack || 0;
    }
}

const btnJugar = document.getElementById("btnJugar");
btnJugar.addEventListener('click', function () {
    playerName = document.getElementById("nombre").value;
    playerRace = document.getElementById("raza").value.toLowerCase();
    playerRol = document.getElementById("roles").value.toLowerCase();
    generarEnemigoAleatorio();
    disabledPlay();

    // Bonus de roles
    const chosenRol = Array.isArray(roles) ? roles.find(rol => rol.name === playerRol) : null;
    if (chosenRol) {
        damage += chosenRol.rolDamage || 0;
        playerHealth += chosenRol.rolHealth || 0;
        playerEvasion += chosenRol.rolEvasion || 0;
    }

    // Bonus de razas
    if (playerRace === "humano") {
        damage += 5;
    } else if (playerRace === "elfo") {
        playerEvasion += 1;
    } else if (playerRace === "enano") {
        playerHealth += 5;
        playerEvasion -= 2;
    }

    localStorage.setItem("nombre", playerName);

    let vistaDeCombate = document.getElementById("VistaDeCombate");
    let integrantesDeLaBatalla = document.getElementById("integrantesDeLaBatalla");

    // Div del jugador
    const jugadorDiv = document.createElement("div");
    jugadorDiv.innerHTML = `
        <h4 class="titulos">Jugador</h4>
        <p class="nombres">Nombre: ${playerName}</p>
        <p class="datos">Rol: ${playerRol}</p>
        <p class="datos">Raza: ${playerRace}</p>
    `;
    
    integrantesDeLaBatalla.appendChild(jugadorDiv);

    // Div del enemigo
    const enemigoDiv = document.createElement("div");
    enemigoDiv.innerHTML = `
        <h4 class="titulos">Enemigo</h4>
        <p class="nombre">Nombre: ${enemigoAleatorio.enemyName}</p>
        <p class="datos">Salud: ${enemigoAleatorio.enemyHealth}</p>
    `;
    integrantesDeLaBatalla.appendChild(enemigoDiv);

    // Div para los botones de atacar y defender
    const accionesDiv = document.createElement("div");
    accionesDiv.classList.add("divBtns");
    accionesDiv.innerHTML = `
        <h4 class="titulos">¿Qué acción tomas? (atacar/defender)</h4>
        <div>
            <button id="btnAtacar" class="botones">Atacar</button>
            <button id="btnDefender" class="botones">Defender</button>
        </div>
    `;
    vistaDeCombate.appendChild(accionesDiv);

    combate();
    checkBattleStatus();
});

function actualizarEstadoBatalla() {
    const estadoBatallaDiv = document.getElementById("estadoBatalla");

    // Actualiza el contenido del div con la información más reciente
    estadoBatallaDiv.innerHTML = `
        <h4 class="titulos">Estado de la batalla</h4>
        <div class="estadoDeIntegrantes">
            <div class="estadoDeJugador">
                <p class="datosDeBatalla">Jugador: ${playerHealth} de salud</p>
                <p class="datosDeBatalla">Daño producido: ${damage}</p>
                <p class="datosDeBatalla">Evasión del jugador: ${playerEvasion}</p>
            </div>
            <div class="estadoDeEnemigo">
                <p class="datosDeBatalla">Enemigo: ${enemyHealth} de salud</p>
                <p class="datosDeBatalla">Ataque del enemigo: ${enemigoAleatorio.enemyAttack}</p>
            </div>
        </div>
        <div class="mensajesCombate">
            <h4 class="titulos">Eventos de combate</h4>
            <p class="datosDeBatalla">${mensajeCombate}</p>
        </div>
    `;
    // Limpia el mensaje de combate después de mostrarlo
    mensajeCombate = "";
}

// Función para iniciar una nueva ronda después de que el jugador gane la batalla
function iniciarNuevaRonda() {
    const btnReiniciar = document.createElement("button");
        btnReiniciar.id = "btnReiniciar";
        btnReiniciar.textContent = "Reiniciar juego";
        btnReiniciar.addEventListener("click", reiniciarCombate);


    // Genera un nuevo enemigo
    // generarEnemigoAleatorio();
    
    // Restablece la salud del enemigo a su valor inicial
    enemyHealth = enemigoAleatorio.enemyHealth;

    // Habilita los botones de acción
    document.getElementById("btnAtacar").disabled = false;
    document.getElementById("btnDefender").disabled = false;

    // Actualiza el estado de la batalla
    actualizarEstadoBatalla();
    // Llama a la función para actualizar el DOM con las estadísticas del nuevo enemigo y jugador
    actualizarIntegrantesDeLaBatalla();
}

// Función que verifica el estado de la batalla
function checkBattleStatus() {
    round++;
    if (enemyHealth <= 0) {
        endBattle();
        iniciarNuevaRonda(); // Inicia una nueva ronda si el jugador gana
    } else if (playerHealth <= 0) {
        endBattle();
        actualizarEstadoBatalla(); 
    }
}

// Función para manejar el combate
function combate() {
    const btnAtacar = document.getElementById("btnAtacar");
    if (btnAtacar) {
        btnAtacar.addEventListener("click", atacar);
    } 
    
    const btnDefender = document.getElementById("btnDefender");
    if (btnDefender) {
        btnDefender.addEventListener("click", defender);
    } 
}

// Función para atacar al enemigo
function atacar() {
    let attackDamage = Math.floor(Math.random() * 20) + 1;
    enemyHealth -= attackDamage;
    let evasionChance = Math.floor(Math.random() * 5) + 1;
    
    // Verifica si el jugador evade el ataque enemigo
    if (evasionChance > playerEvasion) {
        let enemyDamage = Math.floor(Math.random() * 10) + 1;
        playerHealth -= enemyDamage;
        mensajeCombate += `El enemigo ha hecho ${enemyDamage} a el jugador.`;
    } else {
        mensajeCombate += "El jugador ha evadido el ataque del enemigo."
    }

    actualizarEstadoBatalla();
    checkBattleStatus();
}

// Función para defenderse del ataque enemigo
function defender() {
    // Disminuye el daño del enemigo si el jugador elige defender
    let enemyDamage = Math.floor(Math.random() * 5) + 1;
    playerHealth -= enemyDamage;

    actualizarEstadoBatalla();
    checkBattleStatus();
}

// Función para finalizar la batalla

function reiniciarCombate() {
    // Restablecer las variables del juego a los valores iniciales
    playerHealth = 100;
    playerEvasion = 1;
    damage = 0;
    round = 1;
    
    // Restablecer el enemigo aleatorio
    generarEnemigoAleatorio();
    
    // Restablecer el contenido del DOM a su estado inicial
    document.getElementById("integrantesDeLaBatalla").innerHTML = ''; // Vaciar div de batalla
    document.getElementById("estadoBatalla").innerHTML = ''; // Vaciar div de estado de batalla
    document.getElementById("VistaDeCombate").innerHTML = ''; // Vaciar div de vista de combate

    // Habilitar el botón "Jugar"
    document.getElementById("btnJugar").disabled = false;

    // Eliminar el botón de reinicio
    // const btnReiniciar = document.getElementById("btnReiniciar");
    // if (btnReiniciar) {
    //     btnReiniciar.remove();
    // }

    // Limpia el mensaje de combate
    mensajeCombate = "";
}

function endBattle() {
    document.getElementById("btnAtacar").disabled = true;
    document.getElementById("btnDefender").disabled = true;
    if (playerHealth <= 0) {
        mensajeCombate = "Has perdido la batalla. ¡Prueba de nuevo!";
        actualizarEstadoBatalla();


        const btnReiniciar = document.createElement("button");
        btnReiniciar.id = "btnReiniciar";
        btnReiniciar.textContent = "Reiniciar juego";
        btnReiniciar.addEventListener("click", reiniciarCombate);

        // Usa querySelector para obtener el elemento VistaDeCombate
        const vistaDeCombate = document.querySelector("#VistaDeCombate");
        
        if (vistaDeCombate) {
            // Verifica si el botón de reiniciar ya existe en el DOM antes de agregarlo
            const existingBtnReiniciar = vistaDeCombate.querySelector("#btnReiniciar");
            if (!existingBtnReiniciar) {
                vistaDeCombate.appendChild(btnReiniciar);
            }
        } else {
            console.error("No se encontró el elemento con ID 'VistaDeCombate' en el DOM.");
        }
    }
}

combate();


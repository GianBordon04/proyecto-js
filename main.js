function startGame() {

    const personajes = './data.json'

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
            roles = data.roles
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });

    let playerName;
    let playerRace;
    let playerRol;

    let playerHealth = 100;
    let playerEvasion= 1 ;
    let round = 1;

    let damage = 0;

    let enemigoAleatorio;

    let padre = document.getElementById("padre");
    padre.innerHTML = `
                    <div>
                        <p>Ingresa tu nombre</p>
                        <input id="nombre" type="text" placeholder="Nombre"></input> 
                    </div>                    
                    <div>
                        <p>¿Que raza eliges?(humano, elfo, enano)</p>
                        <input id="raza" type="text" placeholder="Raza"></input> 
                    </div>                   
                    <div>
                        <p>¿Qué rol eliges? (guerrero,mago,arquero)</p>
                        <input id="roles" type="text" placeholder="Roles"></input> 
                    </div>                  
                    <button id="btnJugar" > Jugar </button>
    `
    let enemyAttack;

    function disabledPlay(){
    const btnJugar=document.getElementById("btnJugar")
    btnJugar.disabled = true;
    }
    // Generador de enemigos
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

    const btnJugar = document.getElementById("btnJugar")
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

        let vistaDeCombate = document.getElementById("VistaDeCombate")

        let integrantesDeLaBatalla = document.getElementById("integrantesDeLaBatalla")
        //div del jugador
        const jugadorDiv = document.createElement("div");
        jugadorDiv.innerHTML = `
        <h4 class="titulos" >Jugador</h4>
        <p class="nombres" >Nombre: ${playerName}</p>
        <p class="datos" >Rol: ${playerRol}</p>
        <p class="datos" >Raza: ${playerRace}</p>
    `;
        integrantesDeLaBatalla.appendChild(jugadorDiv);

        //div del enemigo
        const enemigoDiv = document.createElement("div");
        enemigoDiv.innerHTML = `
        <h4 class="titulos" >Enemigo</h4>
        <p class="nombre" >Nombre: ${enemigoAleatorio.enemyName}</p>
        <p class="datos" >Salud: ${enemigoAleatorio.enemyHealth}</p>
    `;
        integrantesDeLaBatalla.appendChild(enemigoDiv);

        //div para los botones de atacar y defender
        const accionesDiv = document.createElement("div");
        accionesDiv.classList.add("divBtns")
        accionesDiv.innerHTML = `
        <h4 class="titulos" >¿Qué acción tomas? (atacar/defender)</h4>
        <div>
        <button id="btnAtacar" class="botones" >Atacar</button>
        <button id="btnDefender" class="botones" >Defender</button>
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
        `;
    }

    function checkBattleStatus() {

        if (enemigoAleatorio) {
        }
        round++;
        if (enemyHealth <= 0) {
            endBattle();
        } else if (playerHealth <= 0) {
            endBattle();
        }
    }

    function combate() {
        const playerActionAtacar = document.getElementById("btnAtacar");
        const playerActionDefender = document.getElementById("btnDefender");

        if (playerActionAtacar) {
            playerActionAtacar.addEventListener("click", atacar)

        } else {
            console.error("El boton de ataca no esta disponible.");
        }


        function atacar() {
            let attackDamage = Math.floor(Math.random() * 20) + 1;
            enemyHealth -= attackDamage;
            const evasionChance = Math.floor(Math.random() * 5) + 1;

            // Logica de evasion de ataque
            if (evasionChance <= playerEvasion) {
            }
            // si no logra evadir, recibe daño
            else {
                const enemyAttack = Math.floor(Math.random() * 10) + 1;
                playerHealth -= enemyAttack
            }

            actualizarEstadoBatalla();

            checkBattleStatus();
        }

        if (playerActionDefender) {
            playerActionDefender.addEventListener("click", defender);
        } else {
            console.error("El boton de defender no esta disponible");
        }
        function defender() {
            const enemyDamage = Math.floor(Math.random() * 5) + 1;
            playerHealth -= enemyDamage;
            
            actualizarEstadoBatalla();

            checkBattleStatus();
        }
        round++;
    }

    function endBattle() {
        const playerActionAtacar = document.getElementById("btnAtacar");
        const playerActionDefender = document.getElementById("btnDefender");
    
        if (playerActionAtacar) {
            playerActionAtacar.disabled = true;
        }
        if (playerActionDefender) {
            playerActionDefender.disabled = true;
        }
    
    }
    
}

// Inicia el juego
startGame();

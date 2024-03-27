function startGame() {
    console.log('Bienvenido al juego de fantasía.');

    // Roles
    const roles = [
        {
            id: 1,
            name: "guerrero",
            armadura: "cota de malla",
            arma: "espada",
            rolDamage: 5,
            rolHealth: 5
        },

        {
            id: 2,
            name: "mago",
            armadura: "capa",
            arma: "baston",
            rolDamage: 10,
            rolHealth: 10

        },

        {
            id: 3,
            name: "arquero",
            armadura: "capucha",
            arma: "arco",
            rolEvasion: 5,
            rolDamage: 5
        }
    ]
    console.log(roles)


    // Enemigos
    const enemies = [
        {
            enemyID: 1,
            enemy: "goblin",
            enemyHealth: 50

        },


        {
            enemyID: 2,
            enemy: "esqueleto",
            enemyHealth: 90,
            enemyAttack: 2
        },

        {
            enemyID: 3,
            enemy: "bandido",
            enemyHealth: 100,
            enemyAttack: 2
        },

        {
            enemyID: 4,
            enemy: "orco barbaro",
            enemyHealth: 110,
            enemyAttack: 5
        },

        {
            enemyID: 5,
            enemy: "necromago",
            enemyHealth: 90,
            enemyAttack: 10
        },

        {
            enemyID: 6,
            enemy: "dragon",
            enemyHealth: 150,
            enemyAttack: 15
        },
    ]


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

    let LogicaDeCombate = document.getElementById("LogicaDeCombate");
    LogicaDeCombate.innerHTML = `
    <div>
    <p>¿Qué acción tomas? (atacar/defender)</p>
    </div>
    
    <button id="btnAtacar"> atacar </p>
    <button id="btnDefender"> defender </p>
    `

    let playerHealth = 100;
    let enemyHealth = 50;
    let playerEvasion = 0;
    let round = 1;
    let damage = 0;
    
    let playerName;
    let playerRace;
    let playerRol;

    const btnJugar = document.getElementById("btnJugar")
    btnJugar.addEventListener('click', function () {
        playerName = document.getElementById("nombre").value;
        playerRace = document.getElementById("raza").value;
        playerRol = document.getElementById("roles").value;

        // bonus de roles
        const chosenRol = roles.find((rol) => rol.name === playerRol)
        console.log(chosenRol)
        roles.forEach(function () {
            if(chosenRol) {
                damage += chosenRol.rolDamage
                playerHealth += chosenRol.rolHealth
                if (playerRace.toLowerCase() === "humano") {
                    damage = +5;
                }
                else if (playerRace.toLowerCase() === "elfo") {
                    playerEvasion = +2;
    
                }
                else if (playerRace.toLowerCase() === "enano") {
                    playerHealth += 5;
                    playerEvasion = -2;
                } else {
                    console.log(`raza no valida,no hay bonus`);
                }
            }else{
            console.log("rol no valido")
            }
            localStorage.setItem("nombre", playerName)

        })
        
        
        console.log("Nombre:", playerName);
        console.log("Raza:", playerRace);
        console.log("Rol:", playerRol);
        combate()
        checkBattleStatus()
    })
    
    function checkBattleStatus() {
        console.log(`Ronda:${round}`);
        console.log('Estado de la batalla:');
        console.log(`${playerName}: ${playerHealth} de salud`);
        console.log(`Enemigo: ${enemyHealth} de salud`);
        round++;
        if (enemyHealth <= 0) {
            console.log('¡Has derrotado al enemigo! ¡Felicidades!');
        } else if (playerHealth <= 0) {
            console.log('¡Has sido derrotado! Fin del juego.');
        } 
    }
    const playerActionAtacar = document.getElementById("btnAtacar")
    const playerActionDefender = document.getElementById("btnDefender")

    // Logica de la batalla


    function combate(){
        playerActionAtacar.addEventListener("click", atacar)
        function atacar(){
            damage = Math.floor(Math.random() * 20) + 1;
            enemyHealth -= damage;
            const evasionChance = Math.floor(Math.random() * 5) + 1;
            
            // Logica de evasion de ataque
            if (evasionChance <= playerEvasion) {
                console.log(`Has evadido el ataque del enemigo y dañaste ${damage} al enemigo!`)
            }
            
            // si no logra evadir, recibe daño
            else {
                const enemyAttack = Math.floor(Math.random() * 10) + 1;
                playerHealth -= enemyAttack
                console.log(`Te inflingieron ${enemyAttack} daño`);
                console.log(`¡Has infligido ${damage} de daño al enemigo!`);
            }
            checkBattleStatus();
        }
        
        playerActionDefender.addEventListener("click", defender)
        function defender(){
            const enemyDamage = Math.floor(Math.random() * 5) + 1;
            playerHealth -= enemyDamage;
            console.log(`Te has defendido, pero el enemigo te ha infligido ${enemyDamage} de daño.`);
           
            checkBattleStatus();
        }
        round++;
    }
}

// Inicia el juego
startGame();

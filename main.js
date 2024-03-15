function startGame() {
    console.log('Bienvenido al juego de fantasía.');

    const playerName = prompt('¿Cuál es tu nombre? ');
    const playerRace = prompt('¿Qué raza eliges? (humano,elfo,enano) ').toLowerCase();
    const playerRol = prompt('¿Qué rol eliges? (guerrero,mago,arquero)')
    console.log(`Hola, ${playerName}! El ${playerRace} Comencemos la aventura.`);


    let playerHealth = 100;
    let enemyHealth = 50;
    let playerEvasion = 0;
    let round = 1;
    let damage = 0;


    //   clases con items
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


    // bonus de roles
    const chosenRol = roles.find((rol) => rol.name === playerRol )
    console.log(chosenRol)
    roles.forEach(function () {
    if (playerRol.toLowerCase() === "guerrero"){
        damage += chosenRol.rolDamage
        playerHealth += chosenRol.rolHealth
    } 

    else if (playerRol.toLowerCase() === "mago"){
        damage += chosenRol.rolDamage
        playerHealth -= chosenRol.rolHealth
    } 

    else if (playerRol.toLowerCase() === "cazador"){
        damage += chosenRol.rolDamage
        playerEvasion += chosenRol.rolEvasion
    } 

    })

     

    //     if (playerRol.toLowerCase() === "guerrero" && rol.name.toLowerCase() === "guerrero") {
    //         damage += rol.rolDamage
    //         playerHealth += rol.rolHealth
    //     }
    // })

    // roles.forEach(function (rol) {
    //     if (playerRol.toLowerCase() === "mago" && rol.name.toLowerCase() === "mago") {
    //         damage += rol.rolDamage
    //         playerHealth -= rol.rolHealth
    //     }
    // })

    // roles.forEach(function (rol) {
    //     if (playerRol.toLowerCase() === "arquero" && rol.name.toLowerCase() === "arquero") {
    //         damage += rol.rolDamage
    //         playerEvasion += rol.rolEvasion
    //     }
    



    // bonus de razas
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

    // generador de enemigos





    while (playerHealth > 0 && enemyHealth > 0) {
        console.log(`Ronda:${round}`)
        console.log('Estado de la batalla:');
        console.log(`${playerName}: ${playerHealth} de salud`);
        console.log(`Enemigo: ${enemyHealth} de salud`);
        const playerAction = prompt('¿Qué acción tomas? (atacar/defender)');



        // Lógica de la batalla muy simple
        if (playerAction.toLowerCase() === 'atacar') {
            damage = Math.floor(Math.random() * 20) + 1;
            enemyHealth -= damage;
            const evasionChance = Math.floor(Math.random() * 5) + 1;

            // Logica de evasion de ataque
            if (evasionChance <= playerEvasion)
                console.log(`Has evadido el ataque del enemigo y dañaste ${damage} al enemigo!`)

            // si no logra evadir, recibe daño
            else {
                const enemyAttack = Math.floor(Math.random() * 10) + 1;
                playerHealth -= enemyAttack
                console.log(`Te inflingieron ${enemyAttack} daño`);
                console.log(`¡Has infligido ${damage} de daño al enemigo!`);
            }


        } else if (playerAction.toLowerCase() === 'defender') {
            const enemyDamage = Math.floor(Math.random() * 5) + 1;
            playerHealth -= enemyDamage;
            console.log(`Te has defendido, pero el enemigo te ha infligido ${enemyDamage} de daño.`);
        } else {
            console.log('Acción no válida. Intenta de nuevo.');
        }

        round++;
    }

    if (playerHealth <= 0) {
        console.log('¡Has sido derrotado! Fin del juego.');
    } else {
        console.log('¡Has derrotado al enemigo! ¡Felicidades!');
    }

}

// Inicia el juego
startGame();

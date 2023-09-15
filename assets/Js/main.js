class Graph {
    constructor() {
        this.nodes = new Map();
        this.edge = [];
    }

    addNode(node, cord) {
        if (!this.nodes.has(node)) {
            this.nodes.set(node, cord);
        }
    }

    addEdge(node1, node2) {
        if (this.nodes.has(node1) && this.nodes.has(node2)) {
            this.edge.push([node1, node2]);
        }
    }

    getAllEdge() {
        return this.edge;
    }

    getallnodes() {
        return this.nodes;
    }
    findNode(node) {
        if (this.nodes.has(node)) {
            return this.nodes.get(node);
        }
    }
    //Busca un nodo con las cordenadas del mundo x, y.
    findnodecord(x, y) {
        for (const [key, value] of this.nodes) {
            if (value.x === x && value.y === y) {
                return key;
            }
        }
        return null;
    }
    //Busca un nodo que exista en el registro (validos (que no sean muro)) pero que no se pueden acceder o no tengan conexiones con otros nodos
    findIsolatedNodes() {
        const isolatedNodes = [];

        for (const [node] of this.nodes) {
            let hasConnections = false;

            for (const [node1, node2] of this.edge) {
                if (node === node1 || node === node2) {
                    hasConnections = true;
                    break;
                }
            }

            if (!hasConnections) {
                isolatedNodes.push(node);
            }
        }

        return isolatedNodes;
    }
    findinsolatedEdge() {
        const isolatedEdges = [];

        for (const [node1, node2] of this.edge) {
            if (!this.nodes.has(node1) || !this.nodes.has(node2)) {
                isolatedEdges.push([node1, node2]);
            }
        }

        return isolatedEdges;
    }
    //Busca las conexiones de los grafos y los separa en grupos de grafo.
    //Se suele utilizar en conjunto a otras funciones para buscar grafos que son inacecibles.
    findConnectedComponents() {
        const visited = new Set();
        const components = [];
        //Recorre Todos los nodos.
        for (const [node] of this.nodes) {
            //El nodo no esta en "visited" 
            if (!visited.has(node)) {
                const component = this.dfs(node, visited);
                components.push(component);
            }
        }

        return components;
    }
    //Algoritmo de busqueda profunda.
    dfs(node, visited) {
        const component = new Set();
        const stack = [node];
        //El largo de stack debe ser mayor a 0 (stack = [node])
        while (stack.length > 0) {
            //Remueve el ultimo elemento de stack y lo asigna como posicion "currentNode"
            const currentNode = stack.pop();
            //Añade la posicion "currentNode" a visited.
            visited.add(currentNode);
            component.add(currentNode);

            //Recorre los edge en busca de coincidencia descarta cualquier nodo que sea el nodo "currentnode"
            //y busca cualquier nodo que no se encuentre en los nodos visitados
            //Posteriomente los añade en le stack.
            for (const [node1, node2] of this.edge) {
                if (node1 === currentNode && !visited.has(node2)) {
                    stack.push(node2);
                }
                if (node2 === currentNode && !visited.has(node1)) {
                    stack.push(node1);
                }
            }
        }

        return component;
    }
    //Algoritmo de busqueda en anchura.
    bfs(startNode, targetNode) {
        const queue = [{ node: startNode, path: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const { node, path } = queue.shift();

            if (node === targetNode) {
                path.push(node);
                return path; // Retorna el camino encontrado
            }

            if (!visited.has(node)) {
                visited.add(node);

                for (const [node1, node2] of this.edge) {
                    if (node1 === node && !visited.has(node2)) {
                        queue.push({ node: node2, path: [...path, node] });
                    }
                    if (node2 === node && !visited.has(node1)) {
                        queue.push({ node: node1, path: [...path, node] });
                    }
                }
            }
        }

        return null; // No se encontró camino
    }
    //Busca un nodo y lo elimina siempre y cuando exista las elimina
    removeNode(node) {
        if (this.nodes.has(node)) {
            console.log(node);
            this.nodes.delete(node);
        }
    }
    //Busca las edges parar posteriomente eliminarlas
    removeEdge(edge1, edge2) {
        if (this.edge.includes(edge1) && this.edge.includes(edge2)) {
            this.edge.filter(item => item !== edge1);
            this.edge.filter(item => item !== edge2);
        }
    }
    //Eliminacion centralizada de nodos en caso que se quiera invocar borrar sin utilizar los datos
    automaticRemoveInsolatedNodes() {
        const insolatedNodes = this.findIsolatedNodes();
        for (const NodeValue of insolatedNodes) {
            console.log(NodeValue + " Graph function" + "das ");
            this.removeNode(NodeValue);
        }
    }
    //Eliminacion centralizada de edge en caso que no se requieran usar fuera de la clase.
    automaticRemoveInsolatedEdge() {
        const insolatedEdge = this.findinsolatedEdge();
        for (const [edge1, edge2] of insolatedEdge) {
            this.removeEdge(edge1, edge2);
        }
    }
}
class Enemigo {
    constructor(startNode, targetNode, graph, x, y) {
        this.currentNode = startNode;
        this.targetNode = targetNode;
        this.graph = graph;
        this.x = x;
        this.y = y;
    }

    getxy() {
        return [this.x, this.y];
    }
    getnode() {
        this.currentNode;
    }
    move() {
        const path = this.graph.bfs(this.currentNode, this.targetNode);
        if (path && path.length > 1) {
            const nextNode = path[1]; // El siguiente nodo en el camino
            const nextPosition = this.graph.nodes.get(nextNode);

            console.log(`Moverse desde (${this.currentNode}) a (${nextNode})`);

            this.currentNode = nextNode; // Actualizar la posición del personaje
            var temp = this.graph.findNode(this.currentNode);
            console.log(temp.x + " ss ");
            console.log(temp.y + " ss ");
            this.x = temp.x;
            this.y = temp.y;
        } else {
            console.log("Llegado al destino final.");
        }
    }
    updateTagetNode(node) {
        this.targetNode = node;
    }
}
var gamerun = false;
var row = 15;
var col = 25;
var worlddict = {
    0: 'blank',
    1: 'wall',
    2: 'sushi',
    3: 'onigiri',
};
var worldgen = new Array(row).fill(0).map(() => new Array(col).fill(0));;

var pacman = {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
}


//Dolor de cabeza... calcula la matrix(mapa) y lo pasa al formato grafo
function CalcMatrix2dToGraph(matrix, grafo) {
    let counter = 0;

    function isValidMovement(contenido) {
        return contenido !== 1;
    }

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
            if (isValidMovement(matrix[row][col])) {
                const currentNode = "N" + counter;
                grafo.addNode(currentNode, { x: row, y: col });
                counter++;

                const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // right, left, down, up

                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (matrix[newRow]?.[newCol] !== undefined) {
                        const adjacentNode = grafo.findnodecord(newRow, newCol);
                        if (adjacentNode !== null) {
                            grafo.addEdge(currentNode, adjacentNode);
                        }
                    }
                }
            }
        }
    }

}

var tablero = {
    sushi: { cantidad: 0, valor: 10 },
    onigiri: { cantidad: 0, valor: 5 },
    vidas: 3
}

//MathLibrary
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//END MathLibrary

//DRAW
function drawWorld(Iworldgen, Iworlddict) {
    var output = "";
    for (var row = 0; row < Iworldgen.length; row++) {
        output += `<div class='row'>`;
        for (var i = 0; i < Iworldgen[row].length; i++) {
            output += `<div class = '${Iworlddict[Iworldgen[row][i]]}'></div>`;
        }
        output += "</div>";
    }
    document.getElementById('world').innerHTML = output;
}

function drawNinja(Ipacman) {
    var elementNinja = document.getElementById('pacman');
    elementNinja.style.top = Ipacman.x * 40 + 'px';
    elementNinja.style.left = Ipacman.y * 40 + 'px';
    elementNinja.style.transform = 'rotate(' + Ipacman.rotate + 'deg) scaleX(' + Ipacman.scale + ')';
}
function drawEnemy(IEnemigo, IEnemigo2) {
    var [enemyX, EnemyY] = IEnemigo.getxy();
    var [enemyX2, EnemyY2] = IEnemigo2.getxy();
    var elementNinja = document.getElementById('pumpky');
    elementNinja.style.top = enemyX * 40 + 'px';
    elementNinja.style.left = EnemyY * 40 + 'px';

    var elementNinja = document.getElementById('pinky');
    elementNinja.style.top = enemyX2 * 40 + 'px';
    elementNinja.style.left = EnemyY2 * 40 + 'px';
    console.log("pintado.. enemigo");
}
function drawTablero(Itablero) {
    document.getElementById('tableroSushiValor').innerHTML = Itablero.sushi.valor;
    document.getElementById('tableroSushiCantidad').innerHTML = Itablero.sushi.cantidad;
    document.getElementById('tableroSushiPuntuacion').innerHTML = Itablero.sushi.valor * Itablero.sushi.cantidad;
    document.getElementById('tableroOnigiriValor').innerHTML = Itablero.onigiri.valor;
    document.getElementById('tableroOnigiriCantidad').innerHTML = Itablero.onigiri.cantidad;
    document.getElementById('tableroOnigiriPuntuacion').innerHTML = Itablero.onigiri.valor * Itablero.onigiri.cantidad;
    document.getElementById('Total').innerHTML = Itablero.sushi.valor * Itablero.sushi.cantidad + Itablero.onigiri.valor * Itablero.onigiri.cantidad;
    document.getElementById('Vidas').innerHTML = Itablero.vidas;
}


//END DRAW
const grafoxgen = new Graph();
//GenWorld
function CreateWorld(Iworldgen) {
    //Rellenado de contorno
    for (let i = 0; i < Iworldgen.length; i++) {
        for (let j = 0; j < Iworldgen[0].length; j++) {
            if (i === 0 || i === Iworldgen.length - 1 || j === 0 || j === Iworldgen[0].length - 1) {
                Iworldgen[i][j] = 1;
            }
        }
    }
    var CantidadMurosExtra = 80;
    while (!(CantidadMurosExtra == 0)) {
        var x, y;
        x = getRandomNumber(0, Iworldgen.length - 1);
        y = getRandomNumber(0, Iworldgen[0].length - 1);
        if (Iworldgen[x][y] != 1) {
            Iworldgen[x][y] = 1;
            CantidadMurosExtra--;
        }
    }

    //Caminos Validos.

    CalcMatrix2dToGraph(Iworldgen, grafoxgen);

    //Cambia los nodos aislados por muros.
    grafoxgen.findIsolatedNodes().forEach((value) => {
        var temp = grafoxgen.findNode(value);
        console.log(temp.x + " " + temp.y);
        worldgen[temp.x][temp.y] = 1;
    })


    const connectedComponents = grafoxgen.findConnectedComponents();
    //Busca Conexiones (edge) de los grafos y los remplaza si son menores a 100 (suponiendo que las rutas validas son mayores de esto)
    connectedComponents.forEach((value, key) => {
        if (value.size < 100) {
            value.forEach((value, key) => {
                var tempx = grafoxgen.getallnodes().get(value);
                worldgen[tempx.x][tempx.y] = 1;

                var tempx2 = grafoxgen.getallnodes().get(key);
                worldgen[tempx2.x][tempx2.y] = 1;

                grafoxgen.removeNode(value);
                grafoxgen.removeNode(key);
            })
        }
    });

    //Elimina registros del grafo en caso de no existir posiciones validas de acceso.
    grafoxgen.automaticRemoveInsolatedNodes();
    grafoxgen.automaticRemoveInsolatedEdge();

    //END Caminos Validos.


    //Pone los premios dentro del mapa.
    var CantidadPremios = 20;
    while (!(CantidadPremios == 0)) {
        var x, y;
        x = getRandomNumber(0, Iworldgen.length - 1);
        y = getRandomNumber(0, Iworldgen[0].length - 1);
        if (Iworldgen[x][y] != 1 && Iworldgen[x][y] != 2 && Iworldgen[x][y] != 3) {
            Iworldgen[x][y] = getRandomNumber(2, 3);
            CantidadPremios--;
        }
    }

}

//END GenWorld

function pacmanStartPositionSet(Iworldgen, Ipacman) {
    //set position.
    var Ninjaposition = 1;
    while (!(Ninjaposition == 0)) {
        var x, y;
        x = getRandomNumber(0, Iworldgen.length - 1);
        y = getRandomNumber(0, Iworldgen[0].length - 1);
        if (Iworldgen[x][y] != 1 && Iworldgen[x][y] != 2 && Iworldgen[x][y] != 3 && Iworldgen[x][y] != undefined) {
            console.log(Iworldgen[x][y]);
            console.log("row " + Iworldgen.length);
            console.log("col " + Iworldgen[0].length);
            console.log("X " + x + " Y " + y);
            Ipacman.x = x;
            Ipacman.y = y;

            console.log(Ipacman.x + " XY " + Ipacman.y);
            Ninjaposition--;
        }
    }
}
function EnemyStartPositionSet(Iworldgen) {
    //set position.
    var Enemyposition = 1;
    while (!(Enemyposition == 0)) {
        var x, y;
        x = getRandomNumber(0, Iworldgen.length - 1);
        y = getRandomNumber(0, Iworldgen[0].length - 1);
        if (Iworldgen[x][y] != 1 && Iworldgen[x][y] != undefined) {
            console.log(Iworldgen[x][y]);
            console.log("row " + Iworldgen.length);
            console.log("col " + Iworldgen[0].length);
            console.log("X " + x + " Y " + y);

            //Iworldgen[x][y] = 5;

            //Ipacman.x = x;
            //Ipacman.y = y;

            return [x, y, grafoxgen.findnodecord(x, y)]
            //console.log(Ipacman.x + " XY " + Ipacman.y);
            Enemyposition--;
        }
    }
}
function calcTablero(Iworldgen, IEnemigo, IEnemigo2) {
    switch (Iworldgen[pacman.x][pacman.y]) {
        //'sushi'
        case 2:
            Iworldgen[pacman.x][pacman.y] = 0;
            tablero.sushi.cantidad++;
            break;
        //onigiri
        case 3:
            Iworldgen[pacman.x][pacman.y] = 0;
            tablero.onigiri.cantidad++;
            break;
    }
    var [enemyX, enemyY] = IEnemigo.getxy();
    var [enemyX2, enemyY2] = IEnemigo2.getxy();

    if (tablero.vidas != 0) {
        if (pacman.x == enemyX && pacman.y == enemyY || pacman.x == enemyX2 && pacman.y == enemyY2) {
            tablero.vidas--;
            pacmanStartPositionSet(Iworldgen, pacman);
        }
    } else {
        console.log("A perdido");
        alert("A Perdido");
    }
}


//Llamadas Principales.

CreateWorld(worldgen);
pacmanStartPositionSet(worldgen, pacman);
var [EnemyX, EnemyY, EnemyNode] = EnemyStartPositionSet(worldgen);
console.log("Prueba enemigo Pumpky " + EnemyX);
console.log("Prueba enemigo Pumpky " + EnemyY);
console.log("Prueba enemigo Pumpky " + EnemyNode);

var Pumpky = new Enemigo(EnemyNode, grafoxgen.findnodecord(pacman.x, pacman.y), grafoxgen, EnemyX, EnemyY);

var [EnemyX, EnemyY, EnemyNode] = EnemyStartPositionSet(worldgen);
console.log("Prueba enemigo Pinky " + EnemyX);
console.log("Prueba enemigo Pinky " + EnemyY);
console.log("Prueba enemigo Pinky " + EnemyNode);

var Pinky = new Enemigo(EnemyNode, grafoxgen.findnodecord(pacman.x, pacman.y), grafoxgen, EnemyX, EnemyY);

drawEnemy(Pumpky, Pinky);
calcTablero(worldgen, Pumpky, Pinky);

//Llamadas de dibujo iniciales.

drawWorld(worldgen, worlddict);
drawNinja(pacman);
drawTablero(tablero);
drawWorld(worldgen, worlddict);

//Centraliza los movimientos para evitar los movimientos fantasmas en caso de que las teclas presionadas no seaen correctas.
function Valideventmoevement() {
    console.log("Posicion de 'Ninja Man' x,y : " + pacman.x + "   " + pacman.y)

    calcTablero(worldgen, Pumpky, Pinky);
    Pumpky.updateTagetNode(grafoxgen.findnodecord(pacman.x, pacman.y));
    Pumpky.move();
    Pinky.updateTagetNode(grafoxgen.findnodecord(pacman.x, pacman.y));
    Pinky.move();
    calcTablero(worldgen, Pumpky, Pinky);
    drawEnemy(Pumpky, Pinky);
    drawNinja(pacman);
    drawWorld(worldgen, worlddict);
    drawTablero(tablero);
}
function gamestart() {
    if (!gamerun) {
        gamerun = true;
        gameloop();
    }
}
function gameloop() {
    if ((tablero.vidas == 0) || !gamerun) {
        return;
    }
    console.log("Posicion de 'Ninja Man' x,y : " + pacman.x + "   " + pacman.y)

    calcTablero(worldgen, Pumpky, Pinky);
    Pumpky.updateTagetNode(grafoxgen.findnodecord(pacman.x, pacman.y));
    Pumpky.move();
    Pinky.updateTagetNode(grafoxgen.findnodecord(pacman.x, pacman.y));
    Pinky.move();
    calcTablero(worldgen, Pumpky, Pinky);
    drawEnemy(Pumpky, Pinky);
    drawNinja(pacman);
    drawWorld(worldgen, worlddict);
    drawTablero(tablero);

    setTimeout(gameloop, 150);
}
//Escucha los eventos de movimiento y realiza la accion mover.
//Hace dos llamadas de dibujo (drawWorld,drawNinja,drawTablero)
document.onkeydown = function (e) {
    if (tablero.vidas != 0 && gamerun) {
        if (e.key == 'ArrowLeft') {//Left <-
            if (worldgen[pacman.x][pacman.y - 1] != 1) {
                pacman.y--;
                pacman.rotate = 0;
                pacman.scale = -1;
            }
        }
        if (e.key == 'ArrowUp') {//UP ^
            if (worldgen[pacman.x - 1][pacman.y] != 1) {
                pacman.x--;
                pacman.rotate = -90;
                pacman.scale = 1;
            }
        }
        if (e.key == 'ArrowRight') {//RIGHT ->
            if (worldgen[pacman.x][pacman.y + 1] != 1) {
                pacman.y++;
                pacman.rotate = 0;
                pacman.scale = 1;
            }
        }
        if (e.key == 'ArrowDown') {//Down 
            if (worldgen[pacman.x + 1][pacman.y] != 1) {
                pacman.x++;
                pacman.rotate = 90;
                pacman.scale = 1;
            }
        }
    }
}

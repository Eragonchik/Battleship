let theMatrix = [];
let difficult = 0;
let isDemaged = false;
let theMatrixOfHim = [];
let dSC = [];
let demaged = false;
let x;
let y;
let isReset = false;
let field = document.querySelector(`.field`);
let fields = document.querySelectorAll(`.field`);
let whichOne = ``;
let meShipsObj = {};
let status = document.querySelector(`.status`);
creatingCell(field);
whichOne = `Me`;
creatingCell(fields[1]);
whichOne = `Him`;
creatingCell(fields[2]);
whichOne = ``;
creatingMatrix(theMatrix);
creatingMatrix(theMatrixOfHim);
let shipsObjs = document.querySelectorAll(`.ship`);
let cells = document.querySelectorAll(`.cell`);
let cellsOfHim = document.querySelectorAll(`.cell.Him`);
let placementOfShips = document.querySelector(`.placement_of_ships`);
let gameplay = document.querySelector(`.gameplay`);
let shipsPanel = document.querySelector(`.ships_panel`);
let shipsOfMe = [];
let shipsOfHim = [];
let index = 0;
let arrOfNumbers = document.querySelectorAll(`h3`);
let opponentMove = `Opponent's move`;
let yourMove = `Your move`;
let start_points = [[ [6,0], [2,0], [0,2], [0,6] ],[ [3,0], [7,0], [9,2], [9,6] ]];
addOnmousedownOnObjs(shipsObjs,onMouseDownOnShips);
addOnmousedownOnObjs(cells,onMouseDownOnCells);
placementOfShips.oncontextmenu = NoRight;
gameplay.oncontextmenu = NoRight;
function NoRight(){
	return false;
}
function addOnmousedownOnObjs(objs,func){
    for (let item of objs){
        item.onpointerdown = func;
        item.ondragstart = function() {
            return false;
        };
    }
}
function removeOnmousedownOnObjs(objs){
    for (let item of objs){
        item.onpointerdown = null;
    }
}
function onMouseDownOnCells(event){
    let eventTar = event.target;
    if (!eventTar.style.backgroundColor) return
    let movedShip = searchShip(+eventTar.getAttribute(`x`),+eventTar.getAttribute(`y`),shipsOfMe);
    let movedObj = document.querySelector(`.ship.${movedShip.className()}`);
    if (!movedShip.direction) movedObj = document.querySelector(`.ship.${movedShip.className()}.${movedShip.className()}_roll`);
    onMouseDownOnShips(event,movedObj,true);
    removeShipfromField(movedShip);
    deleteShipFromTheArray(movedShip, shipsOfMe);
    decountOfShips(movedShip.className());
    index--;
    cleanField(theMatrix);
    addShipsOnField(shipsOfMe);
}
function deleteShipFromTheArray(ship,array){
    let arrChanged = [];
    for (let item of array){
        if (item != ship) arrChanged.push(item)
    }
    shipsOfMe = arrChanged;
}
function searchShip(x,y,ships){
    for (let item of ships){
        if(item.direction) if ((y == item.y1) && (x >= item.x1) && (x <= item.x1 + item.numberOfdeck - 1)) return item
        if(!item.direction) if ((x == item.x1) && (y >= item.y1) && (y <= item.y1 + item.numberOfdeck - 1)) return item
    }
}
function reloadShips(){
    shipsObjs = document.querySelectorAll(`.ship`);
    addOnmousedownOnObjs(shipsObjs,onMouseDownOnShips);
}
function onMouseDownOnShips(event,obj = event.target,moving) {
    event.preventDefault();
    let fieldCord = field.getBoundingClientRect();
    let eventTar = obj;
    let clone = eventTar;
    let cloneClass = clone.classList[1];
    let decks = +countingNumberOfDecks(cloneClass);
    let text = document.querySelector(`.number_of_${cloneClass}`);
    if ((!+text.innerText)&&(!moving)) return 
    eventTar.before(eventTar.cloneNode(true));
    reloadShips();
    let direction = true;
    if (eventTar.classList.length == 3) direction=false;
    clone.style.position = 'absolute';
    clone.style.zIndex = 1000;
    field.append(clone);
    let xShift = eventTar.offsetWidth>eventTar.offsetHeight ? 14: eventTar.offsetWidth / 2;
    let yShift = eventTar.offsetWidth>eventTar.offsetHeight ? eventTar.offsetHeight / 2: 14;
  
    moveAt(event.pageX, event.pageY);
  
    function moveAt(pageX, pageY) {
        clone.style.left = pageX - xShift + 'px';
        clone.style.top = pageY - yShift + 'px';
    }
  
    function onMouseMove(event) {
        let eMoveCord = event.target.getBoundingClientRect();
        clone.classList.remove(`movingWrong`);
        clone.classList.add(`movingRight`);

        if (eMoveCord.left < fieldCord.left || eMoveCord.top < fieldCord.top) {
            clone.classList.remove(`movingRight`);
            clone.classList.add(`movingWrong`);
        }
        if (eMoveCord.right > fieldCord.right || eMoveCord.bottom > fieldCord.bottom) {
            clone.classList.remove(`movingRight`);
            clone.classList.add(`movingWrong`);
        }
        clone.remove();
        let tagetCell = document.elementFromPoint(event.clientX, event.clientY);
        if (!tagetCell) return
        field.append(clone);
        let tagetShips = [];
        let tagetShip = new Ship (decks,+tagetCell.getAttribute(`x`),+tagetCell.getAttribute(`y`),direction,theMatrix,tagetShips);
        if (!checkCoord(tagetShip.x0(),tagetShip.y0(),tagetShip.x2(),tagetShip.y2(),tagetShip.array,tagetShip.decks,tagetShip.direction)){ 
            clone.classList.remove(`movingRight`);
            clone.classList.add(`movingWrong`);
        }
        
        moveAt(event.pageX, event.pageY);
    }
  
    document.onpointermove = onMouseMove;
    document.onpointerup = function(e) {
        document.onpointermove = null;
        document.onpointerup = null;
        clone.remove();
        if(clone.classList.contains(`movingWrong`))return
        obj = document.elementFromPoint(e.clientX, e.clientY);
        if (!(obj.getAttribute(`x`)||obj.getAttribute(`y`))) return
        creatingShip(decks,+obj.getAttribute(`x`),+obj.getAttribute(`y`),direction,theMatrix,shipsOfMe);
    };
  
};
function creatingShip(decks,x,y,direction,Matrix,arrayOfShips){
    let shipsLength = arrayOfShips.length;
    arrayOfShips[index++] = new Ship (decks,x,y,direction,Matrix,arrayOfShips);
    addShipOnField(arrayOfShips[index-1],arrayOfShips[index-1].arrayOfShips);
    if (shipsLength == arrayOfShips.length) return
    if (Matrix == theMatrix) countOfShips(arrayOfShips[index-1].className());
}
function Ship(numberOfdeck,x1,y1,direction,array,arrayOfShips){
    this.arrayOfShips = arrayOfShips;
    this.array = array;
    this.numberOfdeck = numberOfdeck;
    this.x1 = x1;
    this.y1 = y1;
    this.direction = direction;
    this.x0 = () => (this.x1-1)>0 ? this.x1-1 : 0;
    this.y0 = () => (this.y1-1)>0 ? this.y1-1 : 0;
    this.x2 = function(){
        if (this.direction){
            return (this.x1+this.numberOfdeck)>9 ? 9: this.x1+this.numberOfdeck;
        }
        else return (this.x1+1)>9 ? 9: this.x1+1
    }
    this.y2 = function(){
        if (!this.direction){
            return (this.y1+this.numberOfdeck)>9 ? 9: this.y1+this.numberOfdeck;
        }
        else return (this.y1+1)>9 ? 9: this.y1+1
    }
    this.className = function(){
        if (this.numberOfdeck == 4) return `four_deck`
        else if (this.numberOfdeck == 3)return `three_deck`
        else if (this.numberOfdeck == 2)return `two_deck`
        else return `one_deck`
    }
}
function countingNumberOfDecks(className){
    if (className == `four_deck`) return 4
    else if (className == `three_deck`)return 3
    else if (className == `two_deck`)return 2
    else return 1
}
function addShipsOnField(arr){
    for (item of arr){
        addShipOnField(item);
    }
}
function addShipOnField(obj,ships){
    if (!checkCoord(obj.x0(),obj.y0(),obj.x2(),obj.y2(),obj.array,obj.numberOfdeck,obj.direction)) {ships.length-=1; index--;return} 
    createArea(obj.x0(),obj.y0(),obj.x2(),obj.y2(),2,obj.array);
    if (obj.direction){
        for (let i=0; i < obj.numberOfdeck; i++){
            obj.array[obj.x1 + i][obj.y1] = 1;
            if (obj.array == theMatrix) document.getElementById(`${whichOne} x-${obj.x1 + i},y-${obj.y1}`).style.backgroundColor = `green`;
        }
    }
    else {
        for (let i=0; i < obj.numberOfdeck; i++){
            obj.array[obj.x1][obj.y1 + i] = 1;
            if (obj.array == theMatrix) document.getElementById(`${whichOne} x-${obj.x1},y-${obj.y1 + i}`).style.backgroundColor = `green`;
        }
    }
}
function removeShipfromField(obj){
    return createArea(obj.x0(),obj.y0(),obj.x2(),obj.y2(),0,obj.array);
}
function createArea(x0,y0,x2,y2,placeHolder,array){
    for (let i=x0; i <= x2; i++){
        for (let j=y0; j <= y2; j++){
            array[i][j] = placeHolder;
            if (array == theMatrix && placeHolder == 0) document.getElementById(`${whichOne} x-${i},y-${j}`).style.backgroundColor = ``;
        }
    }
}
function cleanField(array){
    createArea(0,0,9,9,0,array);
}
function checkCoord(x0,y0,x2,y2,array,decks,direction){
    if (direction) {
        if (x0+decks > 9) return false
    }
    else {
        if (y0+decks > 9) return false
    }
        
    for (let i=x0; i <= x2; i++){
        for (let j=y0; j <= y2; j++){
            if (array[i][j] == 1) return false
        }
    }
    return true
}
function countOfShips(className){
    let text = document.querySelector(`.number_of_${className}`);
    if (!+text.innerText) return
    return text.innerText--;
}
function decountOfShips(className){
    let text = document.querySelector(`.number_of_${className}`);
    return text.innerText++;
}
function creatingCell(obj){
    for (let i=0; i < 10; i++){
        for (let j=0; j < 10; j++){
            let cell = document.createElement('div');
            cell.setAttribute(`id`,`${whichOne} x-${i},y-${j}`);
            cell.setAttribute(`x`,i);
            cell.setAttribute(`y`,j);
            cell.className = `cell ${whichOne}`;
            obj.append(cell);
        }
    }

}
function creatingMatrix(variable){
    for (let i=0; i < 10; i++){
        let arr = [];
        for (let j=0; j < 10; j++){
            arr[j] = 0;
        }
        variable[i] = arr;
    }
}
function isEveryShipIsPlaced(){
    for (let i=0; i < document.querySelectorAll(`h3`).length; i++){
        if (document.querySelectorAll(`h3`)[i].innerText != 0) return false
    }
    return true
}
function buttonContinue(){
    if (isEveryShipIsPlaced()) {displayNone(`placement_of_ships`);displayFlex(`choose_difficult`);return}
    else alert(`Position all ships`)
}
function displayNone(obj){
    document.querySelector(`.${obj}`).style.display = `none`;
}
function displayBlock(obj){
    document.querySelector(`.${obj}`).style.display = `block`;
}
function displayFlex(obj){
    document.querySelector(`.${obj}`).style.display = `flex`;
}
function randomNumber(max){
    min = 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomPlacement(arrayOfShips,Matrix){
    isAllShipsPlaced = true;
    for (let i=0; i < arrOfNumbers.length; i++){
    if (arrOfNumbers[i].innerText != 0) isAllShipsPlaced = false;
    }
    if (isAllShipsPlaced) {
        cleanField(Matrix);
        arrayOfShips.length = 0;
        index = 0;
        for (let i=0; i < arrOfNumbers.length; i++){
            arrOfNumbers[i].innerText = i+1;
        }
    } 
    while(arrOfNumbers[0].innerText != 0){
        let decks = 4;
        let direction = Boolean(randomNumber(1));
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
    while(arrOfNumbers[1].innerText != 0){
        let decks = 3;
        let direction = Boolean(randomNumber(1));
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
    while(arrOfNumbers[2].innerText != 0){
        let decks = 2;
        let direction = Boolean(randomNumber(1));
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
    while(arrOfNumbers[3].innerText != 0){
        let decks = 1;
        let direction = true;
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
}
function randomPlacementOfHim(arrayOfShips,Matrix){
    while(arrayOfShips.length != 1){
        let decks = 4;
        let direction = Boolean(randomNumber(1));
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
    while(arrayOfShips.length != 3){
        let decks = 3;
        let direction = Boolean(randomNumber(1));
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
    while(arrayOfShips.length != 6){
        let decks = 2;
        let direction = Boolean(randomNumber(1));
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
    while(arrayOfShips.length != 10){
        let decks = 1;
        let direction = true;
        creatingShip(decks,randomNumber(9),randomNumber(9),direction,Matrix,arrayOfShips);
    }
}
function gameBegin(){
    displayNone(`choose_difficult`);
    displayFlex(`gameplay`);
    removeOnmousedownOnObjs(shipsObjs);
    removeOnmousedownOnObjs(cells);
    index = 0;

    whichOne = `Me`;
    cleanField(theMatrix);
    addShipsOnField(shipsOfMe);
    whichOne = ``;
    randomPlacementOfHim(shipsOfHim,theMatrixOfHim);
    meShipsObj = {
        1 : 4,
        2 : 3,
        3 : 2,
        4 : 1
    }
    setTimeout(hisTurn,3000);
}
function easy(){
    return [randomNumber(9),randomNumber(9)]
}
function hard(x,y){
    x = 0;
    y = 0;
    if (start_points[0][3][1] != 10) {
        for (let i=0; i<start_points[0].length; i++){
            if (start_points[0][i][0] > 9 || start_points[0][i][1] > 9) continue
            x = start_points[0][i][0]++;
            y = start_points[0][i][1]++;
            return [x,y]
        }
    }
    else if (start_points[1][3][1] != 10){
        for (let i=0; i<start_points[1].length; i++){
            if (start_points[1][i][0] < 0 || start_points[1][i][0] > 9 || start_points[1][i][1] > 9) continue
            x = start_points[1][i][0]--;
            y = start_points[1][i][1]++;
            return [x,y]
        }
    }
    else return easy();
}
function hisTurn(Xcoord,Ycoord){
    let coordOfShot;
    let anotherOne = false;
    if (Xcoord == undefined && Ycoord == undefined) {
        if (difficult == `hard`) {
            coordOfShot = hard();
        }
        else coordOfShot = easy();
        Xcoord = coordOfShot[0];Ycoord = coordOfShot[1];
    }
    let div = document.getElementById(`Me x-${Xcoord},y-${Ycoord}`);
    if (isSameShot(Xcoord,Ycoord,`Me`)) return hisTurn()
    if (isMiss(Xcoord,Ycoord,shipsOfMe)) div.classList.add(`miss`)
    else {div.classList.add(`demage`); marking(Xcoord,Ycoord); dSC[dSC.length]=[Xcoord,Ycoord];demaged=true;anotherOne=true;}
    if (isLose()) return lose();
    if (difficult != `easy`){
        if (demaged) {
            if (dSC.length == 1){
                if (meShipsObj[2] == 0 && meShipsObj[3] == 0 && meShipsObj[4] == 0) {
                    circleMarking(dSC);
                    reset();isReset=true;
                }
                if(!isReset){
                    if (Xcoord == dSC[0][0]-1 && Ycoord === dSC[0][1]) {
                        meShipsObj[1]--; reset();isReset=true;}
                    }
                if(!isReset){
                    if (Xcoord == dSC[0][0]+1 && Ycoord === dSC[0][1]) {
                        if (canShoot(dSC[0][0]-1,dSC[0][1])) {x=dSC[0][0]-1;y=dSC[0][1];}
                        else {meShipsObj[1]--; reset();isReset=true;}
                    }
                }
                if(!isReset){
                    if (Xcoord == dSC[0][0] && Ycoord === dSC[0][1]-1) {
                        if (canShoot(dSC[0][0]+1,dSC[0][1])) {x=dSC[0][0]+1;y=dSC[0][1];}
                        else {
                            if (canShoot(dSC[0][0]-1,dSC[0][1])) {x=dSC[0][0]-1;y=dSC[0][1];}
                            else {meShipsObj[1]--; reset();isReset=true;}
                        }
                    }
                }
                if(!isReset){
                    if (Xcoord == dSC[0][0] && Ycoord === dSC[0][1]+1) {
                        if (canShoot(dSC[0][0],dSC[0][1]-1)) {x=dSC[0][0];y=dSC[0][1]-1;}
                        else {
                            if (canShoot(dSC[0][0]+1,dSC[0][1])) {x=dSC[0][0]+1;y=dSC[0][1];}
                            else {
                                if (canShoot(dSC[0][0]-1,dSC[0][1])) {x=dSC[0][0]-1;y=dSC[0][1];}
                                else {meShipsObj[1]--; reset();isReset=true;}
                            }
                        }
                    }
                }
                if(!isReset){
                    if (Xcoord == dSC[0][0] && Ycoord === dSC[0][1]) {
                        if (canShoot(dSC[0][0],dSC[0][1]+1)) {x=dSC[0][0];y=dSC[0][1]+1;}
                        else {
                            if (canShoot(dSC[0][0],dSC[0][1]-1)) {x=dSC[0][0];y=dSC[0][1]-1;}
                            else {
                                if (canShoot(dSC[0][0]+1,dSC[0][1])) {x=dSC[0][0]+1;y=dSC[0][1];}
                                else {
                                    if (canShoot(dSC[0][0]-1,dSC[0][1])) {x=dSC[0][0]-1;y=dSC[0][1];}
                                    else {meShipsObj[1]--; reset();isReset=true;}
                                }
                            }
                        }
                        
                    }
                }
            }
            if (dSC.length == 2) {
                if (meShipsObj[3] == 0 && meShipsObj[4] == 0) {
                    meShipsObj[2]--;
                    circleMarking(dSC);
                    reset();
                }
                else {
                    if(dSC.length!=0 && dSC[0][0]==dSC[1][0]){
                        let maxY = dSC[0][1]>dSC[1][1] ? dSC[0][1] : dSC[1][1];
                        let minY = dSC[0][1]<dSC[1][1] ? dSC[0][1] : dSC[1][1];
                        if(!isReset){
                            if (Xcoord == dSC[0][0] && Ycoord == minY-1) {
                                meShipsObj[2]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        if(!isReset){
                            if (Xcoord == dSC[0][0] && Ycoord === maxY+1) {
                                if (canShoot(dSC[0][0],minY-1)) {x=dSC[0][0];y=minY-1;}
                                else {meShipsObj[2]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        }
                        if(!isReset){
                            if (Xcoord == dSC[0][0] && Ycoord === dSC[dSC.length-1][1]) {
                                if (canShoot(dSC[0][0],maxY+1)) {x=dSC[0][0];y=maxY+1;}
                                else {
                                    if (canShoot(dSC[0][0],minY-1)) {x=dSC[0][0];y=minY-1;}
                                    else {meShipsObj[2]--; circleMarking(dSC);reset();isReset=true;}
                                }
                            }
                        }
                    }
                    if(dSC.length!=0 && dSC[0][1]==dSC[1][1]){
                        let maxX = dSC[0][0]>dSC[1][0] ? dSC[0][0] : dSC[1][0];
                        let minX = dSC[0][0]<dSC[1][0] ? dSC[0][0] : dSC[1][0];
                        if(!isReset){
                            if (Xcoord == minX-1 && Ycoord == dSC[0][1]) {
                                meShipsObj[2]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        if(!isReset){
                            if (Xcoord == maxX+1 && Ycoord === dSC[0][1]) {
                                if (canShoot(minX-1,dSC[0][1])) {x=minX-1;y=dSC[0][1];}
                                else {meShipsObj[2]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        }
                        if(!isReset){
                            if (Xcoord == dSC[dSC.length-1][0] && Ycoord === dSC[0][1]) {
                                if (canShoot(maxX+1,dSC[0][1])) {x=maxX+1;y=dSC[0][1];}
                                else {
                                    if (canShoot(minX-1,dSC[0][1])) {x=minX-1;y=dSC[0][1];}
                                    else {meShipsObj[2]--; circleMarking(dSC);reset();isReset=true;}
                                }
                            }
                        }
                    }
                }
            }
            if (dSC.length == 3) {
                if (meShipsObj[4] == 0) {
                    meShipsObj[3]--;
                    circleMarking(dSC);
                    reset();
                }
                else {
                    if(dSC.length!=0 && dSC[0][0]==dSC[1][0]){
                        let maxY = dSC[0][1];
                        let minY = dSC[0][1];
                        for (let i = 0; i<dSC.length; i++){
                            if (minY > dSC[i][1]) minY = dSC[i][1]
                            if (maxY < dSC[i][1]) maxY = dSC[i][1]
                        }
                        if(!isReset){
                            if (Xcoord == dSC[0][0] && Ycoord == minY-1) {
                                meShipsObj[3]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        if(!isReset){
                            if (Xcoord == dSC[0][0] && Ycoord === maxY+1) {
                                if (canShoot(dSC[0][0],minY-1)) {x=dSC[0][0];y=minY-1;}
                                else {meShipsObj[3]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        }
                        if(!isReset){
                            if (Xcoord == dSC[0][0] && Ycoord === dSC[dSC.length-1][1]) {
                                if (canShoot(dSC[0][0],maxY+1)) {x=dSC[0][0];y=maxY+1;}
                                else {
                                    if (canShoot(dSC[0][0],minY-1)) {x=dSC[0][0];y=minY-1;}
                                    else {meShipsObj[3]--; circleMarking(dSC);reset();isReset=true;}
                                }
                            }
                        }
                    }
                    if(dSC.length!=0 && dSC[0][1]==dSC[1][1]){
                        let maxX = dSC[0][0];
                        let minX = dSC[0][0];
                        for (let i = 0; i<dSC.length; i++){
                            if (minX > dSC[i][0]) minX = dSC[i][0]
                            if (maxX < dSC[i][0]) maxX = dSC[i][0]
                        }
                        if(!isReset){
                            if (Xcoord == minX-1 && Ycoord == dSC[0][1]) {
                                meShipsObj[3]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        if(!isReset){
                            if (Xcoord == maxX+1 && Ycoord === dSC[0][1]) {
                                if (canShoot(minX-1,dSC[0][1])) {x=minX-1;y=dSC[0][1];}
                                else {meShipsObj[3]--; circleMarking(dSC);reset();isReset=true;}
                            }
                        }
                        if(!isReset){
                            if (Xcoord == dSC[dSC.length-1][0] && Ycoord === dSC[0][1]) {
                                if (canShoot(maxX+1,dSC[0][1])) {x=maxX+1;y=dSC[0][1];}
                                else {
                                    if (canShoot(minX-1,dSC[0][1])) {x=minX-1;y=dSC[0][1];}
                                    else {meShipsObj[3]--; circleMarking(dSC);reset();isReset=true;}
                                }
                            }
                        }
                    }
                }
            }
            if (dSC.length == 4) {
                meShipsObj[4]--;;
                circleMarking(dSC);
                reset();
            }
        }
    }
    isReset = false;
    if (anotherOne) return setTimeout(hisTurn,2000,x,y);
    myTurn();
}

function myTurn(){
    status.children[0].innerText = yourMove;
    status.children[0].style.color = `greenyellow`;
    addOnmousedownOnObjs(cellsOfHim,onMouseDownOnCellsOfHim);
}
function onMouseDownOnCellsOfHim(event){
    let anotherOne = false;
    let eventTar = event.target;
    let coordX = +eventTar.getAttribute(`x`);
    let coordY = +eventTar.getAttribute(`y`);
    let div = document.getElementById(`Him x-${coordX},y-${coordY}`);
    if (event.which == 3) {
        if (div.classList.length >= 3 && !div.classList.contains(`marked`)) return
        return div.classList.toggle(`marked`)
    }
    if (isSameShot(coordX,coordY,`Him`)) return 
    if (isMiss(coordX,coordY,shipsOfHim)) div.classList.add(`miss`)
    else {div.classList.add(`demage`);anotherOne=true;}
    removeOnmousedownOnObjs(cellsOfHim,onMouseDownOnCellsOfHim);
    if (isWin()) return win()
    
    if (anotherOne) return myTurn();
    
    status.children[0].innerText = opponentMove;
    status.children[0].style.color = `red`;
    return setTimeout(hisTurn,2000,x,y);
}
function isMiss(x,y,ships){
    let obj = searchShip(x,y,ships);
    if (obj) return false
    else return true
}
function isSameShot(x,y,which){
    if (document.getElementById(`${which} x-${x},y-${y}`).classList.length > 2) return true
    else return false
}
function win(){
    displayFlex(`you_win`);
}
function lose(){
    displayFlex(`you_lose`);
}
function isLose(){
    for (let i = 0; i < theMatrix.length; i++){
        for (let j = 0; j < theMatrix[i].length; j++){
            if (theMatrix[i][j] == 1 && !document.getElementById(`Me x-${i},y-${j}`).classList.contains("demage")) return false
        }
    }
    return true
}
function isWin(){
    for (let i = 0; i < theMatrixOfHim.length; i++){
        for (let j = 0; j < theMatrixOfHim[i].length; j++){
            if (theMatrixOfHim[i][j] == 1 && !document.getElementById(`Him x-${i},y-${j}`).classList.contains("demage")) return false
        }
    }
    return true
}
function circleMarking(array){
    if (array.length == 1 ){
        for (let i = -1; i<2; i++){
            for (let j = -1; j<2; j++){
                if (i == 0 && j == 0) continue
                if (document.getElementById(`Me x-${array[0][0]+i},y-${array[0][1]+j}`)) if(!document.getElementById(`Me x-${array[0][0]+i},y-${array[0][1]+j}`).classList.contains(`miss`)) document.getElementById(`Me x-${array[0][0]+i},y-${array[0][1]+j}`).classList.add(`marked`);
            }
        }
    }
    else {
        if (array[0][0] == array[1][0]){
            let minY = array[0][1];
            for (let i = 0; i<array.length; i++){
                if (minY > array[i][1]) minY = array[i][1]
            }

            for (let i = -1; i<2; i++){
                for (let j = -1; j<=array.length; j++){
                    let divtar = document.getElementById(`Me x-${array[0][0]+i},y-${minY+j}`);
                    if (divtar) if(divtar.classList.length < 3) divtar.classList.add(`marked`); 
                }
            }
        }
        else {
            let minX = array[0][0];
            for (let i = 0; i<array.length; i++){
                if (minX > array[i][0]) minX = array[i][0]
            }

            for (let i = -1; i<=array.length; i++){
                for (let j = -1; j<2; j++){
                    let divtar = document.getElementById(`Me x-${minX+i},y-${array[0][1]+j}`)
                    if (divtar) if(divtar.classList.length < 3) divtar.classList.add(`marked`); 
                }
            }
        }
    }
}
function marking(x,y){
    if (document.getElementById(`Me x-${x+1},y-${y+1}`)) if(!document.getElementById(`Me x-${x+1},y-${y+1}`).classList.contains(`miss`)) document.getElementById(`Me x-${x+1},y-${y+1}`).classList.add(`marked`);
    if (document.getElementById(`Me x-${x-1},y-${y-1}`)) if(!document.getElementById(`Me x-${x-1},y-${y-1}`).classList.contains(`miss`)) document.getElementById(`Me x-${x-1},y-${y-1}`).classList.add(`marked`);
    if (document.getElementById(`Me x-${x+1},y-${y-1}`)) if(!document.getElementById(`Me x-${x+1},y-${y-1}`).classList.contains(`miss`)) document.getElementById(`Me x-${x+1},y-${y-1}`).classList.add(`marked`);
    if (document.getElementById(`Me x-${x-1},y-${y+1}`)) if(!document.getElementById(`Me x-${x-1},y-${y+1}`).classList.contains(`miss`)) document.getElementById(`Me x-${x-1},y-${y+1}`).classList.add(`marked`);
}
function canShoot(x,y){
    if (document.getElementById(`Me x-${x},y-${y}`)) if (document.getElementById(`Me x-${x},y-${y}`).classList.length < 3) return true
    return false
}
function reset(){
    demaged = false;
    dSC = [];
    x = undefined;
    y = undefined;
}
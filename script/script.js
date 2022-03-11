let theMatrix = [];
let theMatrixOfHim = [];
let field = document.querySelector(`.field`);
creatingCell(field);
creatingMatrix(theMatrix);
creatingMatrix(theMatrixOfHim);
let shipsObjs = document.querySelectorAll(`.ship`);
let cells = document.querySelectorAll(`.cell`);
let placementOfShips = document.querySelector(`.placement_of_ships`);
let shipsPanel = document.querySelector(`.ships_panel`);
let shipsOfMe = [];
let shipsOfHim = [];
let index = 0;
let arrOfNumbers = document.querySelectorAll(`h3`);
addOnmousedownOnObjs(shipsObjs,onMouseDownOnShips);
addOnmousedownOnObjs(cells,onMouseDownOnCells);
placementOfShips.oncontextmenu = NoRight;












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
function onMouseDownOnCells(event){
    let eventTar = event.target;
    if (!eventTar.style.backgroundColor) return
    let movedShip = searchShip(+eventTar.getAttribute(`x`),+eventTar.getAttribute(`y`));
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
function searchShip(x,y){
    for (let item of shipsOfMe){
        if (item.x0()<=x && item.y0()<=y && item.x2()>=x && item.y2()>=y) return item
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
    countOfShips(arrayOfShips[index-1].className());
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
            document.getElementById(`x-${obj.x1 + i},y-${obj.y1}`).style.backgroundColor = `red`;
        }
    }
    else {
        for (let i=0; i < obj.numberOfdeck; i++){
            obj.array[obj.x1][obj.y1 + i] = 1;
            document.getElementById(`x-${obj.x1},y-${obj.y1 + i}`).style.backgroundColor = `red`;
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
            if (placeHolder == 0) document.getElementById(`x-${i},y-${j}`).style.backgroundColor = ``;
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
            cell.setAttribute(`id`,`x-${i},y-${j}`);
            cell.setAttribute(`x`,i);
            cell.setAttribute(`y`,j);
            cell.className = `cell`;
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
var currentTurn = "X";
var p1Score = 0;
var p2Score = 0;

var xCount = 0;
var oCount = 0;

var gameArr = [];
gameArr.length = 9;

gameArr.forEach(a => a = -1);

const draggableCells = document.querySelectorAll(".draggableCell");
const targetCells = document.querySelectorAll(".board");

function updateScores(){
    document.getElementById("p1Score").innerText = `Player 1 Score: ${p1Score}`;
    document.getElementById("p2Score").innerText = `Player 2 Score: ${p2Score}`;
}

function viewWinner(){
    document.getElementById("resultTitle").innerText = `Player ${currentTurn == "X" ? 2 : 1} Wins`;
    document.getElementById("gameBoard").style.display = "none";
    document.getElementById("result").style.display = "flex";
}

function resetCells(){
    draggableCells.forEach(cell => cell.setAttribute("isInside", "true"));

    xCount = 0;
    oCount = 0;

    document.getElementById("pc1").appendChild(draggableCells[0]);
    document.getElementById("pc2").appendChild(draggableCells[1]);
    document.getElementById("pc3").appendChild(draggableCells[2]);
    document.getElementById("pc4").appendChild(draggableCells[3]);
    document.getElementById("pc5").appendChild(draggableCells[4]);
    document.getElementById("pc6").appendChild(draggableCells[5]);

    targetCells.forEach(cell => {
        cell.innerHTML = ``;
    })
}

function nextGame(){
    resetCells();
    document.getElementById("gameBoard").style.display = "flex";
    document.getElementById("result").style.display = "none";
}

updateScores()

function findDraggableCellLocation(id) {
    const draggableCell = document.getElementById(id);
    
    if (draggableCell) {
        const parentTd = draggableCell.closest('.cell.board');
        if (parentTd) {
            let parentTdId = parentTd.id;
            return parentTdId;
        } 
    } 
    return undefined;
}

function checkSurroundings(isNew, id){
    if (isNew){
        return true;
    }
    const parentId = findDraggableCellLocation(id);

    const parentIndex = parentId[2];

    console.log("Parent Index: ", parentIndex);

    const opponent = currentTurn == "X" ? "O" : "X";

    if (parentIndex == 1 && (gameArr[0] == gameArr[3] && gameArr[3] == gameArr[4] && gameArr[4] == opponent)){
        return false;
    }
    if (parentIndex == 3 && (gameArr[1] == gameArr[4] && gameArr[4] == gameArr[5] && gameArr[5] == opponent)){
        return false;
    }
    if (parentIndex == 7 && (gameArr[3] == gameArr[4] && gameArr[4] == gameArr[7] && gameArr[7] == opponent)){
        return false;
    }
    if (parentIndex == 9 && (gameArr[4] == gameArr[5] && gameArr[5] == gameArr[7] && gameArr[7] == opponent)){
        return false;
    }

    return true;
}

draggableCells.forEach(draggableCell => {
    draggableCell.addEventListener("dragstart", (e) => {
        e.dataTransfer.clearData();
        const id = e.target.id;
        let isNew = e.target.getAttribute("isInside");

        if (((currentTurn === "X" && (id == "dc1" || id == "dc2" || id == "dc3")) 
            || (currentTurn === "O" && (id == "dc4" || id == "dc5" || id == "dc6")))
        && (isNew=="true" || (currentTurn=="X" ? xCount>=3 : oCount >= 3)) && checkSurroundings(isNew, id)
            ){
            e.dataTransfer.setData("text/plain", id);
        }else{
            e.currentTarget.classList.add("danger");
        }
    });

    draggableCell.addEventListener("dragend", (e) =>
        e.target.classList.remove("danger"),
    );

});

targetCells.forEach(targetCell => {
    targetCell.addEventListener("dragover", e => {
        e.preventDefault();
    });
    
    targetCell.addEventListener("mousedown", e => e.stopPropagation());


    targetCell.addEventListener("drop", e => {        
        e.preventDefault();
        if (!targetCell.innerHTML){      
            const item = document.getElementById(e.dataTransfer.getData("text"));
            e.target.appendChild(item);

            if (currentTurn=="X"){
                xCount++;
            }else{
                oCount++;
            }
            item.setAttribute("isInside", "false");

            let tempVar = (e.target.id)[2];
            gameArr[tempVar-1] = currentTurn;

            console.log(gameArr);

            currentTurn = currentTurn === "X" ? "O" : "X";

            document.getElementById("turn").innerText = `Player ${currentTurn} Turn`;

            let pos1 = document.getElementById("bc1").innerText;
            let pos2 = document.getElementById("bc2").innerText;
            let pos3 = document.getElementById("bc3").innerText;
            let pos4 = document.getElementById("bc4").innerText;
            let pos5 = document.getElementById("bc5").innerText;
            let pos6 = document.getElementById("bc6").innerText;
            let pos7 = document.getElementById("bc7").innerText;
            let pos8 = document.getElementById("bc8").innerText;
            let pos9 = document.getElementById("bc9").innerText;

            if ((pos1 == pos2 && pos2 == pos3 && pos3 != "") ||
                (pos4 == pos5 && pos5 == pos6 && pos6 != "") ||
                (pos7 == pos8 && pos8 == pos9 && pos9 != "") ||
                (pos1 == pos4 && pos4 == pos7 && pos7 != "") ||
                (pos2 == pos5 && pos5 == pos8 && pos8 != "") ||
                (pos3 == pos6 && pos6 == pos9 && pos9 != "") ||
                (pos1 == pos5 && pos5 == pos9 && pos9 != "") ||
                (pos3 == pos5 && pos5 == pos7 && pos7 != "") 
            ){
                if (currentTurn == "X"){
                    p2Score++;
                }else{
                    p1Score++;
                }
                updateScores();
                viewWinner();
            }
        }else{
            // currentTurn = currentTurn === "X" ? "O" : "X";
        }
    })
})
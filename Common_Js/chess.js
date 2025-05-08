var selectedPiece = null;
var secret_queen = null;
var white_turn = true;
var white_wait = false;
var black_wait = false;
var id_new_piece = 9; // Si la prochaine nouvelle piece a l'ID 9, elle sera unique
var selectedPromotionCase; // used only for promotion
var canShortCastle = true;
var canLongCastle = true;
var iWantRematch = false;
var heWantsRematch = false;



function handleClick(piece_id) {
    if (selectedPiece !== null) {
        document.getElementById(selectedPiece).classList.remove('selected');
    }
    document.getElementById(piece_id).classList.add('selected');
    selectedPiece = piece_id;
}

function playSound(soundName) {
    var audio = new Audio('../Sounds/'+soundName+".mp3");
    audio.play();
}




function blackPieceMoveTo(pieceId, case_id){
    // supprime l'éventuelle pièce à la case d'arrivée de la pièce
    removeWhitePieceOnCase(case_id);

    // déplace la pièce
    let element = document.getElementById(pieceId)
    element.className = ''
    element.classList.add('piece_black', case_id);

    // joue le son du déplacement
    playSound("move")

    // donne le tour aux blancs
    white_turn = true;
}

function whitePieceMoveTo(pieceId, case_id){
    // supprime l'éventuelle pièce à la case d'arrivée de la pièce
    removeBlackPieceOnCase(case_id);

    // déplace la pièce
    let element = document.getElementById(pieceId)
    element.className = ''
    element.classList.add('piece_white', case_id);

    // joue le son du déplacement
    playSound("move")

    // donne le tour aux noirs
    white_turn = false;
}


function removeBlackPieceOnCase(case_id) {
    const pieces = document.querySelectorAll('.piece_black');
    pieces.forEach(piece => {
        if (piece.classList[1] === case_id) {
            piece.remove(); // Supprime l'élément du DOM
            if(piece.id=="bk"){
                showVictoryMessage("blancs")
            }
            if (piece.classList.contains('selected')) {
                selectedPiece = null
            }
        }
    });
}

function removeWhitePieceOnCase(case_id) {
    const pieces = document.querySelectorAll('.piece_white');
    pieces.forEach(piece => {
        if (piece.classList[1] === case_id) {
            piece.remove(); // Supprime l'élément du DOM
            playSound("take")
            if(piece.id=="wk"){
                showVictoryMessage("noirs")
            }
            if (piece.classList.contains('selected')) {
                selectedPiece = null
            }
        }
    });
}

function endTurn(case_id){
    // envoie le message à l'autre joueur
    msgToSend = "move-"+selectedPiece+"-"+case_id
    sendMessage(msgToSend)

    // déselectionne la pièce
    selectedPiece = null
}




function showVictoryMessage(winner) {
    const msg = document.createElement('div');
    msg.id = 'victory-message';
    msg.className = 'secret-box';
    msg.innerHTML = `
        <p>Victoire des ${winner} !</p>
        <button id="ask_rematch_button" class="btn-start" onclick="askReset()">Rejouter</button>
        <p id="rematch_waiting"></p>
    `;
    document.body.appendChild(msg);
    playSound("checkmate");
}


function updateIdPiece(oldId, color, newpiece){
    pawn = document.getElementById(oldId)
    newId = color + newpiece + id_new_piece;
    pawn.id = newId;
    id_new_piece++;
    pawn.src = "../images/" + color + newpiece + ".png"
    document.getElementById("promotion").style.visibility = "hidden";
    return newId
}


function showPromotionMenu(to){
    selectedPromotionCase = to;
    document.getElementById("promotion").style.visibility = "visible";
}

function endTurnCastle(color, isShort){
    // envoie le message à l'autre joueur
    msgToSend = "castle-"+color+"-"+isShort
    console.log("i am sending ",msgToSend)
    sendMessage(msgToSend)

    // déselectionne la pièce
    selectedPiece = null
}

function toCastle(color, isShort){
    playSound("castle")
    if(color=='w'){
        if(isShort){
            console.log("short castle ")
            // déplace le roi
            let king = document.getElementById('wk')
            king.className = ''
            king.classList.add('piece_white', 'g1');

            // déplace la tour
            let rook = document.getElementById('wr2')
            rook.className = ''
            rook.classList.add('piece_white', 'f1');
        } else {
            console.log("long castle ")
            // déplace le roi
            let king = document.getElementById('wk')
            king.className = ''
            king.classList.add('piece_white', 'c1');

            // déplace la tour
            let rook = document.getElementById('wr1')
            rook.className = ''
            rook.classList.add('piece_white', 'd1');
        }
        // donne le tour aux noirs
        white_turn = false;
    } 
    else if(color=='b'){
        if(isShort){
            console.log("short castle ")
            // déplace le roi
            let king = document.getElementById('bk')
            king.className = ''
            king.classList.add('piece_black', 'g8');

            // déplace la tour
            let rook = document.getElementById('br2')
            rook.className = ''
            rook.classList.add('piece_black', 'f8');
        } else {
            console.log("long castle ")
            // déplace le roi
            let king = document.getElementById('bk')
            king.className = ''
            king.classList.add('piece_black', 'c8');

            // déplace la tour
            let rook = document.getElementById('br1')
            rook.className = ''
            rook.classList.add('piece_black', 'd8');
        }
        // donne le tour aux blancs
        white_turn = true;
    }
}



function isCaseEmpty(case_id) {
    let pieces = document.querySelectorAll('.piece_white');
    for (let piece of pieces) {
        if (piece.classList[1] === case_id) {
            return false;
        }
    }
    pieces = document.querySelectorAll('.piece_black');
    for (let piece of pieces) {
        if (piece.classList[1] === case_id) {
            return false;
        }
    }
    return true;
}



function isLegalMove(type, isWhite, from, to) {
    const dx = to.charCodeAt(0) - from.charCodeAt(0); // colonne (a-h)
    const dy = parseInt(to[1]) - parseInt(from[1]);    // ligne (1-8)

    const fromX = from.charCodeAt(0);
    const fromY = parseInt(from[1]);
    const toX = to.charCodeAt(0);
    const toY = parseInt(to[1]);

    function isPathClear() {
        const stepX = Math.sign(toX - fromX);
        const stepY = Math.sign(toY - fromY);
        let x = fromX + stepX;
        let y = fromY + stepY;
    
        while (x !== toX || y !== toY) {
            const intermediate = String.fromCharCode(x) + y;
            if (!isCaseEmpty(intermediate)) return false;
            x += stepX;
            y += stepY;
        }
        if((selectedPiece=='br2')||(selectedPiece=='wr2')){
            canShortCastle = false
        } else if((selectedPiece=='br1')||(selectedPiece=='wr1')){
            canLongCastle = false
        }
        return true;
    }

    switch (type) {
        case 'r': // rook
            if (dx === 0 || dy === 0) {
                return isPathClear();
            }
            return false;

        case 'n': // knight
            return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
                (Math.abs(dx) === 1 && Math.abs(dy) === 2);

        case 'b': // bishop
            if (Math.abs(dx) === Math.abs(dy)) {
                return isPathClear();
            }
            return false;

        case 'q': // queen
            if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
                return isPathClear();
            }
            return false;

        case 'k': // king

            // Tentative de roque
            if (isWhite) {
                if (to === 'g1' && canShortCastle && isCaseEmpty('f1') && isCaseEmpty('g1')) {
                    toCastle('w', true);
                    endTurnCastle('w', true);
                    return false;
                } else if (to === 'c1' && canLongCastle && isCaseEmpty('d1') && isCaseEmpty('c1') && isCaseEmpty('b1')) {
                    toCastle('w', false);
                    endTurnCastle('w', false);
                    return false;
                }
            }
            if (!isWhite) {
                if (to === 'g8' && canShortCastle && isCaseEmpty('f8') && isCaseEmpty('g8')) {
                    toCastle('b', true);
                    endTurnCastle('b', true);
                    return false;
                } else if (to === 'c8' && canLongCastle && isCaseEmpty('d8') && isCaseEmpty('c8') && isCaseEmpty('b8')) {
                    toCastle('b', false);
                    endTurnCastle('b', false);
                    return false;
                }
            }

            const canKingMove = Math.abs(dx) <= 1 && Math.abs(dy) <= 1
            if(canKingMove){
                canShortCastle = false;
                canLongCastle = false;
            }
            // Déplacement normal du roi
            return canKingMove;

        case 'p': {
            const direction = isWhite ? 1 : -1;
            const startRow = isWhite ? 2 : 7;
            const promotionRow = isWhite ? 8 : 1;
        
            const fromRow = parseInt(from[1]);
            const toRow = parseInt(to[1]);
        
            const targetIsEmpty = isCaseEmpty(to);
            const forwardOne = dx === 0 && dy === direction;
            const forwardTwo = dx === 0 && dy === 2 * direction && fromRow === startRow;
            const diagonalAttack = Math.abs(dx) === 1 && dy === direction;
        
            // Si on atteint la dernière rangée, afficher le menu de promotion et que le pion n'est pas la secret queen
            if ((toRow === promotionRow)&&(selectedPiece != secret_queen)) {
                showPromotionMenu(to);
                return false;
            }
        
            // Avancer d'une case : doit être vide
            if (forwardOne && targetIsEmpty) return true;
        
            // Avancer de deux cases : les deux doivent être vides
            if (forwardTwo) {
                const intermediateY = fromRow + direction;
                const intermediate = from[0] + intermediateY;
                if (isCaseEmpty(intermediate) && targetIsEmpty) return true;
            }

            // Capture diagonale : doit avoir une pièce
            if (diagonalAttack && !targetIsEmpty) return true;

            return false;
        }

        default:
            return false;
    }
}

function clearPieces() {
    document.querySelectorAll(".piece_black, .piece_white").forEach(piece => piece.remove());
}

function resetBoard(){
    // suppression du message de victoire
    document.getElementById("victory-message").remove();
    
    // suppression des pièces restantes sur le plateau
    clearPieces()

    playSound("intro")

    // reset all the parameters
    selectedPiece = null;
    secret_queen = null;
    white_turn = true;
    white_wait = false;
    black_wait = false;
    id_new_piece = 9;
    selectedPromotionCase;
    canShortCastle = true;
    canLongCastle = true;
    iWantRematch = false;
    heWantsRematch = false;

    setupPieces()
}

function askReset(){
    iWantRematch = true;
    sendMessage("rematch")

    // Mise à jour du message de l'utilisateur
    document.getElementById("ask_rematch_button").remove();
    document.getElementById("rematch_waiting").innerText = "En attente de l'adversaire...";

    if((iWantRematch)&&(heWantsRematch)){
        resetBoard()
    }
}

function getResetRequest(){
    heWantsRematch = true
    if((iWantRematch)&&(heWantsRematch)){
        resetBoard()
    }
}
var selectedPiece = null;
var white_turn = true;
var white_wait = false;
var black_wait = false;



function handleClick(piece_id) {
    if (selectedPiece !== null) {
        document.getElementById(selectedPiece).classList.remove('selected');
    }
    document.getElementById(piece_id).classList.add('selected');
    selectedPiece = piece_id;
}




function blackPieceMoveTo(pieceId, case_id){
    // supprime l'éventuelle pièce à la case d'arrivée de la pièce
    removeWhitePieceOnCase(case_id);

    // déplace la pièce
    let element = document.getElementById(pieceId)
    element.className = ''
    element.classList.add('piece_black', case_id);

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

    // donne le tour aux blancs
    selectedPiece = null
}




function showVictoryMessage(winner) {
    const msg = document.createElement('div');
    msg.innerText = `Victoire des ${winner} !`;
    msg.className = 'victory-message';
    document.body.appendChild(msg);
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

    switch (type) {
        case 'r': // rook
            return dx === 0 || dy === 0;

        case 'n': // knight
            return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
                (Math.abs(dx) === 1 && Math.abs(dy) === 2);

        case 'b': // bishop
            return Math.abs(dx) === Math.abs(dy);

        case 'q': // queen
            return dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);

        case 'k': // king
            return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;

        case 'p': {
            const direction = isWhite ? 1 : -1;
            const startRow = isWhite ? 2 : 7;
            const fromRow = parseInt(from[1]);

            const targetIsEmpty = isCaseEmpty(to);
            console.log(targetIsEmpty)
            const forwardOne = dx === 0 && dy === direction;
            const forwardTwo = dx === 0 && dy === 2 * direction && fromRow === startRow;
            const diagonalAttack = Math.abs(dx) === 1 && dy === direction;

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
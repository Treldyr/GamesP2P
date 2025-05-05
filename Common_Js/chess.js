var selectedPiece = null;
var white_turn = true;
var white_wait = false;
var black_wait = false;

function removeBlackPieceOnCase(case_id) {
    const pieces = document.querySelectorAll('.piece_black');
    pieces.forEach(piece => {
        if (piece.classList[1] === case_id) {
            piece.remove(); // Supprime l'élément du DOM
            if(piece.id=="bk"){
                showVictoryMessage("blancs")
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
        }
    });
}

function handleClick(piece_id) {
    if (selectedPiece !== null) {
        document.getElementById(selectedPiece).classList.remove('selected');
    }
    document.getElementById(piece_id).classList.add('selected');
    selectedPiece = piece_id;
}

function showVictoryMessage(winner) {
    const msg = document.createElement('div');
    msg.innerText = `Victoire des ${winner} !`;
    msg.className = 'victory-message';
    document.body.appendChild(msg);
}
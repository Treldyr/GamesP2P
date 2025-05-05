function tryMoveTo(case_id){
    if(!white_turn){
        if(selectedPiece!== null){
            let element = document.getElementById(selectedPiece)
            let piece_case = element.classList[1];
            const pieceType = selectedPiece.slice(1, 2);  // ex: "r" pour "br1"

            if (isLegalMove(pieceType, piece_case, case_id)) {
                blackPieceMoveTo(case_id);
            } else {
                console.log("Coup illégal !");
            }
        }
    } else {
        alert("Ce n'est pas votre tour !")
    }
}

function blackPieceMoveTo(case_id){
    // supprime l'éventuelle pièce à la case d'arrivée de la pièce
    removeWhitePieceOnCase(case_id)

    // envoie le message à l'autre joueur
    msgToSend = "move-"+selectedPiece+"-"+case_id
    sendMessage(msgToSend)

    // déplace la pièce
    let element = document.getElementById(selectedPiece)
    element.className = ''
    element.classList.add('piece_black', case_id);
    selectedPiece = null

    // donne le tour aux blancs
    white_turn = true;
}

function treatNewMessage(msg){
    let typeMsg = msg.split('-')[0]
    if(typeMsg=="move"){
        let pieceId = msg.split('-')[1]
        let caseId = msg.split('-')[2]
        whitePieceMoveTo(pieceId,caseId)
    }
    console.log(msg)
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

function isLegalMove(type, from, to) {
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

        case 'p': // pawn
            const direction = -1;
            const startRow = 7;
            const fromRow = parseInt(from[1]);

            if (dx === 0) {
                if (dy === direction) return true; // 1 case en avant
                if (dy === 2 * direction && fromRow === startRow) return true; // 2 cases depuis la base
            } else if (Math.abs(dx) === 1 && dy === direction) {
                // Capture diagonale (à toi d’ajouter une vérif si une pièce est présente)
                return true;
            }
            return false;

        default:
            return false;
    }
}
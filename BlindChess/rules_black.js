function tryMoveTo(case_id){
    if(!white_turn){
        if(selectedPiece!== null){
            let element = document.getElementById(selectedPiece)
            let piece_case = element.classList[1];
            const pieceType = selectedPiece.slice(1, 2);  // ex: "r" pour "br1"

            if (isLegalMove(pieceType, false, piece_case, case_id)) {
                blackPieceMoveTo(selectedPiece, case_id);
                endTurn(case_id);
            } else {
                console.log("Coup illégal !");
            }
        }
    } else {
        alert("Ce n'est pas votre tour !")
    }
}

function treatNewMessage(msg){
    console.log(msg)
    let typeMsg = msg.split('-')[0]
    if(typeMsg=="move"){
        let pieceId = msg.split('-')[1]
        let caseId = msg.split('-')[2]
        whitePieceMoveTo(pieceId,caseId)
    }
    if(typeMsg=="promote"){
        let pieceId = msg.split('-')[1]
        let caseId = msg.split('-')[2]
        let newId = msg.split('-')[3]
        whitePieceMoveTo(pieceId,caseId)
        updateIdPiece(pieceId, newId[0], newId[1])
        selectedPiece = null
    }
    if(typeMsg=="castle"){
        let color = msg.split('-')[1]
        let isShort = msg.split('-')[2] === 'true'
        toCastle(color, isShort)
    }
    if(typeMsg=="rematch"){
        getResetRequest()
    }
}

function promote(color, piece) {
    // update l'id du pion
    let oldId = selectedPiece
    let newId = updateIdPiece(oldId, color, piece)
    selectedPiece = newId

    // bouge le pion
    blackPieceMoveTo(newId, selectedPromotionCase);

    // envoie le message à l'autre joueur
    msgToSend = "promote-"+oldId+"-"+selectedPromotionCase+"-"+newId
    sendMessage(msgToSend)
}


function setupPieces() {
    const container = document.getElementById("pieces_container");
    const pieces = [];

    // Pièces noires (rangée 8)
    const blackPiecesRow = ["r", "n", "b", "q", "k", "b", "n", "r"];
    const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
    blackPiecesRow.forEach((type, i) => {
        const id = `b${type}${type === "k" || type === "q" ? "" : (type === "b" && i > 4) || (type === "n" && i > 5) || (type === "r" && i > 6) ? "2" : "1"}`;
        const className = `piece_black ${cols[i]}8`;
        pieces.push(`<img id="${id}" src="../images/b${type}.png" class="${className}" onclick="handleClick(this.id)">`);
    });

    // Pions noirs (rangée 7)
    cols.forEach((col, i) => {
        pieces.push(`<img id="bp${i + 1}" src="../images/bp.png" class="piece_black ${col}7" onclick="handleClick(this.id)">`);
    });

    // Pièces blanches (rangée 1)
    const whitePiecesRow = ["r", "n", "b", "q", "k", "b", "n", "r"];
    whitePiecesRow.forEach((type, i) => {
        const id = `w${type}${type === "k" || type === "q" ? "" : (type === "b" && i > 4) || (type === "n" && i > 5) || (type === "r" && i > 6) ? "2" : "1"}`;
        const className = `piece_white ${cols[i]}1`;
        pieces.push(`<img id="${id}" src="../images/wp.png" class="${className}" onclick="tryMoveTo(this.classList[1])">`);
    });

    // Pions blancs (rangée 2)
    cols.forEach((col, i) => {
        pieces.push(`<img id="wp${i + 1}" src="../images/wp.png" class="piece_white ${col}2" onclick="tryMoveTo(this.classList[1])">`);
    });

    container.innerHTML = pieces.join("\n");
}
function tryMoveTo(case_id){
    if(white_turn){
        if(selectedPiece!== null){
            let element = document.getElementById(selectedPiece)
            let piece_case = element.classList[1];
            const pieceType = selectedPiece.slice(1, 2);  // ex: "r" pour "br1"

            if (isLegalMove(pieceType, true, piece_case, case_id)) {
                whitePieceMoveTo(selectedPiece, case_id);
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
        blackPieceMoveTo(pieceId,caseId)
    }
    if(typeMsg=="promote"){
        let pieceId = msg.split('-')[1]
        let caseId = msg.split('-')[2]
        let newId = msg.split('-')[3]
        blackPieceMoveTo(pieceId,caseId)
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
    whitePieceMoveTo(newId, selectedPromotionCase);

    // envoie le message à l'autre joueur
    msgToSend = "promote-"+oldId+"-"+selectedPromotionCase+"-"+newId
    sendMessage(msgToSend)
}


function setupPieces() {
    const container = document.getElementById("pieces_container");
    const pieces = [];
    const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

    // Pièces noires (rangée 8 – fausses, donc vraies images mais tryMoveTo)
    const blackPieces = ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"];
    blackPieces.forEach((type, i) => {
        const suffix = (type === "bb" && i > 4) || (type === "bn" && i > 5) || (type === "br" && i > 6) ? "2" : "1";
        const id = `${type}${suffix}`;
        const className = `piece_black ${cols[i]}8`;
        const imgFile = `${type}.png`;
        pieces.push(`<img id="${id}" src="../images/${imgFile}" class="${className}" onclick="tryMoveTo(this.classList[1])">`);
    });

    // Pions noirs (rangée 7 – fausses)
    cols.forEach((col, i) => {
        const id = `bp${i + 1}`;
        const className = `piece_black ${col}7`;
        pieces.push(`<img id="${id}" src="../images/bp.png" class="${className}" onclick="tryMoveTo(this.classList[1])">`);
    });

    // Pièces blanches (rangée 1 – vraies, donc vraies images + handleClick)
    const whitePieces = ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"];
    whitePieces.forEach((type, i) => {
        const suffix = (type === "wb" && i > 4) || (type === "wn" && i > 5) || (type === "wr" && i > 6) ? "2" : "1";
        const id = `${type}${suffix}`;
        const className = `piece_white ${cols[i]}1`;
        const imgFile = `${type}.png`;
        pieces.push(`<img id="${id}" src="../images/${imgFile}" class="${className}" onclick="handleClick(this.id)">`);
    });

    // Pions blancs (rangée 2 – vrais)
    cols.forEach((col, i) => {
        const id = `wp${i + 1}`;
        const className = `piece_white ${col}2`;
        pieces.push(`<img id="${id}" src="../images/wp.png" class="${className}" onclick="handleClick(this.id)">`);
    });

    container.innerHTML = pieces.join("\n");
}

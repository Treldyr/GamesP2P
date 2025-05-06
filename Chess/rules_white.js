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
    let typeMsg = msg.split('-')[0]
    let pieceId = msg.split('-')[1]
    let caseId = msg.split('-')[2]
    if(typeMsg=="move"){
        blackPieceMoveTo(pieceId,caseId)
    }
    if(typeMsg=="promote"){
        let newId = msg.split('-')[3]
        blackPieceMoveTo(pieceId,caseId)
        updateIdPiece(pieceId, newId[0], newId[1])
        selectedPiece = null
    }
    console.log(msg)
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
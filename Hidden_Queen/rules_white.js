function handleClickSecretQueen(piece_id) {
    if (selectedPiece !== null) {
        document.getElementById(selectedPiece).classList.remove('selected');
    }
    document.getElementById(piece_id).classList.add('selected');
    selectedPiece = piece_id;
    if(secret_queen ==null){
        document.getElementById('secretQueenSelector').style.visibility = "visible"
    }
}

function chooseAsSecretQueen(){
    if (selectedPiece[1] === 'p') {
        document.getElementById('secretQueenSelector').style.visibility = "hidden"
        secret_queen = selectedPiece
        document.getElementById(selectedPiece).src = "../images/wq.png"
    }
}

function FirstTryMove(case_id){
    if(secret_queen!==null){
        tryMoveTo(case_id)
    }
}

function tryMoveTo(case_id){
    if(white_turn){
        if(selectedPiece!== null){
            let element = document.getElementById(selectedPiece)
            let piece_case = element.classList[1];
            const pieceType = selectedPiece.slice(1, 2);  // ex: "r" pour "br1"

            if (isLegalMove(pieceType, true, piece_case, case_id)) {
                whitePieceMoveTo(selectedPiece, case_id);
                endTurn(case_id);
            } else if(secret_queen==selectedPiece){
                if(isLegalMove('q', true, piece_case, case_id)){
                    whitePieceMoveTo(selectedPiece, case_id);
                    endTurn(case_id);
                }
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
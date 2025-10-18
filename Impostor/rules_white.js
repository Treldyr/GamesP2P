function tryMoveTo(case_id){
    if(impostor_pawn!=null){
        if(impostor_piece!=null){
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
        } else {
            alert("Vous devez convertir une pièce en imposteur !")
        }
    } else {
        alert("Vous devez convertir un pion en imposteur !")
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
    if(typeMsg=="reveal"){
        receiveReveal(msg.split('-')[1])
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
        pieces.push(`<img id="${id}" src="../images/${imgFile}" class="${className}" onclick="tryMoveAndImpostorPiece(this.classList[1], this.id)">`);
    });

    // Pions noirs (rangée 7 – fausses)
    cols.forEach((col, i) => {
        const id = `bp${i + 1}`;
        const className = `piece_black ${col}7`;
        pieces.push(`<img id="${id}" src="../images/bp.png" class="${className}" onclick="tryMoveAndImpostorPawn(this.classList[1], this.id)">`);
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

    impostor_pawn = null
    impostor_piece = null
    impostor_pawn_chosen = false
    impostor_piece_chosen = false
}

// Impostor functions

let impostor_pawn = null
let impostor_piece = null
let impostor_pawn_chosen = false
let impostor_piece_chosen = false


function tryMoveAndImpostorPiece(case_id, piece_id){
    if(!impostor_piece_chosen){
        document.getElementById('secretPieceSelector').style.visibility = "visible"
        impostor_piece = piece_id
    } else if(impostor_pawn_chosen){
        if(piece_id == impostor_piece){
            document.getElementById('askRevealPiece').style.visibility = "visible"
        } else {
            tryMoveTo(case_id)
        }
    }
    
}

function tryMoveAndImpostorPawn(case_id, piece_id){
    if(!impostor_pawn_chosen){
        document.getElementById('secretPawnSelector').style.visibility = "visible"
        impostor_pawn = piece_id
    } else if(impostor_piece_chosen){
        if(piece_id == impostor_pawn){
            document.getElementById('askRevealPawn').style.visibility = "visible"
        } else {
            tryMoveTo(case_id)
        }
        tryMoveTo(case_id)
    }
}

function convertPawn(){
    impostor_pawn_chosen = true
    document.getElementById(impostor_pawn).src = "../images/rp.png"
    document.getElementById('secretPawnSelector').style.visibility = "hidden"
}

function convertPiece() {
    impostor_piece_chosen = true
    document.getElementById('secretPieceSelector').style.visibility = "hidden"

    switch (impostor_piece) {
        case "br1":
        case "br2":
            document.getElementById(impostor_piece).src = "../images/rr.png"
            break

        case "bn1":
        case "bn2":
            document.getElementById(impostor_piece).src = "../images/rn.png"
        break

        case "bb1":
        case "bb2":
            document.getElementById(impostor_piece).src = "../images/rb.png"
        break
        
        case "bq":
            document.getElementById(impostor_piece).src = "../images/rq.png"
            break
        default:
            console.warn("Type de pièce inconnu :", impostor_piece)
    }
}

function closeAskPiece(){
    document.getElementById('askRevealPiece').style.visibility = "hidden"
}

function closeAskPawn(){
    document.getElementById('askRevealPawn').style.visibility = "hidden"
}

function revealPiece(){
    playSound("transition")
    document.getElementById(impostor_piece).classList.replace("piece_black", "piece_white");
    document.getElementById(impostor_piece).setAttribute("onclick", "handleClick(this.id)");
    switch (impostor_piece) {
        case "br1":
        case "br2":
            document.getElementById(impostor_piece).src = "../images/wr.png"
            break

        case "bn1":
        case "bn2":
            document.getElementById(impostor_piece).src = "../images/wn.png"
        break

        case "bb1":
        case "bb2":
            document.getElementById(impostor_piece).src = "../images/wb.png"
        break
        
        case "bq":
            document.getElementById(impostor_piece).src = "../images/wq.png"
            break
        default:
            console.warn("Type de pièce inconnu :", impostor_piece)
    }
    msgToSend = "reveal-"+impostor_piece
    sendMessage(msgToSend)
    document.getElementById('askRevealPiece').style.visibility = "hidden"
}

function revealPawn(){
    playSound("transition")
    document.getElementById(impostor_pawn).classList.replace("piece_black", "piece_white");
    document.getElementById(impostor_pawn).setAttribute("onclick", "handleClick(this.id)");
    document.getElementById(impostor_pawn).src = "../images/wp.png"

    msgToSend = "reveal-"+impostor_pawn
    sendMessage(msgToSend)
    document.getElementById('askRevealPawn').style.visibility = "hidden"
}

function receiveReveal(traitor_piece){
    playSound("transition")
    document.getElementById(traitor_piece).classList.replace("piece_white", "piece_black");
    document.getElementById(traitor_piece).setAttribute("onclick", "tryMoveTo(this.classList[1])");
    switch (traitor_piece) {
        case "wr1":
        case "wr2":
            document.getElementById(traitor_piece).src = "../images/br.png"
            break

        case "wn1":
        case "wn2":
            document.getElementById(traitor_piece).src = "../images/bn.png"
        break

        case "wb1":
        case "wb2":
            document.getElementById(traitor_piece).src = "../images/bb.png"
        break
        
        case "wq":
            document.getElementById(traitor_piece).src = "../images/bq.png"
            break

        case "wp1":
        case "wp2":
        case "wp3":
        case "wp4":
        case "wp5":
        case "wp6":
        case "wp7":
        case "wp8":
            document.getElementById(impostor_piece).src = "../images/bp.png"
        break

        default:
            console.warn("Type de pièce inconnu :", traitor_piece)
    }
}
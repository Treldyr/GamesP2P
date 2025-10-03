function tryMoveTo(case_id){
    if(!white_turn){
        if(selectedPiece!== null){
            let element = document.getElementById(selectedPiece)
            let piece_case = element.classList[1];
            const pieceType = selectedPiece.slice(1, 2);  // ex: "r" pour "br1"

            if (isLegalMove(pieceType, false, piece_case, case_id)) {
                blackPieceMoveTo(selectedPiece, case_id);
                updateRandomAuto()
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
        updateRandomAuto()
    }
    if(typeMsg=="promote"){
        let pieceId = msg.split('-')[1]
        let caseId = msg.split('-')[2]
        let newId = msg.split('-')[3]
        whitePieceMoveTo(pieceId,caseId)
        updateIdPiece(pieceId, newId[0], newId[1])
        selectedPiece = null
        updateRandomAuto()
    }
    if(typeMsg=="castle"){
        let color = msg.split('-')[1]
        let isShort = msg.split('-')[2] === 'true'
        toCastle(color, isShort)
        updateRandomAuto()
    }
    if(typeMsg=="rematch"){
        getResetRequest()
    }
    if(typeMsg=="random"){
        getRandomize(msg)
        selectedPiece = null;
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
    const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

    // Pièces noires (rangée 8 avec vraies images)
    const blackPieces = ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"];
    blackPieces.forEach((type, i) => {
        const suffix = (type === "bb" && i > 4) || (type === "bn" && i > 5) || (type === "br" && i > 6) ? "2" : "1";
        const id = `${type}${suffix}`;
        const className = `piece_black ${cols[i]}8`;
        const imgFile = `${type}.png`;
        pieces.push(`<img id="${id}" src="../images/${imgFile}" class="${className}" onclick="handleClick(this.id)">`);
    });

    // Pions noirs (rangée 7)
    cols.forEach((col, i) => {
        const id = `bp${i + 1}`;
        const className = `piece_black ${col}7`;
        pieces.push(`<img id="${id}" src="../images/bp.png" class="${className}" onclick="handleClick(this.id)">`);
    });

    // Pièces blanches (rangée 1 – vraies, donc vraies images)
    const whitePieces = ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"];
    whitePieces.forEach((type, i) => {
        const suffix = (type === "wb" && i > 4) || (type === "wn" && i > 5) || (type === "wr" && i > 6) ? "2" : "1";
        const id = `${type}${suffix}`;
        const className = `piece_white ${cols[i]}1`;
        const imgFile = `${type}.png`;
        pieces.push(`<img id="${id}" src="../images/${imgFile}" class="${className}" onclick="handleClick(this.classList[1])">`);
    });

    // Pions blancs (rangée 2 avec image de pion aussi)
    cols.forEach((col, i) => {
        const id = `wp${i + 1}`;
        const className = `piece_white ${col}2`;
        pieces.push(`<img id="${id}" src="../images/wp.png" class="${className}" onclick="tryMoveTo(this.classList[1])">`);
    });

    // --- Bouton ---
    let btn = document.createElement("button");
    btn.className = "btnRandom";
    btn.setAttribute("onclick", "launchRandom()");
    btn.innerHTML = `Mélanger les pièces : <a id="nbRandom">3</a>`;
    pieces.push(btn)

    // --- Texte ---
    let p = document.createElement("p");
    p.className = "txtRandom";
    p.innerHTML = `Mélange automatique dans <a id="randomAuto">11</a> coups.`;
    pieces.push(p)

    container.innerHTML = pieces.join("\n");

    blackrandom = 3
    nextMoveRandom = 11
}

// Logique des mélanges :

var blackrandom = 3
var nextMoveRandom = 11

function launchRandom(){
    if(blackrandom>0){
        blackrandom = blackrandom -1
        generateRandom()
        document.getElementById("nbRandom").innerHTML = blackrandom
    }
}

function updateRandomAuto(){
    nextMoveRandom = nextMoveRandom-1
    if(nextMoveRandom == 0){
        nextMoveRandom = 11
    }
    document.getElementById("randomAuto").innerHTML = nextMoveRandom
}

function generateRandom() {
    function shufflePieces(colorClass) {
        let pieces = Array.from(document.querySelectorAll(colorClass));

        // Récupérer leurs positions actuelles
        let positions = pieces.map(piece => {
            return Array.from(piece.classList).find(cls => /^[a-h][1-8]$/.test(cls));
        });

        // Mélanger les positions
        for (let i = positions.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        // Réassigner + construire une table [id, nouvelleCase]
        let result = [];
        pieces.forEach((piece, i) => {
            // Supprimer ancienne position
            piece.classList.forEach(cls => {
                if (/^[a-h][1-8]$/.test(cls)) {
                    piece.classList.remove(cls);
                }
            });

            // Ajouter nouvelle position
            let newCase = positions[i];
            piece.classList.add(newCase);

            // Stocker résultat pour envoi
            result.push([piece.id, newCase]);
        });

        return result;
    }

    // Mélanger séparément les noirs et les blancs
    let blackMoves = shufflePieces(".piece_black");
    let whiteMoves = shufflePieces(".piece_white");

    // Construire le message à envoyer
    let payload = [...blackMoves, ...whiteMoves]
        .map(([id, pos]) => id + ":" + pos)
        .join("|");

    sendMessage("random-" + payload);
    selectedPiece = null;
}

function getRandomize(msg){
    let payload = msg.split("-")[1]; // ex : "bp1:a7|bp2:h6|wk:f3"
    let moves = payload.split("|");

    moves.forEach(m => {
        let [pieceId, caseId] = m.split(":");
        let piece = document.getElementById(pieceId);

        if (piece) {
            // Supprimer ancienne position
            piece.classList.forEach(cls => {
                if (/^[a-h][1-8]$/.test(cls)) {
                    piece.classList.remove(cls);
                }
            });
            // Ajouter la nouvelle
            piece.classList.add(caseId);
        }
    });
}
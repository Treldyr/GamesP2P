let peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  let dataChannel = peer.createDataChannel("game");

  dataChannel.onopen = () => {
    console.log("Connexion P2P établie !");
    goChessBoard()
  };

  dataChannel.onmessage = e => {
    treatNewMessage(e.data)
    //console.log("Message reçu :", e.data);
    //alert("Message reçu : " + e.data);
  };

  peer.onicecandidate = e => {
    if (peer.iceGatheringState === "complete" || !e.candidate) {
      document.getElementById("output").value = JSON.stringify(peer.localDescription);
    }
  };

  peer.createOffer().then(desc => {
    return peer.setLocalDescription(desc);
  }).then(() => {
    // On attend que le SDP soit prêt (sinon output est vide)
    // ICE gathering peut prendre un peu de temps.
  }).catch(console.error);

  function handleSignal() {
    const signal = JSON.parse(document.getElementById("signal").value);
  
    // On vérifie que c'est bien une ANSWER (puisqu'on est l'hôte)
    if (signal.type === "answer") {
      if (peer.signalingState !== "stable") {
        peer.setRemoteDescription(signal).catch(console.error);
      } else {
        console.warn("Déjà dans l'état stable, refus de définir une nouvelle remote description.");
      }
    } else {
      console.warn("Ce peer (hôte) n'attend qu'une 'answer', pas :", signal.type);
    }
  }

  function sendMessage(msg) {
    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(msg);
    } else {
      alert("Connexion P2P non établie");
    }
  }

  function copyToClipboard() {
    const output = document.getElementById("output");
    output.select();
    output.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copié dans le presse-papiers");
  }

  function goChessBoard(){
    document.getElementById('peerConnexionJoin').style.visibility = "hidden"
    document.getElementById('chess_content').style.visibility = "visible"
    var audio = new Audio('../Sounds/intro.mp3');
    audio.play();
  }
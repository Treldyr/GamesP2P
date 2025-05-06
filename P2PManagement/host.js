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
  if (!e.candidate) {
    document.getElementById("output").value = JSON.stringify(peer.localDescription);
  }
};

peer.createOffer().then(desc => peer.setLocalDescription(desc));

function handleSignal() {
  const signal = JSON.parse(document.getElementById("signal").value);
  peer.setRemoteDescription(signal);
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


function resetConnection() {
  if (peer) {
    try {
      if (dataChannel) {
        dataChannel.close();
        dataChannel = null;
      }
      peer.close();
    } catch (e) {
      console.error("Erreur lors de la fermeture :", e);
    }
  }

  // Réinitialiser la connexion
  peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  dataChannel = peer.createDataChannel("game");

  dataChannel.onopen = () => {
    console.log("Connexion P2P établie !");
    goChessBoard();
  };

  dataChannel.onmessage = e => {
    treatNewMessage(e.data);
  };

  peer.onicecandidate = e => {
    if (!e.candidate) {
      document.getElementById("output").value = JSON.stringify(peer.localDescription);
    }
  };

  peer.createOffer()
    .then(desc => peer.setLocalDescription(desc))
    .catch(console.error);
}
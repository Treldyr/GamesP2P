let peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  let dataChannel;

  peer.ondatachannel = event => {
    dataChannel = event.channel;
    dataChannel.onopen = () => {
      console.log("Connexion P2P établie !");
      goChessBoard()
    };
    dataChannel.onmessage = e => {
      treatNewMessage(e.data)
      //console.log("Message reçu :", e.data);
      //alert("Message reçu : " + e.data);
    };
  };

  peer.onicecandidate = e => {
    if (peer.iceGatheringState === "complete" || !e.candidate) {
      document.getElementById("output").value = JSON.stringify(peer.localDescription);
    }
  };

  function handleSignal() {
    const signal = JSON.parse(document.getElementById("signal").value);
    peer.setRemoteDescription(signal).then(() => {
      return peer.createAnswer();
    }).then(answer => {
      return peer.setLocalDescription(answer);
    }).catch(console.error);
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
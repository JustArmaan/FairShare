(function() {
  const socket = new WebSocket('ws://localhost:3000/live-reload');
  socket.onmessage = function(msg) {
    if (msg.data === 'live-reload') {
      location.reload();
    }
  };
  console.log('Live reload enabled, assuming port is on 3000 for dev');
})();

class DeepstreamDemo {
  constructor(client) {
    this.client = client;
    this.usersOnlineElements = document.querySelectorAll('.users-online');
    this.usersListElement = document.querySelector('#users-online-list');
    this.usersOnline = [];
    this.smoothieLine = null;
    this._startUserCounterWatcher();
    this._startDeviceOrientationWatcher();
    this._speechWatcher();
    this._webAudioWatcher();
  }

  _startUserCounterWatcher() {
    this.client.presence.getAll((users) => {
      this.usersOnline = users;
      this._updateUsersOnline();
    });
    this.client.presence.subscribe((username, login) => {
      if (login) {
        this.usersOnline.push(username);
      } else {
        const index = this.usersOnline.indexOf(username);
        if (index !== -1) {
          this.usersOnline.splice(index, 1)
        }
      }
      this._updateUsersOnline();
    })
  }

  _updateUsersOnline() {
    const onlineCount = this.usersOnline.length;
    for (var d of this.usersOnlineElements) {
      d.textContent = onlineCount; // remove speaker from the count
    }

    this.usersListElement.innerHTML = '';
    for (let user of this.usersOnline) {
      if (user == null || user === '') {
        continue;
      }
      const li = document.createElement('li');
      li.onclick = () => {
        client.event.emit(`command/laugh/${user}`);
      }
      li.textContent = user.substr(0, 40);
      this.usersListElement.appendChild(li);
    }
  }

  _speechWatcher() {
    const textInput = document.querySelector('#speech-text');
    const rateInput = document.querySelector('#speech-rate');
    const pitchInput = document.querySelector('#speech-pitch');
    document.querySelector('#start-speak').onclick = () => {
      client.event.emit(`command/speak`, {text: textInput.value, rate: rateInput.value, pitch: pitchInput.value});
    }
  }

  _webAudioWatcher() {
    document.querySelector('#start-web-audio').onclick = () => {
      client.event.emit(`command/webAudio`);
    }
  }

  _startDeviceOrientationWatcher() {
    Reveal.addEventListener('slidechanged', function( event ) {
      if (event.currentSlide.id === 'slide-deviceorientation') {
        this.client.emit('command/startDeviceOrientation');
      } else {

      }
    });
  }

}

const client = deepstream('localhost:6020').login({username: 'speaker', password: '6936522507f99568facc7e52d1aa3955abc0febd'}, (success, data) => {
  console.log('success', success, data);
  
  if (!success) {
    alert("deepstream error!");
  }

  const d = new DeepstreamDemo(client);
});

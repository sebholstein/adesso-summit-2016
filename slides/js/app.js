class DeepstreamDemo {
  constructor(client) {
    this.client = client;
    this.usersOnlineElements = document.querySelectorAll('.users-online');
    this.usersListElement = document.querySelector('#users-online-list');
    this.usersOnline = [];
    this.smoothieLine = null;
    this.stats = {
      serviceWorker: 0,
      vibrate: 0,
      deviceOrientation: 0,
      speechSynthesis: 0,
      webAudio: 0
    };
    this.usersCollectedStats = new Map();
    this._startUserCounterWatcher();
    this._startDeviceOrientationWatcher();
    this._speechWatcher();
    this._webAudioWatcher();
    this._voteWatcher();
  }

  _startUserCounterWatcher() {
    this.client.presence.getAll((users) => {
      this.usersOnline = users;
      this._updateUsersOnline();
      this._updateSupportStats();
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
      this._updateSupportStats();
    })
  }

  _voteWatcher() {
    let showButton = false;
    document.querySelector('#toggle-vote-button').addEventListener('click', () => {
      showButton = !showButton;
      this.client.record.getRecord('showVoteButton').whenReady(r => {
        r.set({showButton: showButton});
      })
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

  _processUserStats(user, browserDetails) {
    if (!browserDetails) {
      return;
    }
    console.log(user, browserDetails);
    this.stats.serviceWorker += browserDetails.serviceWorker === true ? 1 : 0;
    this.stats.vibrate += browserDetails.vibrate === true ? 1 : 0;
    this.stats.deviceOrientation += browserDetails.deviceOrientation === true ? 1 : 0;
    this.stats.speechSynthesis += browserDetails.speechSynthesis === true ? 1 : 0;
    this.stats.webAudio += browserDetails.webAudio === true ? 1 : 0;
    this.usersCollectedStats.set(user, browserDetails);
  }

  _renderSupportStats() {
    let counters = document.querySelectorAll('.support-counter');
    if (counters.length === 0) {
      return;
    }
    for (let counter of counters) {
      if (!counter.dataset.feature) {
        continue;
      }
      let percent = 0;
      let textContent = this.stats[counter.dataset.feature] + ' von ' + this.usersOnline.length;
      if (this.usersOnline.length > 0) {
        percent = Math.round((this.stats[counter.dataset.feature] / this.usersOnline.length) * 100);
        textContent += ' (' + percent + '%)';
      }
      counter.textContent =  textContent;
    };
  }

  _updateSupportStats() {
    if (Array.isArray(this.usersOnline)) {
      this.stats = {
        serviceWorker: 0,
        vibrate: 0,
        deviceOrientation: 0,
        speechSynthesis: 0,
        webAudio: 0
      };
      let usersToProcessLeft = this.usersOnline.length;
      if (usersToProcessLeft === 0) {
        this._renderSupportStats();
      }

      this.usersOnline.forEach((user) => {
        if (this.usersCollectedStats.has(user)) {
          let s = this.usersCollectedStats.get(user);
          this._processUserStats(user, s);
          usersToProcessLeft -= 1;
          if (usersToProcessLeft < 1) {
            this._renderSupportStats();
          }
        } else {
          this.client.record.getRecord('browserDetails/' + user).whenReady(record => {
            this._processUserStats(user, record.get());
            usersToProcessLeft -= 1;
            if (usersToProcessLeft < 1) {
              this._renderSupportStats();
            }
          })
        }
      })
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
    const container = document.querySelector('#device-orientation-entries');
    let subs = new Map();
    let listChanged = (entries) => {
      for (var i = 0; i < entries.length; i++) {
        if (subs.has(entries[i])) {
          continue;
        }
        
        let elem = document.createElement('div');
        elem.style = 'background: red; height: 45px; margin-right: 10px; float: left; max-width: 150px; font-size: 22px;overflow:hidden'
        elem.textContent = entries[i].split('/')[1];
        container.appendChild(elem);
        const sub = (e) => {

          elem.style.webkitTransform = "rotate("+ e.gamma +"deg) rotate3d(1,0,0, "+ (e.beta*-1+90)+"deg)";
        }
        client.record.getRecord(entries[i]).subscribe(null, sub);
        subs.set(entries[i], sub);
      }
    }
    var currentSlideIsDo = false;
    Reveal.addEventListener('slidechanged', (event) => {
      if (event.currentSlide.id === 'slide-deviceorientation') {
        currentSlideIsDo = true;
        client.record.getList('deviceOrientations').whenReady((list) => {
          list.subscribe(listChanged, true);
        });
        client.event.emit('command/startDeviceOrientation');
      } else if (currentSlideIsDo) {
        client.event.emit('command/stopDeviceOrientation');
        currentSlideIsDo = false;
        client.record.getList('deviceOrientations').whenReady((list) => {
          list.delete();
        });
      }
    });
  }

}

// prod: wss://pwa.sebastian-mueller.net:6020
// dev: localhost:6020
const client = deepstream('wss://pwa.sebastian-mueller.net:6020').login({username: 'speaker', password: '6936522507f99568facc7e52d1aa3955abc0febd'}, (success, data) => {
  console.log('success', success, data);
  
  if (!success) {
    alert("deepstream error!");
  }

  const d = new DeepstreamDemo(client);
});

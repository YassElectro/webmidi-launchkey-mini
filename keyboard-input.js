// Generates pseudo-MIDI messages from the computer's keyboard.

function initKeyboardInput() {

  function listenToKeyboardMessages(handler) {

    function emit(message) {
      setTimeout(handler.bind(null, message), 0);
    }

    let octaveOffset = 0;

    const padNotes = {
      q: 36,
      w: 37,
      e: 38,
      r: 39,
      t: 44,
      y: 45,
      u: 46,
      i: 47,
    };

    const keyNotes = {
      // white keys + black keys
      z: 48, s: 49,
      x: 50, d: 51,
      c: 52,
      v: 53, g: 54,
      b: 55, h: 56,
      n: 57, j: 58,
      m: 59,
      ',': 60, 'l': 61,
      '.': 62, ';': 63,
      '/': 64,
    };

    const keyCommands = {
      '[': 106, // trackPrev
      ']': 107, // trackNext
    };

    const incrementOctave = (incr) => octaveOffset += incr;

    const otherKeys = {
      '+': () => incrementOctave(+1),
      '-': () => incrementOctave(-1),
      '=': () => incrementOctave(+1), // to prevent having to press shift on american keyboard
    };

    function getPadNote(key) {
      return padNotes[key]
    }

    function getKeyNote(key) {
      return keyNotes[key] + octaveOffset * 12;
    }

    function getKeyCommand(key) {
      return keyCommands[key];
    }

    function handleKeyboardEvent(e) {
      const keyUp = e.type === 'keyup';
      const padNote = getPadNote(e.key);
      const commandNote = getKeyCommand(e.key);
      const note = getKeyNote(e.key) || padNote || commandNote;
      if (note) {
        emit({
          channel: padNote ? 10 : 1,
          command: commandNote ? 11 : (keyUp ? 8 : 9),
          note,
          velocity: keyUp ? 0 : 64,
        });
      }
    }

    function handleKeyboardCommand(e) {
      const otherKeyFct = otherKeys[e.key];
      if (otherKeyFct) {
        otherKeyFct();
      }
    }

    window.addEventListener('keydown', e => !e.repeat && handleKeyboardEvent(e));
    window.addEventListener('keyup', handleKeyboardEvent);
    window.addEventListener('keypress', handleKeyboardCommand);
  }

  return {
    onKeyEvents: listenToKeyboardMessages,
  };

}

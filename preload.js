const { contextBridge } = require("electron");
const fs = require("fs-extra");

// TODO - Add option for custom save directory
const defaultSaveDirectory = process.env.APPDATA + "\\EldenRing";

let saves = [];

function updateSaves() {
  fs.readdir(defaultSaveDirectory, function (err, filesPath) {
    if (err) throw err;
    saves = filesPath
      .filter(function (file) {
        if (!isSave(file)) return false;
        return true;
      })
      .map(function (filePath) {
        return filePath;
      });
    initializeMemoryCards();
  });
}

updateSaves();

function initializeMemoryCards() {
  updateSaves();
  if (getMemoryCards(saves).length === 0) {
    let workingDir = defaultSaveDirectory + "\\";
    let defaultSave = workingDir + saves[0];
    let saveBackup = defaultSave + "_original";
    fs.copy(defaultSave, saveBackup).then(() => {
      addMemoryCard();
    });
  }
}

function addMemoryCard() {
  let workingDir = defaultSaveDirectory + "\\";
  let defaultSave = workingDir + saves[0];
  let newMemoryCard = defaultSave + "#" + saves.length;
  console.log("Makind a new memory card...");
  fs.copy(defaultSave, newMemoryCard).then(() => {
    console.log(
      "If there's less than 2 memory cards in saves[]: " + saves.toString()
    );
    if (getMemoryCards(saves).length < 1) {
      newMemoryCard = defaultSave + "#" + saves.length;
      console.log("...then create a new memory card " + newMemoryCard + "...");
      fs.copy(defaultSave, newMemoryCard).then(() => {
        updateSaves();
        window.location.reload();
      });
    } else {
      console.log("...or else reload the window.");
      window.location.reload();
    }
  });
}

function isSave(str) {
  return /^[0-9#]+$/.test(str);
}

function getMemoryCards(saves) {
  return saves.slice(1);
}

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("data", {
  activeSaveDirectory: () => JSON.stringify(saves[0]),
  memoryCards: () => JSON.stringify(getMemoryCards(saves)),
});

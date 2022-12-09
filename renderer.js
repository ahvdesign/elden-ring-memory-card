document.getElementById("info").innerText = `
    Chrome: ${versions.chrome()} 
    Node.js: ${versions.node()}
    Electron: ${versions.electron()}
    Active Save: ${data.activeSaveDirectory()}
    Memory Cards: ${data.memoryCards()}
`;

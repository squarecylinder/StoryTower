const os = require('os');

module.exports = {
    executablePath: os.platform() === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
}
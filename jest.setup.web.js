const util = require('util');

window.crypto = require('@trust/webcrypto');
window.crypto.subtle = require('@trust/webcrypto').subtle;
window.TextEncoder = util.TextEncoder;
window.TextDecoder = util.TextDecoder;
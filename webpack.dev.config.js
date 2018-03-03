const path = require('path');

module.exports = {
    mode: 'development',
    entry: [
        "./assets/scripts/src/sholo.js"
    ],
    output: {
        publicPath: '/assets/scripts/dist/',
        path: path.join(__dirname, 'dist'),
        filename: 'sholo.min.js',
        libraryTarget: "umd",
        library: "Sholo"
    }
};
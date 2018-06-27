const path = require('path');
module.exports = {
	mode:"none",
    entry: './src/index',
    output: { 
        path: path.resolve(__dirname, "dist"),  
        filename: "naviboard.js",
        library: "naviBoard",  
        libraryTarget: "umd", 
    },
    // devtool: "source-map",
    module: {
        rules: [{
            loader: "babel-loader"
        }]
    }
}
 
const path = require('path');

const config = {
    devServer: {
        inline: false,
        contentBase: './public'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

const newJsFile = (entry = "index.js", output = "main/bundle.js", pathJs = "public/js/") => {
    return Object.assign({}, config, {
        entry: ['babel-polyfill', `./src-webpack/${entry}`],
        output: {
           path: path.resolve(__dirname, pathJs),
           filename: output
        },
    });
}

const bundleJs = newJsFile();
const miniScript = newJsFile("/all-scripts/cardLive.js", "main/cardLive.js");
const chartBarScript = newJsFile("/all-scripts/chart.js", "main/chart.js");


module.exports = [bundleJs, miniScript, chartBarScript];




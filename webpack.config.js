'use strict';

var path = require('path');
var webpack = require('sgmf-scripts').webpack;
var ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin'];

const shell = require('shelljs');
const cwd = process.cwd();

var bootstrapPackages = {
    Alert: 'exports-loader?Alert!bootstrap/js/src/alert',
    // Button: 'exports-loader?Button!bootstrap/js/src/button',
    Carousel: 'exports-loader?Carousel!bootstrap/js/src/carousel',
    Collapse: 'exports-loader?Collapse!bootstrap/js/src/collapse',
    // Dropdown: 'exports-loader?Dropdown!bootstrap/js/src/dropdown',
    Modal: 'exports-loader?Modal!bootstrap/js/src/modal',
    // Popover: 'exports-loader?Popover!bootstrap/js/src/popover',
    Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/src/scrollspy',
    Tab: 'exports-loader?Tab!bootstrap/js/src/tab',
    // Tooltip: 'exports-loader?Tooltip!bootstrap/js/src/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/src/util'
};
function createJSFilePaths(catridgeName) {
	const result = {};
    let jsFiles = shell.ls(path.join(cwd, `./cartridges/${catridgeName}/cartridge/client/**/js/*.js`));
    jsFiles.forEach(filePath => {
        let location = path.relative(path.join(cwd, `./cartridges/${catridgeName}/cartridge/client`), filePath);
        location = location.substr(0, location.length - 3);
        result[location] = filePath;
    });
    return result;
}
function createScssPath(catridgeName)  {
    const result = {};
    const cssFiles = shell.ls(path.join(cwd, `./cartridges/${catridgeName}/cartridge/client/**/scss/**/*.scss`));
    cssFiles.forEach(filePath => {
        const name = path.basename(filePath, '.scss');
        if (name.indexOf('_') !== 0) {
            let location = path.relative(path.join(cwd, `./cartridges/${catridgeName}/cartridge/client`), filePath);
            location = location.substr(0, location.length - 5).replace('scss', 'css');
            result[location] = filePath;
        }
    });

    return result;
}

function createJSConfig(catridgeName) {
    const jsFiles = createJSFilePaths(catridgeName);
	return {
        mode: 'production',
        name: 'js',
        entry: jsFiles,
        output: {
            path: path.resolve(`./cartridges/${catridgeName}/cartridge/static`),
            filename: '[name].js'
        },
        resolve: {
			alias: {
				base: path.resolve(__dirname, 'cartridges/app_storefront_base/cartridge/client/default/js'),
				wishlist: path.resolve(__dirname, 'cartridges/plugin_wishlists/cartridge/client/default/js')
			}
		},
        module: {
            rules: [
                {
                    test: /bootstrap(.)*\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/env'],
                            plugins: ['@babel/plugin-proposal-object-rest-spread'],
                            cacheDirectory: true
                        }
                    }
                }
            ]
        },
        plugins: [new webpack.ProvidePlugin(bootstrapPackages)]
    }
}

function createSCSSConfig(catridgeName) {
    const scssFiles = createScssPath(catridgeName);
	return {
        mode: 'none',
        name: 'scss',
        entry: scssFiles,
        output: {
            path: path.resolve(`./cartridges/${catridgeName}/cartridge/static`),
            filename: '[name].css'
        },
		resolve: {
			alias: {
				base: path.resolve(__dirname, 'cartridges/app_storefront_base/cartridge/client/default/scss'),
				wishlist: path.resolve(__dirname, 'cartridges/plugin_wishlists/cartridge/client/default/scss')
			}
		},
        module: {
            rules: [{
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            url: false,
                            minimize: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')()
                            ]
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                path.resolve('node_modules'),
                                path.resolve('node_modules/flag-icon-css/sass')
                            ]
                        }
                    }]
                })
            }]
        },
        plugins: [
            new ExtractTextPlugin({ filename: '[name].css' })
        ]
    }
}

function createCompileConfig() {
  const cwd = process.cwd();
	const path = require('path');
	const packageJson = require(path.join(cwd, './package.json'));

    const jsConfig = packageJson.cartridges.map(createJSConfig).filter(item => Object.keys(item.entry).length > 0);
    const scssConfig  = packageJson.cartridges.map(createSCSSConfig).filter(item => Object.keys(item.entry).length > 0);

    return [...jsConfig, ...scssConfig]
}

module.exports = createCompileConfig();
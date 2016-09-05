var path = require('path') 

module.exports = {
	entry: './main.js',
	output:{
		path: './', 
		filename: 'index.js'
	}, 
	devServer: {
		inline: true,
		port: 3333
	}, 
	resolve: {
		root:[
			path.resolve('./components'), 
			path.resolve('./utils')
		]
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				exlude: /node_modules/, 
				loader: 'babel', 
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	}
}
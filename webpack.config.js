var path = require('path') 

module.exports = {
	entry: './main.js',
	output:{
		filename: 'index.js'
	}, 
	devServer: {
		inline: true,
		port: 3333
	}, 
	resolve: {
		root:[
			path.resolve(__dirname  + '/components'), 
			path.resolve(__dirname + '/Models'), 
			path.resolve(__dirname + '/images'), 
			path.resolve(__dirname + '/node_modules')
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
			}, 
			{
		      test: /\.(png|jpg|)$/,
		      loader: 'url-loader?limit=200000'
		    }
		]
	}
}
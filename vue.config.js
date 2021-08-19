module.exports = {
	chainWebpack: config => {
		config.plugin( 'html' ).tap( args => {
			args[ 0 ].title = 'Fleximple Webshot'
			return args
		} )
	},
	outputDir: '../public',
	devServer: {
		proxy: {
			'^/api': {
				target: 'http://localhost:3080',
				changeOrigin: true,
			},
		},
	},
}
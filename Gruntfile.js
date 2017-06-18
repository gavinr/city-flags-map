/* global module:false */
module.exports = function(grunt) {
	// Project configuration
	grunt.initConfig({
		'copy': {
			main: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: [
						'**'
					],
					dest: 'dist/',
					flatten: false
				}]
			}
		},

		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		},

		'json_array_sort': {
			dev: {
				src: 'src/city-flags.js',
				dest: 'src/city-flags.js',
				sortKeys: ['country', 'city'],
			}
		},
		connect: {
			server: {
				options: {
					port: 9001,
					keepalive: true,
					base: {
						path: 'dist',
						options: {
							index: 'index.htm',
							maxAge: 300000
						}
					}
				}
			}
		}
	});

	// Dependencies
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-json-array-sort');
	grunt.loadNpmTasks('grunt-contrib-connect');


	// Default task
	grunt.registerTask('default', ['copy']);
	grunt.registerTask('sort', ['json_array_sort:dev']);
	grunt.registerTask('deploy', ['default', 'gh-pages']);
	grunt.registerTask('serve', ['copy', 'connect']);

};
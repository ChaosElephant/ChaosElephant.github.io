module.exports = function(grunt) {
 	 	
    grunt.initConfig({
 		
 		devUpdate: {
			main: {
				options: {
					//task options go here 
					updateType: 'prompt',//'report', //just report outdated packages 
					reportUpdated: false, //don't report up-to-date packages 
					semver: false,//true, //stay within semver when updating 
					packages: {
						devDependencies: true, //only check for devDependencies 
						dependencies: false
					},
					packageJson: null, //use matchdep default findup to locate package.json 
					reportOnlyPkgs: [] //use updateType action on all packages 
				}
			}
		},
		
        //our JSHint options
        jshint: {
            //all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
            all: ['Gruntfile.js','./javascripts/dev/*.js'] //files to lint
        },
 
        //our concat options
        concat: {
            options: {
                separator: ';' //separates scripts
            },
            dist: {
                src: ['./javascripts/dev/*.js'], //Using mini match for your scripts to concatenate 
                dest: './javascripts/script.js' //where to output the script
            }
        },
 
        //our uglify options
        uglify: {
            my_target: {
				options: {
					mangle: {
						except: ['$','jQuery']
					},
					sourceMap: true,
					//sourceMapName: 'path/to/sourcemap.map',
					mangleProperties: false,
					preserveComments: false,
					reserveDOMCache: true,
					reserveDOMProperties: true,
					//exceptionsFiles: [ 'myExceptionsFile.json' ],
					banner: //'/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					"/** \r" +
					" * \r" +
					" * last update: <%= grunt.template.today('yyyy-mm-dd') %>\r" + 
					" */"
				},
				files: {
					//'dest/output.min.js': ['src/input1.js', 'src/input2.js']
					'./javascripts/script.js': ['./javascripts/script.js'] //save over the newly created script 
				}
			}
        },
        
        sass: {
			dist: {
				options: {
					style: 'compressed' //'expanded'
				},
				files: {
					'./stylesheets/btcforks.css': './scss/site.scss'
				}
			} 
		},
        
		// postcss/autoprefixer
        postcss: {
			options: {
				map: {
					inline: false, // save all sourcemaps as separate files...
					annotation: 'stylesheets/'//'dist/css/maps/' // ...to the specified directory 
				},
				processors: [
					require('pixrem')(), // add fallbacks for rem units 
					require('autoprefixer')({browsers: 'last 6 versions'}), // add vendor prefixes 
					require('cssnano')({zindex: false}) // minify the result 
				]
			},
			dist: {
				src: "./stylesheets/*.css"
			}
		},
		
        watch: {
			//options: {
			//	livereload: true,
			//},
			scripts: {
				files: ['./javascripts/dev/*.js'],
				tasks: ['jshint','concat', 'uglify'],
				options: {
					spawn: false,
				}
			},
			css: {
				files: ['./scss/*.scss','./scss/base/*.scss'],
				tasks: ['sass','postcss'],
				options: {
					spawn: false,
				}
			}
		},
        
		//browser_sync: {
		browserSync: {

			files: [
				"./stylesheets/*.css", 
				"./javascripts/*.js"
			],
			options: {
				//server: {
				//	baseDir: "./"
				//},
				//proxy: "node",
				//reloadDelay: 2000,
				open: false,
				watchTask: true, // <- watch
				injectChanges: true,
				ghostMode: {
					clicks: false,
					location: true,
					forms: false,
					scroll: true
				}
			}
		}
 
    });
 
    //load our tasks
    require('load-grunt-tasks')(grunt);
    
    // register
	//grunt.registerTask('dev', ['devUpdate','browserSync','watch']);
	grunt.registerTask('dev', ['browserSync','watch']);
	
};
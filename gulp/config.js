var path = require('path');

var src = './src';
var dest = './build';
var docs = './docs';

var relativeSrcPath = path.relative('.', src);

module.exports = {
  dest: dest,

  js: {
    src: src + '/js/**',
    dest: dest + '/js',
    uglify: false
  },

  esdoc: {
    destination: docs
  },

  eslint: {
    src: [
      src + '/js/**',
      './test/**/*.js',
      '!' + src + '/js/third_party/*.js',
      '!' + src + '/js/etc/*.js'
    ],
    opts: {
      useEslintrc: true
    }
  },

  webpack: {
    entry: src + '/js/main.js',
    output: {
      filename: 'dh3d.js',
      library: 'dh3d',
      libraryTarget: 'var'
    },
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  },

  mocha: {
    src: ['test/**/*.js', 'src/**/*.js'],
    opts: {
      ui: 'bdd',
      reporter: 'nyan',
      globals: [],
      require: ['chai']
    }
  },

  copy: {
    src: [
    ],
    dest: dest
  },

  watch: {
    js: relativeSrcPath + '/js/**'
  }
}


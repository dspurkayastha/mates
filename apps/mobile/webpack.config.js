/**
 * Webpack Configuration for Web Bundle Optimization
 * Advanced configuration for optimal web bundle performance
 * Includes code splitting, tree shaking, and asset optimization
 */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // ========================================================================
  // OPTIMIZATION SETTINGS
  // ========================================================================
  
  config.optimization = {
    ...config.optimization,
    
    // Enhanced code splitting
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        // Vendor chunk for third-party libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        
        // React/React Native chunk
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-native|react-native-web)[\\/]/,
          name: 'react',
          priority: 20,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        
        // UI components chunk
        uiComponents: {
          test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
          name: 'ui-components',
          priority: 15,
          reuseExistingChunk: true,
          chunks: 'all',
          minSize: 0,
        },
        
        // Design system chunk
        designSystem: {
          test: /[\\/]src[\\/]design-system[\\/]/,
          name: 'design-system',
          priority: 18,
          reuseExistingChunk: true,
          chunks: 'all',
          minSize: 0,
        },
        
        // Utilities chunk
        utils: {
          test: /[\\/]src[\\/]utils[\\/]/,
          name: 'utils',
          priority: 12,
          reuseExistingChunk: true,
          chunks: 'all',
          minSize: 10000,
        },
        
        // Animation libraries
        animations: {
          test: /[\\/]node_modules[\\/](react-native-reanimated|lottie|@shopify[\\/]react-native-skia)[\\/]/,
          name: 'animations',
          priority: 16,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        
        // Chart libraries
        charts: {
          test: /[\\/]node_modules[\\/](react-native-graph|react-native-svg|d3)[\\/]/,
          name: 'charts',
          priority: 14,
          reuseExistingChunk: true,
          chunks: 'all',
        },
        
        // Common chunks for frequently used modules
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          chunks: 'all',
        },
      },
    },
    
    // Runtime chunk optimization
    runtimeChunk: {
      name: 'runtime',
    },
    
    // Tree shaking and dead code elimination
    usedExports: true,
    sideEffects: false,
    
    // Minimize in production
    minimize: env.mode === 'production',
    minimizer: [
      // Terser for JavaScript optimization
      new (require('terser-webpack-plugin'))({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: env.mode === 'production',
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        extractComments: false,
      }),
      
      // CSS optimization
      new (require('css-minimizer-webpack-plugin'))({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              colormin: true,
              convertValues: true,
              discardDuplicates: true,
              discardEmpty: true,
              mergeRules: true,
              minifyFontValues: true,
              minifyGradients: true,
              minifyParams: true,
              minifySelectors: true,
            },
          ],
        },
      }),
    ],
  };
  
  // ========================================================================
  // PERFORMANCE SETTINGS
  // ========================================================================
  
  config.performance = {
    hints: env.mode === 'production' ? 'warning' : false,
    maxAssetSize: 500000, // 500kb per asset
    maxEntrypointSize: 800000, // 800kb for entry point
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    },
  };
  
  // ========================================================================
  // MODULE RULES OPTIMIZATION
  // ========================================================================
  
  // Add custom loaders for better optimization
  config.module.rules.push(
    // Optimize images
    {
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8192, // 8kb - inline smaller images
        },
      },
      generator: {
        filename: 'static/media/[name].[contenthash:8][ext]',
      },
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 80,
            },
            optipng: {
              enabled: env.mode === 'production',
            },
            pngquant: {
              quality: [0.6, 0.8],
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 80,
            },
          },
        },
      ],
    },
    
    // Optimize SVGs
    {
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'removeDimensions',
                  active: true,
                },
                {
                  name: 'cleanupIDs',
                  active: true,
                },
              ],
            },
          },
        },
        'url-loader',
      ],
    }
  );
  
  // ========================================================================
  // PLUGINS OPTIMIZATION
  // ========================================================================
  
  // Add performance and optimization plugins
  config.plugins.push(
    // Bundle analyzer for development
    ...(env.mode === 'development' ? [
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'server',
        analyzerHost: 'localhost',
        analyzerPort: 8888,
        openAnalyzer: false,
      }),
    ] : []),
    
    // Compression plugin for production
    ...(env.mode === 'production' ? [
      new (require('compression-webpack-plugin'))({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
      }),
      
      // Brotli compression for better compression
      new (require('compression-webpack-plugin'))({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        threshold: 8192,
        minRatio: 0.8,
      }),
    ] : []),
    
    // Preload/prefetch optimization
    new (require('@vue/preload-webpack-plugin'))({
      rel: 'prefetch',
      include: 'asyncChunks',
    }),
  );
  
  // ========================================================================
  // RESOLVE OPTIMIZATION
  // ========================================================================
  
  config.resolve = {
    ...config.resolve,
    
    // Module resolution optimization
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    
    // Alias for better tree shaking
    alias: {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@design-system': path.resolve(__dirname, 'src/design-system'),
      
      // Optimize React Native Web
      'react-native$': 'react-native-web',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    },
    
    // Optimize extension resolution
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
    
    // Symlink optimization
    symlinks: false,
  };
  
  // ========================================================================
  // CACHE OPTIMIZATION
  // ========================================================================
  
  config.cache = {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    buildDependencies: {
      config: [__filename],
      tsconfig: [path.resolve(__dirname, 'tsconfig.json')],
    },
    name: `${env.mode}-${process.env.EXPO_PUBLIC_PLATFORM || 'web'}`,
  };
  
  // ========================================================================
  // DEVELOPMENT OPTIMIZATIONS
  // ========================================================================
  
  if (env.mode === 'development') {
    // Fast refresh and HMR optimization
    config.optimization.removeAvailableModules = false;
    config.optimization.removeEmptyChunks = false;
    config.optimization.splitChunks = false;
    
    // Source map optimization for debugging
    config.devtool = 'eval-cheap-module-source-map';
    
    // Development server optimization
    config.devServer = {
      ...config.devServer,
      compress: true,
      hot: true,
      liveReload: false, // Use HMR instead
      static: {
        directory: path.resolve(__dirname, 'web'),
        publicPath: '/',
      },
    };
  }
  
  // ========================================================================
  // PRODUCTION OPTIMIZATIONS
  // ========================================================================
  
  if (env.mode === 'production') {
    // Source map for production debugging
    config.devtool = 'source-map';
    
    // Output optimization
    config.output = {
      ...config.output,
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'static/media/[name].[contenthash:8][ext]',
      
      // Optimize for better caching
      clean: true,
      pathinfo: false,
    };
  }
  
  return config;
};
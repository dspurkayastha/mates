/* eslint-env node */
/**
 * Metro Configuration for Bundle Optimization
 * Enhanced configuration for better performance and smaller bundle sizes
 * Includes tree-shaking, compression, and asset optimization
 * Merged with original polyfills and error reporting functionality
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');
const fs = require('node:fs');
const { FileStore } = require('metro-cache');
const { reportErrorToRemote } = require('./__create/report-error-to-remote');
const {
  handleResolveRequestError,
  VIRTUAL_ROOT,
  VIRTUAL_ROOT_UNRESOLVED,
} = require('./__create/handle-resolve-request-error');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ============================================================================
// ORIGINAL POLYFILLS AND ALIASES (PRESERVED)
// ============================================================================

const WEB_ALIASES = {
  'expo-secure-store': path.resolve(__dirname, './polyfills/web/secureStore.web.ts'),
  'react-native-webview': path.resolve(__dirname, './polyfills/web/webview.web.tsx'),
  'react-native-safe-area-context': path.resolve(
    __dirname,
    './polyfills/web/safeAreaContext.web.jsx'
  ),
  'react-native-maps': path.resolve(__dirname, './polyfills/web/maps.web.jsx'),
  'react-native-web/dist/exports/SafeAreaView': path.resolve(
    __dirname,
    './polyfills/web/SafeAreaView.web.jsx'
  ),
  'react-native-web/dist/exports/Alert': path.resolve(__dirname, './polyfills/web/alerts.web.tsx'),
  'react-native-web/dist/exports/RefreshControl': path.resolve(
    __dirname,
    './polyfills/web/refreshControl.web.tsx'
  ),
  'expo-status-bar': path.resolve(__dirname, './polyfills/web/statusBar.web.jsx'),
  'expo-location': path.resolve(__dirname, './polyfills/web/location.web.ts'),
  './layouts/Tabs': path.resolve(__dirname, './polyfills/web/tabbar.web.jsx'),
  'expo-notifications': path.resolve(__dirname, './polyfills/web/notifications.web.tsx'),
  'expo-contacts': path.resolve(__dirname, './polyfills/web/contacts.web.ts'),
  'react-native-web/dist/exports/ScrollView': path.resolve(
    __dirname,
    './polyfills/web/scrollview.web.jsx'
  ),
  '@gorhom/bottom-sheet': path.resolve(__dirname, './polyfills/web/bottomSheet.web.tsx'),
};

const NATIVE_ALIASES = {
  './Libraries/Components/TextInput/TextInput': path.resolve(
    __dirname,
    './polyfills/native/texinput.native.jsx'
  ),
};

const SHARED_ALIASES = {
  'expo-image': path.resolve(__dirname, './polyfills/shared/expo-image.tsx'),
};

// Setup virtual folders
fs.mkdirSync(VIRTUAL_ROOT_UNRESOLVED, { recursive: true });
config.watchFolders = [...config.watchFolders, VIRTUAL_ROOT, VIRTUAL_ROOT_UNRESOLVED];

// ============================================================================
// BUNDLE OPTIMIZATION SETTINGS (ENHANCED)
// ============================================================================

// Optimize for Hermes engine compatibility
config.transformer = {
  ...config.transformer,
  // Enable Hermes optimizations
  enableBabelRuntime: true,
  enableBabelRCLookup: false,
  // Enable Hermes parser for better compatibility
  hermesParser: true,
  // Enable Hermes-optimized transformations
  experimentalImportSupport: false,
  inlineRequires: true,
  minifierConfig: {
    // Hermes-compatible minification settings
    mangle: {
      toplevel: false, // Keep safe for Hermes
      safari10: true,
    },
    compress: {
      drop_console: process.env.NODE_ENV === 'production',
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug'],
      passes: 1,
      unsafe: false, // Avoid unsafe optimizations with Hermes
      unsafe_comps: false,
      unsafe_math: false,
      unsafe_methods: false,
    },
    output: {
      ascii_only: true,
      comments: false,
      beautify: false,
    },
  },
};

// ============================================================================
// RESOLVER OPTIMIZATION (MERGED WITH ORIGINAL)
// ============================================================================

config.resolver = {
  ...config.resolver,
  // Asset extensions for optimization
  assetExts: [
    ...config.resolver.assetExts,
    'lottie', // For Lottie animations
    'webp', // For optimized images
    'avif', // For next-gen image format
  ],
  // Source extensions with TypeScript optimization
  sourceExts: [
    ...config.resolver.sourceExts,
    'ts',
    'tsx',
    'jsx',
    'js',
  ],
  // Platform-specific resolution for better tree-shaking
  platforms: ['ios', 'android', 'native', 'web'],
  // Custom alias resolution merged with original polyfills
  alias: {
    // Optimize React Native modules
    'react-native-vector-icons': '@expo/vector-icons',
    // Add module aliases for better tree-shaking
    '@components': './src/components',
    '@screens': './src/screens',
    '@utils': './src/utils',
    '@design-system': './src/design-system',
  },
  // Hermes-compatible resolver with minimal interference
  resolveRequest: (context, moduleName, platform) => {
    try {
      // Only handle specific polyfill cases, let Hermes handle everything else
      
      // Polyfills directory exclusion
      if (
        context.originModulePath.startsWith(`${__dirname}/polyfills/native`) ||
        context.originModulePath.startsWith(`${__dirname}/polyfills/web`) ||
        context.originModulePath.startsWith(`${__dirname}/polyfills/shared`)
      ) {
        return context.resolveRequest(context, moduleName, platform);
      }
      
      // Handle Expo Google Fonts wildcard
      if (moduleName.startsWith('@expo-google-fonts/') && moduleName !== '@expo-google-fonts/dev') {
        return context.resolveRequest(context, '@expo-google-fonts/dev', platform);
      }
      
      // Apply shared aliases
      if (SHARED_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
        return context.resolveRequest(context, SHARED_ALIASES[moduleName], platform);
      }
      
      // Platform-specific web aliases
      if (platform === 'web' && WEB_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
        return context.resolveRequest(context, WEB_ALIASES[moduleName], platform);
      }

      // Platform-specific native aliases
      if (NATIVE_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
        return context.resolveRequest(context, NATIVE_ALIASES[moduleName], platform);
      }
      
      // Default resolution - let Hermes handle everything else naturally
      return context.resolveRequest(context, moduleName, platform);
    } catch (error) {
      return handleResolveRequestError({ error, context, platform, moduleName });
    }
  },
};

// ============================================================================
// SERIALIZER OPTIMIZATION
// ============================================================================

config.serializer = {
  ...config.serializer,
  // CRITICAL FIX: Hermes-compatible module ID factory
  // This prevents the "Unknown named module: Core_InitializeCore_js" error
  // by using only numeric IDs instead of string-based IDs that get corrupted
  createModuleIdFactory: function () {
    const moduleIdMap = new Map();
    let nextId = 0;
    
    return function (path) {
      // Return cached ID if exists
      if (moduleIdMap.has(path)) {
        return moduleIdMap.get(path);
      }
      
      // SOLUTION: Use only numeric IDs for all modules
      // This prevents React Native core module name corruption
      // The previous implementation was transforming:
      // "react-native/Libraries/Core/InitializeCore.js" -> "Core_InitializeCore_js"
      // which caused Hermes to fail with "Unknown named module" error
      
      const moduleId = nextId++;
      moduleIdMap.set(path, moduleId);
      return moduleId;
    };
  },
  
  // Custom module filter for tree-shaking
  processModuleFilter: function (modules) {
    // Filter out development-only modules in production
    if (process.env.NODE_ENV === 'production') {
      const devOnlyModules = [
        'react-devtools',
        'reactotron',
        'flipper',
        '@react-native-community/cli-debugger-ui',
      ];
      
      return modules.filter(module => {
        return !devOnlyModules.some(devModule => 
          module.path.includes(devModule)
        );
      });
    }
    
    return modules;
  },
};

// ============================================================================
// PERFORMANCE OPTIMIZATION (ENHANCED WITH ORIGINAL)
// ============================================================================

const cacheDir = path.join(__dirname, 'caches');

// Production-specific optimizations
if (process.env.NODE_ENV === 'production') {
  // Optimize resolver for production
  config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
}

// ============================================================================
// ERROR REPORTING (PRESERVED FROM ORIGINAL)
// ============================================================================

config.reporter = {
  ...config.reporter,
  update: (event) => {
    config.reporter?.update(event);
    const reportableErrors = [
      'error',
      'bundling_error',
      'cache_read_error',
      'hmr_client_error',
      'transformer_load_failed',
    ];
    for (const errorType of reportableErrors) {
      if (event.type === errorType && event.error) {
        reportErrorToRemote({ error: event.error }).catch((reportError) => {
          // no-op
        });
      }
    }
    return event;
  },
};

// ============================================================================
// ASSET OPTIMIZATION
// ============================================================================

// Custom asset transformer for optimization
if (config.transformer.assetPlugins) {
  config.transformer.assetPlugins.push('expo-asset/tools/hashAssetFiles');
} else {
  config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];
}

// ============================================================================
// WEB-SPECIFIC OPTIMIZATIONS
// ============================================================================

if (process.env.EXPO_PUBLIC_PLATFORM === 'web') {
  // Web-specific bundle splitting
  config.serializer.experimentalSerializerHook = (graph, delta) => {
    // Custom serialization for web platform
    return null; // Let default serializer handle for now
  };
  
  // Web asset optimization
  config.transformer.enableBabelRCLookup = false;
  config.transformer.enableBabelRuntime = false;
}

// ============================================================================
// DEVELOPMENT OPTIMIZATIONS
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  // Fast refresh configuration
  config.transformer.enableBabelRCLookup = true;
  
  // Enable Hermes parser for development
  config.transformer.hermesParser = true;
  
  // Suppress named module warnings in development
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('Requiring module') && message.includes('by name is only supported for debugging purposes'))) {
      return; // Suppress these specific warnings
    }
    originalConsoleWarn.apply(console, args);
  };
}

// ============================================================================
// FINAL EXPORT
// ============================================================================

module.exports = config;
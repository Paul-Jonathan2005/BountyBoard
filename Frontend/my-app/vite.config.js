import env_config from './src/Config.js'


export default {
  server: {
    proxy: {
      '/api': {
        target: env_config.backend_url,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
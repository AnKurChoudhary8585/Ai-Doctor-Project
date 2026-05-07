import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-oxc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
      allow: ['..', 'C:/Users/Ankur/OneDrive/Desktop/Designs/Designs']
    }
  }
})

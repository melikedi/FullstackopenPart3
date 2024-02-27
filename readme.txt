https://phonebooktr.fly.dev/


Frontend
npm create vite@latest part1 --template react
npm install
npm run dev

Backend
npm init
npm install express
npm install nodemon


A production build for applications created with Vite can be created with the command npm run build.
>npm run build
--------------------------------
Proxy:
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
-----------------------------------------
{
  "name": "phonebookbackend",
  "version": "1.0.0",
  "description": "Fullstack Part3 Exercise",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/melikedi/FullstackopenPart3.git"
  },
  "author": "MFM",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/melikedi/FullstackopenPart3/issues"
  },
  "homepage": "https://github.com/melikedi/FullstackopenPart3#readme"
}
------------------------------------------------------
npm install cors
>npm run dev or >npm start

Fly.io
	PowerShell
	winget search Microsoft.PowerShell
	winget install --id Microsoft.Powershell --source winget
PowerShell7
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"

const PORT = process.env.PORT || 3001
fly auth login
fly launch
------------------------
	fly.toml
[build]

[env]
  PORT = "3000" # add this

[http_service]
  internal_port = 3000 # ensure that this is same as PORT
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]
---------------------------
fly deploy
fly apps open
the state of the data in your app will be inconsistent between requests, with two machine
$ fly scale show
$ fly scale count 1


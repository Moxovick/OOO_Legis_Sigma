module.exports = {
  apps: [
    {
      name: "legis-frontend",
      cwd: "/var/www/legis-new/frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        BACKEND_URL: "http://127.0.0.1:8000",
      },
    },
  ],
};

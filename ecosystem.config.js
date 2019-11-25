module.exports = {
  apps : {
    name: "DEV_ER-backend",
    script: "index.js",
    watch: false,
    env: {
      "NODE_ENV": "dev",
      "NODE_TLS_REJECT_UNAUTHORIZED": 0
    },
    exec_mode: "fork_mode"
  }
};

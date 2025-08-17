module.exports = {
  apps: [
    {
      name: "Attendance",
      script: "index.js",
      instances: 4, // Explicitly set to 4 clusters
      exec_mode: "cluster",
      env_file: ".env",
      autorestart: true,
      watch: false, // Disable watch mode in production
      ignore_watch: ["logs.txt", "node_modules", "logs","CleanLogs.txt","public","cleanedlogs"],
      max_memory_restart: "500M", // Restart if memory exceeds 500MB
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      max_restarts: 10,
      min_uptime: "10s",
      // Cluster-specific optimizations
      listen_timeout: 8000,
      kill_timeout: 5000,
      wait_ready: true,
      instance_var: 'INSTANCE_ID'
    },
  ],
};

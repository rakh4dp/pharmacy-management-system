module.exports = {
    apps: [
        { 
            name: 'auth-service-rakha', 
            script: 'server.js', 
            cwd: './auth-service',
            namespace: 'rakha',
            watch: true
        },
        { 
            name: 'inventory-service-rakha', 
            script: 'server.js', 
            cwd: './inventory-service',
            namespace: 'rakha',
            watch: true
        },
        { 
            name: 'transaction-service-rakha', 
            script: 'server.js', 
            cwd: './transaction-service',
            namespace: 'rakha',
            watch: true
        },
        { 
            name: 'api-gateway-rakha', 
            script: 'server.js', 
            cwd: './api-gateway',
            namespace: 'rakha',
            watch: true
        },
        { 
            name: 'message-worker-rakha', 
            script: 'worker.js', 
            cwd: './message-worker',
            namespace: 'rakha',
            watch: true
        }
    ]
};
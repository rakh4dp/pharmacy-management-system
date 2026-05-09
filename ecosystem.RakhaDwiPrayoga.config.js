module.exports = {
    apps: [
        { name: 'auth-service-rakha', script: './auth-service/server.js', namespace: 'rakha' },
        { name: 'inventory-service-rakha', script: './inventory-service/server.js', namespace: 'rakha' },
        { name: 'transaction-service-rakha', script: './transaction-service/server.js', namespace: 'rakha' },
        { name: 'api-gateway-rakha', script: './api-gateway/server.js', namespace: 'rakha' },
        { name: 'message-worker-rakha', script: './message-worker/worker.js', namespace: 'rakha' }
    ]
};
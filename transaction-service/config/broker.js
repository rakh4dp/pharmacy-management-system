const amqp = require('amqplib');

const queueName = 'stock_update_queue';

const sendToQueue = async (message) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: true });

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true 
        });

        console.log(`Pesan dikirim ke broker:`, message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error Broker:', error);
    }
};

module.exports = { sendToQueue };
const amqp = require('amqplib');

const queueName = 'stock_update_queue';

const consumeFromQueue = async (callback) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Pastikan queue ada (biar gak error kalau worker jalan duluan)
        await channel.assertQueue(queueName, { durable: true });

        // Batasi worker biar gak "keselek" (ambil satu-satu)
        channel.prefetch(1);

        console.log(`[*] Menunggu pesan di antrean: ${queueName}`);

        // mengambil pesan dari antrean
        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                
                callback(content, () => {
                    channel.ack(msg); 
                });
            }
        }, { noAck: false });

    } catch (error) {
        console.error('❌ Error Broker (Consumer):', error);
    }
};

module.exports = { consumeFromQueue };
import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRMQ = async () => {
  try {
    const conn = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    channel = await conn.createChannel();
    console.log("RabbitMQ connection successful");
  } catch (error) {
    console.log("Failed to connect to RabbitMQ", error);
  }
};

export const publishToQueue = async (queueName: string, msg: any) => {
  if (!channel) {
    console.log("RabbitMQ channel is not initialized");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
  });
};

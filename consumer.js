const q = "task_queue";

async function consumer() {
  try {
    let con = await require("amqplib").connect(
      "amqp://tvobttnq:Ri6S8XroB9gRiIvSesqQMa2KcWI_IOkB@otter.rmq.cloudamqp.com/tvobttnq"
    );

    let ch = await con.createChannel();
    let _ok = await ch.assertQueue(q, { durable: true });
    ch.consume(
      q,
      msg => {
        const secs = msg.content.toString().split(".").length - 1;
        console.log(msg.content.toString());
        setTimeout(() => {
          console.log(`[x] Done after ${secs} seconds`);
          ch.ack(msg);
        }, secs * 1000);
      },
      { noAck: false }
    );
  } catch (error) {
    console.log("ERR:" + error);
  }
}

(async function() {
  await consumer();
})();

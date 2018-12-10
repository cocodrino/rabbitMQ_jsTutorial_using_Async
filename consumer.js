const LOG_EXCHANGE = "logs";

async function consumer() {
  try {
    console.log("[*] Connecting");
    let con = await require("amqplib").connect(
      "amqp://tvobttnq:Ri6S8XroB9gRiIvSesqQMa2KcWI_IOkB@otter.rmq.cloudamqp.com/tvobttnq"
    );

    let ch = await con.createChannel();

    let _ok = await ch.assertExchange(LOG_EXCHANGE, "fanout", {
      durable: false
    });

    //after create our exchange we create an 'anonymous' Queue
    let q = await ch.assertQueue("", { exclusive: true });
    console.log(`[*] queue ${q.queue} waiting`);
    //and bind this (through it generated named using q.queue) to our exchange
    ch.bindQueue(q.queue, LOG_EXCHANGE, "");

    ch.consume(
      q.queue,
      msg => {
        console.log(msg.content.toString());
      },
      { noAck: true }
    );
  } catch (error) {
    console.log("ERR:" + error);
  }
}

(async function() {
  await consumer();
})();

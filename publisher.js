var _ = require("lodash");
const LOG_EXCHANGE = "logs";

async function amqp() {
  let con;
  try {
    console.log("[*] Connecting");
    con = await require("amqplib").connect(
      "amqp://tvobttnq:Ri6S8XroB9gRiIvSesqQMa2KcWI_IOkB@otter.rmq.cloudamqp.com/tvobttnq"
    );

    let ch = await con.createChannel();
    //biggest difference with previous lesson, we create an exchange here
    ch.assertExchange(LOG_EXCHANGE, "fanout", { durable: false });

    //now we use publish instead of sendToQueue
    ch.publish(LOG_EXCHANGE, "", Buffer.from("[*] Sending first log"));

    _.range(10).forEach(_e => {
      ch.publish(LOG_EXCHANGE, "", Buffer.from(`[*] Log  ${_e}`));
    });

    console.log("[*] all logs were sended");
    //con.close();
  } catch (error) {
    console.log("ERR:" + error);
  } finally {
    setTimeout(function() {
      con.close();
      process.exit(0);
    }, 50);
  }
}

(async function() {
  await amqp();
})();

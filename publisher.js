var _ = require("lodash");

const q = "task_queue";
const msg = process.argv.slice(2).join(" ") || "hello world!!";

async function amqp() {
  try {
    let con = await require("amqplib").connect(
      "amqp://tvobttnq:Ri6S8XroB9gRiIvSesqQMa2KcWI_IOkB@otter.rmq.cloudamqp.com/tvobttnq"
    );

    let ch = await con.createChannel();
    ch.prefetch(1);
    let _ok = await ch.assertQueue(q, { durable: true });
    ch.sendToQueue(q, Buffer.from(msg), { persistent: true });

    console.log("mensajes enviados");
    return con;
    //con.close();
  } catch (error) {
    console.log("ERR:" + error);
  }
}

/* (async function() {
  await amqp();
})(); */

amqp().then(con => {
  setTimeout(function() {
    con.close();
    process.exit(0);
  }, 50);
});

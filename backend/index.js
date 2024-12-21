const { Keypair, Transaction } = require("@solana/web3.js");
const express = require("express");
const { userModel } = require("./models.js");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const { connection } = require("mongoose");
const JWT_SECRET = "123456789";
const bs58 = require("bs58");
const app = express();

app.use(express.json());

const blockChainConnection = new Connection(
  "https://worldchain-mainnet.g.alchemy.com/v2/h1r2J58ksDsBqkiZxQIdNGOniZ8g4hlc"
);

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.json({ message: "Incomplete inputs" });
  }
  const keypair = new Keypair();
  await userModel.create({
    username,
    password,
    publickey: keypair.publicKey.toString(),
    privatekey: keypair.secretKey.toString(),
  });

  res.json({
    message: "Sign up successful",
  });
});
app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await userModel.fineOne({
    username: username,
    password: password,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } else {
    res.json({
      message: "Incorrect credentials",
    });
  }
});
app.post("/api/v1/txn/sign", async (req, res) => {
  const serializedTransaction = req.body.message;
  const tx = Transaction.from(serializedTransaction);
  const user = await userModel.find({
    where: {
      // id:user_id
      id: 123,
    },
  });
  let keypair = Keypair.fromSecretKey(bs58.decode(user.privatekey));
  tx.sign(keypair);
  ///sending to blockchain
  await blockChainConnection.sendTransaction(tx);
  tx.sign("user_private_keyy");
  res.json({
    message: "txn sign",
  });
});
app.get("/api/v1/txn", (req, res) => {
  res.json({
    message: "txn",
  });
});

app.listen(3000);

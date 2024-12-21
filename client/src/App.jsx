import "./App.css";
import {
  Transaction,
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { connect } from "mongoose";

const connection = new Connection(
  "https://worldchain-mainnet.g.alchemy.com/v2/h1r2J58ksDsBqkiZxQIdNGOniZ8g4hlc"
);

function App() {
  async function sendSol() {
    const ix = SystemProgram.transfer({
      fromPubkey: new PublicKey("backend_passed_key"),
      toPubkey: new PublicKey("random keyn her"),
      lamports: 0.001 * LAMPORTS_PER_SOL,
    });
    const tx = new Transaction().add(ix);

    const { blockHash } = await connect.getLatestBlockHash();
    tx.recentBlockhash = blockHash;
    tx.feePayer = new PublicKey("backend_passed_key");
    //converting to bytes
    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    await axios.post("/api/v1/txn/sign", {
      message: serializedTx,
      retry: false,
    });
  }

  return (
    <div>
      <input type="text" placeholder="Amount"></input>
      <input type="text" placeholder="Address"></input>

      <button onClick={sendSol}>Submit</button>
    </div>
  );
}

export default App;

import { createConsumer } from "@rails/actioncable";
// const cable = createConsumer("ws://localhost:3000/cable");

// 環境変数からWebSocketのURLを取得
const cableUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/cable`;

// createConsumerにURLを渡す
const cable = createConsumer(cableUrl);

export default cable;



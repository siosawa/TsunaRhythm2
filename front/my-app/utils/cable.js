import { createConsumer } from "@rails/actioncable";

const cableUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/cable`;

const cable = createConsumer(cableUrl);

export default cable;



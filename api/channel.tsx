import Pusher from "pusher";

// Not sure if this is necessary (may be deprecated) delete??
export const pusher = new Pusher({
  appId: "1706610",
  key: "fff161099616c02456da",
  secret: "c953b8bdad5eb262fe0a",
  cluster: "eu",
  useTLS: true
});
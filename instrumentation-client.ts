import { initBotId } from "botid/client/core";

// Vercel BotID: the giveaway entry route checks the challenge it attaches to this request.
initBotId({ protect: [{ path: "/nye/giveaway/entry", method: "POST" }] });

// 智谱api测试
const { ChatOpenAI } = require("@langchain/openai");
const model = new ChatOpenAI({
    temperature: 0,
    model: "glm-4-flash",
    apiKey: process.env.OPENAI_API_KEY || "da205089ecfe4dbab7a12a037280346f.mDizkCCctR8ummfK",
    configuration: {
      baseURL: process.env.OPENAI_API_BASE || "https://open.bigmodel.cn/api/paas/v4/",
    },
});


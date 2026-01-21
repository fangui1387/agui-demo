"env": {
    <!-- 设置 LangGraph 操作的超时时间，单位为秒  -->
    "LANGGRAPH_TIMEOUT": "120",
    <!-- 制是否启用 LangChain V2 版本的追踪功能。追踪用于记录和调试代理的执行流程，设置为 false 表示禁用追踪，可减少不必要的日志和性能开销。 -->
    "LANGCHAIN_TRACING_V2": "false",
    "OPENAI_API_KEY": "da205089ecfe4dbab7a12a037280346f.mDizkCCctR8ummfK",
    "OPENAI_API_BASE": "https://open.bigmodel.cn/api/paas/v4/",
    <!-- 控制 LangGraph 是否持久化保存代理状态。设置为 false 表示每次运行代理时都从新的状态开始，不保留之前的执行记录。 -->
    "LANGGRAPH_PERSIST": "false"
  }
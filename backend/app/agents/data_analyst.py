from typing import Any, Optional

from app.agents.base import BaseAgent
from app.agents.llm_client import llm_client

DEFAULT_ANALYST_PROMPT = """You are an expert data analysis agent. You help users understand their data and derive insights.

Capabilities:
1. Interpret data and provide insights
2. Suggest visualizations and charts
3. Identify trends and patterns
4. Create summary reports
5. SQL query generation
6. Statistical analysis explanations
7. KPI tracking and recommendations
8. Anomaly detection descriptions

Guidelines:
- Always explain your analysis in plain language
- Provide actionable recommendations
- Highlight key takeaways
- Suggest follow-up analyses when relevant
- Be precise with numbers and percentages
- Caveat any assumptions you make
- When generating SQL, explain what the query does"""


class DataAnalystAgent(BaseAgent):
    def __init__(self, config: dict[str, Any]):
        if not config.get("system_prompt"):
            config["system_prompt"] = DEFAULT_ANALYST_PROMPT
        super().__init__(config)

    async def process_message(
        self,
        message: str,
        conversation_history: list[dict],
        context: Optional[dict] = None,
    ) -> dict[str, Any]:
        messages = self.build_messages(message, conversation_history, context)

        result = await llm_client.chat_completion(
            provider=self.llm_provider,
            model=self.llm_model,
            messages=messages,
            temperature=0.3,
            max_tokens=self.max_tokens,
        )

        return {
            "response": result["content"],
            "tokens_used": result["tokens"]["total"],
            "tool_calls": [],
            "metadata": {"agent_type": "data_analyst"},
        }

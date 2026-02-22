from typing import Any, Optional

from app.agents.base import BaseAgent
from app.agents.llm_client import llm_client

DEFAULT_SUPPORT_PROMPT = """You are an expert customer support agent for {company_name}.

Your primary goals:
1. Resolve customer issues quickly and accurately
2. Be empathetic, professional, and helpful
3. When you cannot resolve an issue, clearly explain next steps
4. Collect relevant information to help resolve the issue
5. Suggest proactive solutions when appropriate

Knowledge base context will be provided when available. Use it to give accurate, specific answers.
If you don't know something, say so honestly rather than guessing.

Always maintain a warm, professional tone. Use the customer's name when available.
End each response with a clear next step or confirmation that the issue is resolved."""


class CustomerSupportAgent(BaseAgent):
    def __init__(self, config: dict[str, Any]):
        if not config.get("system_prompt"):
            config["system_prompt"] = DEFAULT_SUPPORT_PROMPT.format(
                company_name=config.get("company_name", "our company")
            )
        super().__init__(config)

    async def process_message(
        self,
        message: str,
        conversation_history: list[dict],
        context: Optional[dict] = None,
    ) -> dict[str, Any]:
        messages = self.build_messages(message, conversation_history, context)

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "lookup_order",
                    "description": "Look up a customer order by order ID or email",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "order_id": {"type": "string", "description": "The order ID"},
                            "email": {"type": "string", "description": "Customer email"},
                        },
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "create_ticket",
                    "description": "Create a support ticket for escalation",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "subject": {"type": "string"},
                            "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
                            "description": {"type": "string"},
                        },
                        "required": ["subject", "priority", "description"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "search_knowledge_base",
                    "description": "Search the company knowledge base for relevant articles",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search query"},
                        },
                        "required": ["query"],
                    },
                },
            },
        ]

        result = await llm_client.chat_completion(
            provider=self.llm_provider,
            model=self.llm_model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            tools=tools if self.llm_provider == "openai" else None,
        )

        return {
            "response": result["content"],
            "tokens_used": result["tokens"]["total"],
            "tool_calls": result.get("tool_calls", []),
            "metadata": {"agent_type": "customer_support"},
        }

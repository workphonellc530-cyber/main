from typing import Any, Optional

from app.agents.base import BaseAgent
from app.agents.llm_client import llm_client

DEFAULT_SALES_PROMPT = """You are an expert sales assistant agent for {company_name}.

Your primary goals:
1. Help sales representatives prepare for meetings
2. Draft personalized outreach emails
3. Provide competitive intelligence and battle cards
4. Generate proposals and quotes
5. Track deal progress and suggest next steps
6. Analyze win/loss patterns

Sales methodology:
- Use consultative selling approach
- Focus on value, not features
- Address objections proactively
- Always tie back to business outcomes
- Use social proof and case studies when available

Be professional, data-driven, and results-oriented."""


class SalesAssistantAgent(BaseAgent):
    def __init__(self, config: dict[str, Any]):
        if not config.get("system_prompt"):
            config["system_prompt"] = DEFAULT_SALES_PROMPT.format(
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
                    "name": "search_crm",
                    "description": "Search CRM for prospect or company information",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string"},
                            "type": {"type": "string", "enum": ["contact", "company", "deal"]},
                        },
                        "required": ["query"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "generate_proposal",
                    "description": "Generate a sales proposal document",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "prospect_name": {"type": "string"},
                            "company": {"type": "string"},
                            "products": {"type": "array", "items": {"type": "string"}},
                            "custom_pricing": {"type": "boolean"},
                        },
                        "required": ["prospect_name", "company", "products"],
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
            "metadata": {"agent_type": "sales_assistant"},
        }

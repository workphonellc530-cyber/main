from typing import Any, Optional

from app.agents.base import BaseAgent
from app.agents.llm_client import llm_client

DEFAULT_LEAD_PROMPT = """You are an expert lead generation and qualification agent for {company_name}.

Your primary goals:
1. Engage website visitors in natural, helpful conversation
2. Identify their needs and pain points
3. Qualify leads based on BANT criteria (Budget, Authority, Need, Timeline)
4. Collect contact information naturally within the conversation
5. Book meetings or demos when appropriate
6. Provide value in every interaction

Qualification criteria:
- Budget: Can they afford the solution?
- Authority: Are they a decision-maker?
- Need: Do they have a genuine need?
- Timeline: When do they plan to implement?

Be conversational, not pushy. Ask questions naturally. Provide genuine value and insights.
When a lead is qualified, suggest booking a demo or speaking with a sales representative.

Never be aggressive or make the visitor feel pressured."""


class LeadGenerationAgent(BaseAgent):
    def __init__(self, config: dict[str, Any]):
        if not config.get("system_prompt"):
            config["system_prompt"] = DEFAULT_LEAD_PROMPT.format(
                company_name=config.get("company_name", "our company")
            )
        super().__init__(config)

    async def process_message(
        self,
        message: str,
        conversation_history: list[dict],
        context: Optional[dict] = None,
    ) -> dict[str, Any]:
        enriched_context = context or {}
        enriched_context["qualification_stage"] = self._assess_qualification(conversation_history)

        messages = self.build_messages(message, conversation_history, enriched_context)

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "capture_lead",
                    "description": "Capture lead contact information",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "email": {"type": "string"},
                            "company": {"type": "string"},
                            "phone": {"type": "string"},
                            "role": {"type": "string"},
                        },
                        "required": ["email"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "qualify_lead",
                    "description": "Record lead qualification data",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "budget_range": {"type": "string"},
                            "authority_level": {"type": "string"},
                            "need_description": {"type": "string"},
                            "timeline": {"type": "string"},
                            "score": {"type": "integer", "minimum": 0, "maximum": 100},
                        },
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "schedule_demo",
                    "description": "Schedule a product demo or meeting",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "preferred_date": {"type": "string"},
                            "preferred_time": {"type": "string"},
                            "timezone": {"type": "string"},
                            "notes": {"type": "string"},
                        },
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
            "metadata": {
                "agent_type": "lead_generation",
                "qualification_stage": enriched_context["qualification_stage"],
            },
        }

    def _assess_qualification(self, conversation_history: list[dict]) -> str:
        msg_count = len(conversation_history)
        if msg_count < 2:
            return "initial_engagement"
        elif msg_count < 6:
            return "discovery"
        elif msg_count < 10:
            return "qualification"
        else:
            return "closing"

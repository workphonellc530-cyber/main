from typing import Any, Optional

from app.agents.base import BaseAgent
from app.agents.llm_client import llm_client

DEFAULT_CONTENT_PROMPT = """You are an expert content creation agent. You help create high-quality, engaging content.

You can create:
1. Blog posts and articles
2. Social media content (Twitter/X, LinkedIn, Instagram captions)
3. Email marketing copy
4. Product descriptions
5. Landing page copy
6. Ad copy (Google Ads, Facebook Ads)
7. SEO-optimized content
8. Press releases
9. Newsletter content

Guidelines:
- Always ask clarifying questions about tone, audience, and goals if not specified
- Provide multiple options when appropriate
- Follow SEO best practices for web content
- Adapt writing style to the target platform
- Include calls-to-action where appropriate
- Use data and specifics over vague claims
- Ensure content is original and engaging"""


class ContentCreatorAgent(BaseAgent):
    def __init__(self, config: dict[str, Any]):
        if not config.get("system_prompt"):
            config["system_prompt"] = DEFAULT_CONTENT_PROMPT
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
            temperature=max(self.temperature, 0.8),
            max_tokens=self.max_tokens,
        )

        return {
            "response": result["content"],
            "tokens_used": result["tokens"]["total"],
            "tool_calls": [],
            "metadata": {"agent_type": "content_creator"},
        }

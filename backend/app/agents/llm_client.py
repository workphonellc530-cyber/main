from typing import Any, Optional
import openai
import anthropic
import structlog

from app.core.config import settings

logger = structlog.get_logger()


class LLMClient:
    def __init__(self):
        self._openai_client = None
        self._anthropic_client = None

    @property
    def openai_client(self):
        if self._openai_client is None and settings.OPENAI_API_KEY:
            self._openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        return self._openai_client

    @property
    def anthropic_client(self):
        if self._anthropic_client is None and settings.ANTHROPIC_API_KEY:
            self._anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        return self._anthropic_client

    async def chat_completion(
        self,
        provider: str,
        model: str,
        messages: list[dict],
        temperature: float = 0.7,
        max_tokens: int = 4096,
        tools: Optional[list[dict]] = None,
    ) -> dict[str, Any]:
        if provider == "openai":
            return await self._openai_completion(model, messages, temperature, max_tokens, tools)
        elif provider == "anthropic":
            return await self._anthropic_completion(model, messages, temperature, max_tokens)
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")

    async def _openai_completion(
        self,
        model: str,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
        tools: Optional[list[dict]] = None,
    ) -> dict[str, Any]:
        if not self.openai_client:
            raise ValueError("OpenAI API key not configured")

        kwargs: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            kwargs["tools"] = tools

        response = await self.openai_client.chat.completions.create(**kwargs)
        choice = response.choices[0]

        return {
            "content": choice.message.content or "",
            "tool_calls": [tc.model_dump() for tc in (choice.message.tool_calls or [])],
            "tokens": {
                "prompt": response.usage.prompt_tokens if response.usage else 0,
                "completion": response.usage.completion_tokens if response.usage else 0,
                "total": response.usage.total_tokens if response.usage else 0,
            },
            "finish_reason": choice.finish_reason,
        }

    async def _anthropic_completion(
        self,
        model: str,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
    ) -> dict[str, Any]:
        if not self.anthropic_client:
            raise ValueError("Anthropic API key not configured")

        system_msg = ""
        filtered_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_msg = msg["content"]
            else:
                filtered_messages.append(msg)

        kwargs: dict[str, Any] = {
            "model": model,
            "messages": filtered_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if system_msg:
            kwargs["system"] = system_msg

        response = await self.anthropic_client.messages.create(**kwargs)

        return {
            "content": response.content[0].text if response.content else "",
            "tool_calls": [],
            "tokens": {
                "prompt": response.usage.input_tokens,
                "completion": response.usage.output_tokens,
                "total": response.usage.input_tokens + response.usage.output_tokens,
            },
            "finish_reason": response.stop_reason,
        }


llm_client = LLMClient()

from abc import ABC, abstractmethod
from typing import Any, Optional
import time
import structlog

logger = structlog.get_logger()


class BaseAgent(ABC):
    def __init__(self, config: dict[str, Any]):
        self.config = config
        self.name = config.get("name", "Agent")
        self.system_prompt = config.get("system_prompt", "")
        self.llm_provider = config.get("llm_provider", "openai")
        self.llm_model = config.get("llm_model", "gpt-4o")
        self.temperature = config.get("temperature", 0.7)
        self.max_tokens = config.get("max_tokens", 4096)
        self.tools_config = config.get("tools_config", [])
        self.knowledge_base = config.get("knowledge_base", [])

    @abstractmethod
    async def process_message(
        self,
        message: str,
        conversation_history: list[dict],
        context: Optional[dict] = None,
    ) -> dict[str, Any]:
        pass

    def build_messages(
        self, message: str, conversation_history: list[dict], context: Optional[dict] = None
    ) -> list[dict]:
        messages = []
        if self.system_prompt:
            system_content = self.system_prompt
            if context:
                system_content += f"\n\nContext: {context}"
            messages.append({"role": "system", "content": system_content})

        for msg in conversation_history[-20:]:
            messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": message})
        return messages

    async def execute(
        self,
        message: str,
        conversation_history: list[dict],
        context: Optional[dict] = None,
    ) -> dict[str, Any]:
        start_time = time.time()
        try:
            result = await self.process_message(message, conversation_history, context)
            result["latency_ms"] = int((time.time() - start_time) * 1000)
            return result
        except Exception as e:
            logger.error("agent_execution_error", agent=self.name, error=str(e))
            return {
                "response": "I apologize, but I encountered an issue. Please try again or contact support.",
                "tokens_used": 0,
                "latency_ms": int((time.time() - start_time) * 1000),
                "error": str(e),
            }

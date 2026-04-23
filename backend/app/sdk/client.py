"""
AI KPI Platform Python SDK

使用方式：
    from app.sdk.client import AiKPIClient

    client = AiKPIClient(api_key="your-key", endpoint="http://localhost:8000")

    # 上报单个事件
    client.track(
        model="gpt-4o",
        project="客服助手",
        input_tokens=150,
        output_tokens=320,
        latency_ms=1200,
        status=200,
    )

    # 批量上报
    client.track_batch([
        {"model": "gpt-4o", "project": "客服助手", "input_tokens": 150, ...},
        {"model": "claude-3", "project": "RAG检索", "input_tokens": 200, ...},
    ])
"""

from typing import Any, Dict, List

import httpx


class AiKPIError(Exception):
    """AI KPI Platform SDK 异常基类。"""

    def __init__(self, message: str, status_code: int | None = None, response_body: Any = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body


class AiKPIClient:
    """AI KPI Platform 轻量级 Python SDK 客户端。"""

    def __init__(self, api_key: str, endpoint: str = "http://localhost:8000", timeout: float = 30.0):
        """
        初始化 SDK 客户端。

        Args:
            api_key: API Key，用于请求认证。
            endpoint: AI KPI 平台服务地址，默认 http://localhost:8000。
            timeout: HTTP 请求超时时间（秒），默认 30 秒。
        """
        self.api_key = api_key
        self.endpoint = endpoint.rstrip("/")
        self.timeout = timeout

    def _request(
        self,
        method: str,
        path: str,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        内部 HTTP 请求方法，自动添加 X-API-Key header，处理错误和重试。

        Args:
            method: HTTP 方法，如 GET、POST。
            path: API 路径，如 /api/v1/events/track。
            **kwargs: 传递给 httpx.request 的额外参数。

        Returns:
            响应 JSON 中的 data 字段内容。

        Raises:
            AiKPIError: API 返回错误时抛出。
        """
        url = f"{self.endpoint}{path}"
        headers = kwargs.pop("headers", {})
        headers["X-API-Key"] = self.api_key
        headers.setdefault("Content-Type", "application/json")

        last_exception: Exception | None = None
        max_retries = 3

        for attempt in range(max_retries):
            try:
                with httpx.Client(timeout=self.timeout) as client:
                    response = client.request(method, url, headers=headers, **kwargs)

                if response.status_code >= 400:
                    try:
                        body = response.json()
                        message = body.get("message", response.text)
                    except Exception:
                        body = response.text
                        message = body
                    raise AiKPIError(
                        message=f"API error: {message}",
                        status_code=response.status_code,
                        response_body=body,
                    )

                resp_json = response.json()
                if not resp_json.get("success", True):
                    raise AiKPIError(
                        message=f"API error: {resp_json.get('message', 'Unknown error')}",
                        status_code=response.status_code,
                        response_body=resp_json,
                    )
                return resp_json.get("data", resp_json)
            except (httpx.NetworkError, httpx.ConnectError, httpx.TimeoutException) as exc:
                last_exception = exc
                if attempt < max_retries - 1:
                    continue
                raise AiKPIError(
                    message=f"Network error after {max_retries} retries: {exc}",
                    status_code=None,
                    response_body=None,
                ) from exc
            except AiKPIError:
                raise
            except Exception as exc:
                raise AiKPIError(
                    message=f"Unexpected error: {exc}",
                    status_code=None,
                    response_body=None,
                ) from exc

        # 理论上不会到达这里，但为了类型检查安全保留
        raise AiKPIError(
            message=f"Network error after {max_retries} retries: {last_exception}",
        )

    def track(
        self,
        model: str,
        project: str,
        input_tokens: int,
        output_tokens: int,
        latency_ms: int,
        status: int,
        accuracy: float | None = None,
        user_id: str | None = None,
    ) -> Dict[str, Any]:
        """
        上报单个事件。

        Args:
            model: 模型名称，如 gpt-4o。
            project: 项目名称。
            input_tokens: 输入 Token 数。
            output_tokens: 输出 Token 数。
            latency_ms: 延迟（毫秒）。
            status: HTTP 状态码。
            accuracy: 准确率（可选）。
            user_id: 用户 ID（可选）。

        Returns:
            服务端返回的事件记录数据。
        """
        payload: Dict[str, Any] = {
            "model": model,
            "project": project,
            "inputTokens": input_tokens,
            "outputTokens": output_tokens,
            "latencyMs": latency_ms,
            "status": status,
        }
        if accuracy is not None:
            payload["accuracy"] = accuracy
        if user_id is not None:
            payload["userId"] = user_id

        return self._request("POST", "/api/v1/events/track", json=payload)

    def track_batch(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        批量上报事件。

        Args:
            events: 事件字典列表，每个字典包含与 track 相同的字段（支持蛇峰命名）。

        Returns:
            服务端返回的批量处理结果，包含 count 和 events。
        """
        # 将蛇形命名自动转换为前端/后端期望的驼峰命名
        normalized: List[Dict[str, Any]] = []
        key_mapping = {
            "input_tokens": "inputTokens",
            "output_tokens": "outputTokens",
            "latency_ms": "latencyMs",
            "user_id": "userId",
        }
        for event in events:
            item: Dict[str, Any] = {}
            for key, value in event.items():
                item[key_mapping.get(key, key)] = value
            normalized.append(item)

        return self._request("POST", "/api/v1/events/batch", json={"events": normalized})

    def verify(self) -> Dict[str, Any]:
        """
        验证 API Key 是否有效。

        Returns:
            API Key 的详细信息。
        """
        return self._request("GET", "/api/v1/auth/verify")

    def get_event(self, event_id: str) -> Dict[str, Any]:
        """
        查询指定事件的详情。

        Args:
            event_id: 事件 ID。

        Returns:
            事件详情数据。
        """
        return self._request("GET", f"/api/v1/events/{event_id}")

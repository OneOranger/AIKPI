from datetime import datetime
from typing import List
import secrets

from app.schemas.alert import ActiveAlert, AlertHistory


def check_alert_rules(events: list[dict], rules: list[dict]) -> list[ActiveAlert]:
    """检查事件是否触发告警规则."""
    active_alerts: list[ActiveAlert] = []

    for event in events:
        event_project = event.get("project", "")
        event_timestamp = event.get("timestamp", datetime.utcnow().isoformat())

        for rule in rules:
            if not rule.get("enabled", True):
                continue

            rule_project = rule.get("project", "all")
            if rule_project != "all" and rule_project != event_project:
                continue

            metric = rule.get("metric")
            operator = rule.get("operator")
            threshold = rule.get("threshold")

            if metric is None or operator is None or threshold is None:
                continue

            # 从事件中提取指标值
            value = None
            if metric == "accuracy":
                value = event.get("accuracy")
            elif metric == "latency_p95":
                value = event.get("latency_ms")
            elif metric == "success_rate":
                status = event.get("status", 200)
                value = 100.0 if status < 400 else 0.0
            elif metric == "daily_cost":
                value = event.get("cost")
            elif metric == "hallucination":
                value = event.get("hallucination")
            elif metric == "http_429_count":
                value = 1 if event.get("status") == 429 else 0

            if value is None:
                continue

            # 判断触发条件
            triggered = False
            if operator == "lt":
                triggered = value < threshold
            elif operator == "gt":
                triggered = value > threshold
            elif operator == "gt_ratio":
                triggered = value > threshold
            elif operator == "eq":
                triggered = value == threshold
            elif operator == "lte":
                triggered = value <= threshold
            elif operator == "gte":
                triggered = value >= threshold

            if triggered:
                active_alerts.append(
                    ActiveAlert(
                        level=rule.get("level", "warning"),
                        title=f"{rule.get('name', '未命名规则')} 触发",
                        time=(
                            event_timestamp
                            if isinstance(event_timestamp, str)
                            else event_timestamp.isoformat()
                        ),
                        project=event_project,
                    )
                )

    return active_alerts


def create_alert_history(rule: dict, current_value: float) -> AlertHistory:
    """创建告警历史记录."""
    return AlertHistory(
        id=f"ah_{secrets.token_hex(3)}",
        rule_id=rule.get("id", ""),
        rule_name=rule.get("name"),
        level=rule.get("level", "warning"),
        title=f"{rule.get('name', '未命名规则')} 触发告警",
        project=rule.get("project", "all"),
        detail=f"当前值 {current_value}，阈值 {rule.get('threshold')}",
        resolved=False,
        status="触发中",
        triggered_at=datetime.utcnow(),
        current_value=current_value,
        threshold=rule.get("threshold"),
    )

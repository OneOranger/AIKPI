import json
from pathlib import Path
from typing import Any
import threading


class JsonStorage:
    """线程安全的 JSON 文件存储引擎"""

    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._locks: dict[str, threading.Lock] = {}

    def _get_lock(self, filename: str) -> threading.Lock:
        if filename not in self._locks:
            self._locks[filename] = threading.Lock()
        return self._locks[filename]

    def _file_path(self, filename: str) -> Path:
        return self.data_dir / filename

    def read(self, filename: str) -> Any:
        path = self._file_path(filename)
        if not path.exists():
            return [] if filename.endswith('.json') else {}
        with self._get_lock(filename):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)

    def write(self, filename: str, data: Any) -> None:
        with self._get_lock(filename):
            with open(self._file_path(filename), 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    def append(self, filename: str, item: dict) -> None:
        data = self.read(filename)
        if isinstance(data, list):
            data.append(item)
        self.write(filename, data)

    def update_by_id(self, filename: str, item_id: str, updates: dict) -> bool:
        data = self.read(filename)
        for item in data:
            if item.get("id") == item_id:
                item.update(updates)
                self.write(filename, data)
                return True
        return False

    def delete_by_id(self, filename: str, item_id: str) -> bool:
        data = self.read(filename)
        new_data = [item for item in data if item.get("id") != item_id]
        if len(new_data) < len(data):
            self.write(filename, new_data)
            return True
        return False

    def find_by_id(self, filename: str, item_id: str) -> dict | None:
        data = self.read(filename)
        for item in data:
            if item.get("id") == item_id:
                return item
        return None

#!/usr/bin/env python3
"""楽天ROOMの半自動投稿候補を作成するローカルツール。

このツールは候補作成・文章作成・履歴管理だけを行います。
楽天ROOMや楽天市場へのログイン、自動投稿、クリック操作、スクレイピング、
Cookie/パスワード保存は一切行いません。
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.json"
HISTORY_PATH = BASE_DIR / "posted_history.json"
TEMPLATES_PATH = BASE_DIR / "templates" / "post_templates.json"
HASHTAGS_PATH = BASE_DIR / "templates" / "hashtags.json"
OUTPUT_PATH = BASE_DIR / "output" / "daily_candidates.md"


@dataclass(frozen=True)
class Candidate:
    item_name: str
    item_url: str
    genre: str
    price: int | None
    review: str
    stock: str
    shop: str
    reason: str
    target: str
    check_points: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Candidate":
        return cls(
            item_name=str(data.get("item_name", "")).strip(),
            item_url=str(data.get("item_url", "")).strip(),
            genre=str(data.get("genre", "")).strip(),
            price=_to_int(data.get("price")),
            review=str(data.get("review", "要手動確認")).strip() or "要手動確認",
            stock=str(data.get("stock", "要手動確認")).strip() or "要手動確認",
            shop=str(data.get("shop", "要手動確認")).strip() or "要手動確認",
            reason=str(data.get("reason", "")).strip(),
            target=str(data.get("target", "")).strip(),
            check_points=str(data.get("check_points", "価格・在庫・レビュー")).strip(),
        )


def _to_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
        file.write("\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="楽天ROOMの手動投稿用候補を1日3件まで作成します。"
    )
    parser.add_argument(
        "--date",
        default=date.today().isoformat(),
        help="作成日をYYYY-MM-DDで指定します。省略時は今日です。",
    )
    parser.add_argument(
        "--candidates",
        type=Path,
        help="任意の商品候補JSONを指定します。未指定時はconfig.jsonのsample_candidatesを使います。",
    )
    return parser.parse_args()


def get_target_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def get_weekday_genre(target_date: date, config: dict[str, Any]) -> str:
    weekday_genres = config["weekday_genres"]
    return str(weekday_genres[str(target_date.weekday())])


def load_candidates(config: dict[str, Any], candidates_path: Path | None) -> list[Candidate]:
    raw_candidates = load_json(candidates_path, []) if candidates_path else config.get("sample_candidates", [])
    return [Candidate.from_dict(item) for item in raw_candidates]


def normalize_shop(shop: str) -> str:
    return shop.strip().lower()


def is_duplicate(candidate: Candidate, history: list[dict[str, Any]]) -> bool:
    candidate_shop = normalize_shop(candidate.shop)
    for item in history:
        same_url = item.get("item_url") == candidate.item_url
        same_name = item.get("item_name") == candidate.item_name
        same_shop = normalize_shop(str(item.get("shop", ""))) == candidate_shop and candidate_shop
        if same_url or same_name or same_shop:
            return True
    return False


def has_disallowed_genre(candidate: Candidate, disallowed_genres: list[str]) -> bool:
    text = f"{candidate.genre} {candidate.item_name}"
    return any(disallowed in text for disallowed in disallowed_genres)


def select_candidates(
    candidates: list[Candidate],
    history: list[dict[str, Any]],
    config: dict[str, Any],
    today_genre: str,
) -> list[Candidate]:
    valid: list[Candidate] = []
    for candidate in candidates:
        if not candidate.item_name or not candidate.item_url:
            continue
        if candidate.price is None or candidate.price > int(config["max_price"]):
            continue
        if has_disallowed_genre(candidate, config["disallowed_genres"]):
            continue
        if is_duplicate(candidate, history):
            continue
        valid.append(candidate)

    valid.sort(key=lambda item: (item.genre != today_genre, item.price or 0))
    return valid[: int(config["daily_limit"])]


def safety_check(text: str, blocked_phrases: list[str]) -> str:
    found = [phrase for phrase in blocked_phrases if phrase in text]
    if not found:
        return "OK（禁止表現なし）"
    return "要修正（禁止表現: " + ", ".join(found) + "）"


def make_posts(candidate: Candidate, templates: dict[str, str]) -> dict[str, str]:
    check_point = candidate.check_points.split("、")[0].split(",")[0]
    use_case = candidate.genre.replace("・", "や")
    return {
        key: template.format(use_case=use_case, check_point=check_point)
        for key, template in templates.items()
    }


def make_hashtags(candidate: Candidate, hashtags: dict[str, list[str]]) -> str:
    tags = [*hashtags.get("base", []), *hashtags.get(candidate.genre, [])]
    deduped = list(dict.fromkeys(tags))[:8]
    return " ".join(deduped)


def render_markdown(
    target_date: date,
    today_genre: str,
    candidates: list[Candidate],
    templates: dict[str, str],
    hashtags: dict[str, list[str]],
    blocked_phrases: list[str],
) -> str:
    lines = [
        f"# 楽天ROOM 投稿候補 {target_date.isoformat()}",
        "",
        "## 今日の狙い",
        f"曜日ジャンル：{today_genre}",
        "狙い：候補作成と投稿文準備までを行い、最終投稿は楽天ROOM画面で手動確認します。",
        "",
        "---",
    ]

    for index, candidate in enumerate(candidates, start=1):
        posts = make_posts(candidate, templates)
        combined_text = " ".join(posts.values())
        lines.extend(
            [
                "",
                f"## {index}件目",
                f"商品名：{candidate.item_name}",
                f"URL：{candidate.item_url}",
                f"価格：{candidate.price if candidate.price is not None else '要手動確認'}円",
                f"レビュー：{candidate.review}",
                f"在庫：{candidate.stock}",
                f"選定理由：{candidate.reason}",
                f"向いている人：{candidate.target}",
                f"購入前の確認点：{candidate.check_points}",
                "",
                f"投稿文A：{posts.get('A', '')}",
                f"投稿文B：{posts.get('B', '')}",
                f"投稿文C：{posts.get('C', '')}",
                "",
                f"ハッシュタグ：{make_hashtags(candidate, hashtags)}",
                f"注意表現チェック：{safety_check(combined_text, blocked_phrases)}",
                "注意：価格・在庫・レビューは投稿直前に手動確認してください。",
                "",
                "---",
            ]
        )

    lines.extend(
        [
            "",
            "# 手動投稿チェックリスト",
            "- [ ] 楽天ROOMに自分でログインした",
            "- [ ] 商品ページで在庫を確認した",
            "- [ ] 価格が10,000円以内であることを確認した",
            "- [ ] レビューとショップを確認した",
            "- [ ] 投稿文に誇大表現がないことを確認した",
            "- [ ] 画像を無断保存・加工・アップロードしていない",
            "- [ ] 楽天ROOM画面で自分で投稿した",
            "",
            "※このファイルは投稿候補の整理用です。自動ログイン・自動投稿・スクレイピングは行っていません。",
        ]
    )
    return "\n".join(lines) + "\n"


def append_history(target_date: date, candidates: list[Candidate], history: list[dict[str, Any]]) -> list[dict[str, Any]]:
    for candidate in candidates:
        history.append(
            {
                "date": target_date.isoformat(),
                "item_name": candidate.item_name,
                "item_url": candidate.item_url,
                "genre": candidate.genre,
                "shop": candidate.shop,
                "status": "candidate",
                "reason": candidate.reason,
            }
        )
    return history


def main() -> None:
    args = parse_args()
    target_date = get_target_date(args.date)
    config = load_json(CONFIG_PATH, {})
    history = load_json(HISTORY_PATH, [])
    templates = load_json(TEMPLATES_PATH, {})
    hashtags = load_json(HASHTAGS_PATH, {})

    today_genre = get_weekday_genre(target_date, config)
    all_candidates = load_candidates(config, args.candidates)
    selected = select_candidates(all_candidates, history, config, today_genre)

    markdown = render_markdown(
        target_date,
        today_genre,
        selected,
        templates,
        hashtags,
        config["blocked_phrases"],
    )
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(markdown, encoding="utf-8")
    save_json(HISTORY_PATH, append_history(target_date, selected, history))

    print(f"{len(selected)}件の候補を作成しました: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

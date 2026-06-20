# 楽天ROOM 半自動投稿支援ツール

楽天ROOMへ自動投稿せず、候補作成・投稿文作成・履歴管理だけを行うローカル実行用ツールです。

## 使い方

```bash
python3 rakuten-room-helper/main.py
```

日付を指定する場合:

```bash
python3 rakuten-room-helper/main.py --date 2026-06-20
```

任意の商品候補JSONを使う場合:

```bash
python3 rakuten-room-helper/main.py --candidates path/to/candidates.json
```

## 安全方針

- 楽天ROOMへの自動ログイン、自動クリック、自動投稿は行いません。
- Cookie、パスワード、2段階認証情報は保存しません。
- 楽天市場ページの大量スクレイピングは行いません。
- 出力された候補は投稿前にユーザー本人が価格・在庫・レビュー・ショップを手動確認してください。

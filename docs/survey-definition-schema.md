# アンケート定義 JSON スキーマ（v2）

## トップレベル

| キー | 説明 |
|------|------|
| `id` | アンケート ID |
| `title` | 画面タイトル |
| `fields` | 設問の定義（ラベル・型・選択肢・繰り返しテンプレート） |
| `options` | 振る舞い（ドリルダウン・必須/任意・非表示・繰り返し） |

`presentation` / `settings.maxRepeatCount` は使わない。

---

## fields

設問の「中身」だけをフラット配列で持つ。

```json
{
  "id": "q1_main",
  "name": "q1_main",
  "type": "radio",
  "label": "問1. ...",
  "choices": [{ "value": "A", "label": "..." }]
}
```

| type | 追加プロパティ |
|------|----------------|
| `radio` / `checkbox` / `select` | `choices` |
| `text` | `placeholder?` |
| `number` | `placeholder?`, `min?` |
| `repeat` | `template[]`（セット内フィールド） |

繰り返しの上限は `fields` ではなく `options.repeat` に書く。

---

## options

### drilldown（ドリルダウン）

**トリガー設問 ID をキー**に、選択肢・値に応じた `show` を並べる。

```json
"drilldown": {
  "q1_main": [
    { "match": { "in": ["A", "D"] }, "show": ["q2_options"] },
    { "match": "A", "show": ["q3_category"] }
  ],
  "q2_options": [
    { "match": { "includes": "other" }, "show": ["q2_sub_reason", "q2_repeat_count"] }
  ],
  "q2_repeat_count": [
    { "match": { "gte": 1 }, "show": ["q2_repeat_block"] }
  ]
}
```

- `match`: 文字列（完全一致） / `{ in }` / `{ includes }` / `{ gte }`
- 成立したルールの `show` は和集合で表示

### rules（必須 / 任意 / 非表示のデフォルト）

表示されているときに適用するルール。

```json
"rules": {
  "q1_main": { "visibility": "always", "required": "required" },
  "q2_options": { "visibility": "hidden", "required": "required" }
}
```

| visibility | 意味 |
|------------|------|
| `always` | 常に表示（ルート設問） |
| `hidden` | 初期非表示。`drilldown` の `show` で初めて表示 |

| required | 意味 |
|----------|------|
| `required` | 表示中は必須 |
| `optional` | 表示中でも任意 |

※ 動的な非表示は `drilldown` が担う。`rules.visibility: hidden` は「ルート以外の初期状態」。

### repeat（繰り返し）

```json
"repeat": {
  "q2_repeat_block": {
    "countFrom": "q2_repeat_count",
    "maxCount": 10
  }
}
```

| キー | 説明 |
|------|------|
| `countFrom` | 件数を読む field id |
| `maxCount` | セット数の上限 |

---

## サンプルファイル

- JSON: `src/mocks/data/surveyDefinition.sample.json`
- TypeScript: `src/mocks/data/surveyDefinition.v2.ts`
- 型: `src/types/surveyDefinition.ts`

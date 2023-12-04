## 概要
勤怠管理OZO3の打刻を自動化するCloud Functionsスクリプトです。
このコードをCloud FunctionsにデプロイしHTTPトリガーにします。

## Cloud Functions要件
- 第一世代
- Node.js 16

## API仕様

```shell
curl -m 70 -X POST https://xxx.cloudfunctions.net/FUNCTION_NAME \
-H "Content-Type: application/json" \
-d '{
    "type": "start",
    "user_id": "xxxxxxx",
    "password": "xxxxxxx"
}'
```


AWS のサンプル

やりたいこと

s3 -> route53 -> cloudfront -> api gateway -> lambda -> dynamodb

api gateway, lambda, dynamodb は cloudformation で構築
事前に sam-aws-lambda を zip にして s3 にアップロードしておく
・バケット名：sam-template-stack
・キー名：src.zip

画面は s3 に静的ホスティングを有効にして「sam-aws-static」を格納する。

テーブル名は「url」にすること。

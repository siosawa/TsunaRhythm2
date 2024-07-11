# プラットフォームを指定
FROM --platform=linux/amd64 nginx:alpine

RUN apk add --no-cache curl
# インクルード用のディレクトリ内を削除
RUN rm -f /etc/nginx/conf.d/*
# nginx.confファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf
# Nginxをforeground起動
CMD ["nginx", "-g", "daemon off;"]

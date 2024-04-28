#!/bin/bash
# 上記はマジックコメントと呼ばれコンピュータが読み込む
# set -e はエラーが起きた時、一旦処理を中断させるコード
set -e

# server.pidが残っていると新たにサーバが起動できないエラーになるため削除
rm -f /back/tmp/pids/server.pid

# データベースの作成、マイグレーション、シードデータの投入
bundle exec rails db:create --trace
bundle exec rails db:migrate --trace
bundle exec rails db:seed --trace

# 本番環境の場合はアセットをプリコンパイル
if [ "${RAILS_ENV}" = "production" ]; then
  bundle exec rails assets:precompile
  # assets:creenはまだ使用されているアセットまで削除してしまうリスクがあるらしいので別の記述の方が良いかもしれない
  bundle exec rails assets:clean 
fi

bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0

# コマンドライン引数で指定されたコマンドを実行
exec "$@"

# #!/bin/sh
# if [ "${RAILS_ENV}" = "production" ]
# then
#   bundle exec rails assets:precompile
# fi
# bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0
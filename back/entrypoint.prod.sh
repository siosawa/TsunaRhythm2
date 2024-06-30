#!/bin/bash
set -ex

echo "Start entrypoint.prod.sh"

echo "Removing old server PID file if it exists..."
rm -f /myapp/tmp/pids/server.pid

# データベースの作成は、既に存在する場合に失敗する可能性があるため、エラーを無視するオプションを追加します
# echo "Creating database (if it doesn't exist)..."
# bundle exec rails db:create RAILS_ENV=production --trace || echo "Database creation failed, but continuing..."

echo "Running database migrations..."
bundle exec rails db:migrate RAILS_ENV=production --trace

# データベースシード処理が失敗した場合もエラーを無視するオプションを追加します
# echo "Seeding the database..."
# bundle exec rails db:seed RAILS_ENV=production --trace || echo "Database seeding failed, but continuing..."

echo "Starting Rails server with Puma..."
bundle exec puma -C config/puma.rb

# bundle exec rails s -p ${PORT:-3000} -b 0.0.0.0

# コマンドライン引数で指定されたコマンドを実行
exec "$@"

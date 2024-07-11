# frozen_string_literal: true

require 'logger'

# ロガーのセットアップ
logger = Logger.new(STDOUT)
logger.level = Logger::DEBUG

# 環境変数の取得
max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 7).to_i
min_threads_count = ENV.fetch('RAILS_MIN_THREADS', max_threads_count).to_i

# ログにスレッド数を出力
logger.info("Max Threads: #{max_threads_count}")
logger.info("Min Threads: #{min_threads_count}")

threads min_threads_count, max_threads_count

# 環境に応じてタイムアウトを設定
environment = ENV.fetch('RAILS_ENV', 'development')
worker_timeout 60 if environment == 'development'
worker_timeout 3600 if environment == 'production'
worker_timeout 60 if environment == 'test'

logger.info("Environment: #{environment}")

pidfile = ENV.fetch('PIDFILE', 'tmp/pids/server.pid')
logger.info("PID File: #{pidfile}")

workers_count = ENV.fetch('WEB_CONCURRENCY', 2).to_i
logger.info("Workers: #{workers_count}")

workers workers_count if workers_count > 1

preload_app!
plugin :tmp_restart

app_root = File.expand_path('..', __dir__)
socket_path = "unix://#{app_root}/tmp/sockets/puma.sock"
logger.info("Socket Path: #{socket_path}")

bind socket_path

# キューリクエストを有効にする
queue_requests true

on_worker_boot do
  logger.info("Worker booted, PID: #{Process.pid}")
end

before_fork do
  logger.info("Before fork, PID: #{Process.pid}")
end

after_worker_boot do
  logger.info("After worker boot, PID: #{Process.pid}")
end

on_restart do
  logger.info("On restart, PID: #{Process.pid}")
end

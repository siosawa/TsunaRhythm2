require 'redis'
require 'retryable'
require 'openssl'
require 'yaml'
require 'mock_redis'

# 既に$redisが設定されている場合は再設定を回避
$redis ||= begin
  Retryable.retryable(tries: 5, on: Redis::CannotConnectError, sleep: 3) do
    if Rails.env.test?
      # テスト環境の場合、MockRedisを使用
      redis = MockRedis.new
    elsif Rails.env.production?
      redis_host = ENV['REDIS_HOST'] || 'localhost'
      redis_port = (ENV['REDIS_PORT'] || 6379).to_i  # 環境変数がない場合、デフォルト値を使用

      ssl_params = {
        verify_mode: OpenSSL::SSL::VERIFY_NONE
      }

      redis = Redis.new(
        url: "rediss://#{redis_host}:#{redis_port}/0",
        ssl_params: ssl_params,
        connect_timeout: 15.0,  # 接続タイムアウトを15秒に設定
        read_timeout: 15.0,     # 読み込みタイムアウトを15秒に設定
        write_timeout: 15.0     # 書き込みタイムアウトを15秒に設定
      )
    else
      # 開発環境の場合
      redis_config = YAML.safe_load(File.read(Rails.root.join('config', 'cable.yml')), aliases: true)[Rails.env]
      redis = Redis.new(url: redis_config['url'])
    end

    begin
      redis.ping
    rescue => e
      raise
    end

    # グローバル変数として設定
    $redis = redis
  end
end

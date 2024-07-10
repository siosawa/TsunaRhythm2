require 'redis'
require 'retryable'
require 'openssl'

# 既に$redisが設定されている場合は再設定を回避
$redis ||= begin
  Retryable.retryable(tries: 5, on: Redis::CannotConnectError, sleep: 3) do
    redis_host = ENV['REDIS_HOST']
    redis_port = ENV['REDIS_PORT'].to_i  # 環境変数を整数に変換

    # REDIS_HOSTとREDIS_PORTの値をログ出力
    Rails.logger.info "REDIS_HOST: #{redis_host.inspect} (#{redis_host.class})"
    Rails.logger.info "REDIS_PORT: #{redis_port.inspect} (#{redis_port.class})"
    Rails.logger.info "Connecting to Redis at #{redis_host}:#{redis_port}"

    begin
      # Redis.newの開始ログ
      Rails.logger.info "Initializing Redis client with URL: rediss://#{redis_host}:#{redis_port}/0"

      ssl_params = {
        verify_mode: OpenSSL::SSL::VERIFY_NONE
      }

      # ssl_paramsの内容をログ出力
      ssl_params.each do |key, value|
        Rails.logger.info "SSL Param - #{key}: #{value} (#{value.class})"
      end

      redis = Redis.new(
        url: "rediss://#{redis_host}:#{redis_port}/0",
        ssl_params: ssl_params.transform_keys(&:to_sym).transform_values { |v| v.is_a?(String) ? v.to_i : v },
        connect_timeout: 15.0,  # 接続タイムアウトを15秒に設定
        read_timeout: 15.0,     # 読み込みタイムアウトを15秒に設定
        write_timeout: 15.0     # 書き込みタイムアウトを15秒に設定
      )

      # Redisクライアントのインスタンスが作成されたことをログ出力
      Rails.logger.info "Redis client initialized: #{redis.inspect}"

      redis.ping
      Rails.logger.info "Redis connection successful"
    rescue => e
      Rails.logger.error "Redis connection failed: #{e.message}"
      Rails.logger.error "REDIS_HOST: #{redis_host.inspect}, REDIS_PORT: #{redis_port.inspect}"
      Rails.logger.error "SSL Params: #{ssl_params.inspect}"
      Rails.logger.error e.backtrace.join("\n")
      raise
    end

    # グローバル変数として設定
    $redis = redis
  end
end

# frozen_string_literal: true

require 'active_support/core_ext/integer/time'

Rails.application.configure do
  # Action Cable設定
  config.action_cable.url = "wss://backend.tsunarhythm.com/cable"
  config.action_cable.allowed_request_origins = [
    'https://tsunarhythm.com',
    %r{\Ahttps://tsunarhythm.*\z},
    'https://backend.tsunarhythm.com',
    'http://tsunarhythm.com',
    %r{\Ahttp://tsunarhythm.*\z},
    'http://backend.tsunarhythm.com'
  ]
  config.action_cable.disable_request_forgery_protection = true

  config.cache_classes = true
  config.eager_load = true

  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  config.assets.compile = false

  config.active_storage.service = :amazon

  # Redisキャッシュの設定
  config.cache_store = :redis_cache_store, {
    url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT'].to_i}/0",
    namespace: 'cache',
    expires_in: 1.hour  # キャッシュの有効期限を設定
  }
  

  # ログレベルをdebugに設定
  config.log_level = :debug

  config.log_tags = [:request_id]

  config.action_mailer.perform_caching = false

  config.i18n.fallbacks = true

  config.active_support.deprecation = :notify
  config.active_support.disallowed_deprecation = :log
  config.active_support.disallowed_deprecation_warnings = []

  config.log_formatter = Logger::Formatter.new

  if ENV['RAILS_LOG_TO_STDOUT'].present?
    logger = ActiveSupport::Logger.new($stdout)
    logger.formatter = config.log_formatter
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end

  config.active_record.dump_schema_after_migration = false

  # セッションの設定
  config.session_store :redis_store, servers: [
    {
      host: ENV['REDIS_HOST'],
      port: ENV['REDIS_PORT'].to_i,
      db: 0,
      namespace: 'sessions'
    }
  ], expire_after: 1.day, secure: true, domain: :all, tld_length: 2
end

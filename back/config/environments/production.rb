# frozen_string_literal: true

require 'active_support/core_ext/integer/time'

Rails.application.configure do
  #httpsなら config.action_cable.url = 'ws://localhost:3000/cable' 
  # 本番環境のWebSocket URLを設定
  config.action_cable.url = 'wss://tsunarhythm.com/cable'
  config.action_cable.allowed_request_origins = ['https://tsunarhythm.com']

  config.cache_classes = true

  config.eager_load = true

  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  config.assets.compile = false

  config.active_storage.service = :local

  config.log_level = :info

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

  config.active_storage.service = :amazon

  config.middleware.use ActionDispatch::Session::CookieStore,
                        domain: :all,
                        tld_length: 2,
                        secure: true
end

# frozen_string_literal: true

require 'active_support/core_ext/integer/time'

Rails.application.configure do
  config.action_cable.url = 'ws://localhost:3000/cable'
  config.action_cable.allowed_request_origins = ['http://localhost:3000', 'http://localhost:8000']

  config.after_initialize do
    Bullet.enable = true
    # Bullet.alert         = true
    Bullet.bullet_logger = true
    Bullet.console = true
    # Bullet.growl         = true
    Bullet.rails_logger = true
    Bullet.add_footer = true
  end

  config.cache_classes = false

  config.eager_load = false

  config.consider_all_requests_local = true

  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  config.active_storage.service = :local

  config.action_mailer.raise_delivery_errors = false

  # 下記の2行を追加
  # host = "localhost:3000"                     # ローカル環境
  # config.action_mailer.default_url_options = { host: host, protocol: "http" }

  config.action_mailer.perform_caching = false

  config.active_support.deprecation = :log

  config.active_support.disallowed_deprecation = :raise

  config.active_support.disallowed_deprecation_warnings = []

  config.active_record.migration_error = :page_load

  config.active_record.verbose_query_logs = true

  config.assets.debug = true

  config.assets.quiet = true

  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  config.hosts << 'back'
end

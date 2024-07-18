# frozen_string_literal: true

require 'spec_helper'
require 'faker'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
abort('The Rails environment is running in production mode!') if Rails.env.production?
require 'rspec/rails'
require 'mock_redis'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  # FactoryBotのメソッドをインクルードする設定
  config.include FactoryBot::Syntax::Methods

  # Redisをモックする設定
  config.before do
    mock_redis = MockRedis.new
    allow(Redis).to receive(:new).and_return(mock_redis)
  end
end

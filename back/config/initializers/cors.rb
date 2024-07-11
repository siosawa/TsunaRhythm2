# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 'http://localhost:8000', 'https://tsunarhythm.com','wss://backend.tsunarhythm.com/cable'
    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true # クッキーを含める場合は true に設定
  end
end

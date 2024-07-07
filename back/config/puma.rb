# frozen_string_literal: true

max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 5)
min_threads_count = ENV.fetch('RAILS_MIN_THREADS', max_threads_count)
threads min_threads_count, max_threads_count

worker_timeout 3600 if ENV.fetch('RAILS_ENV', 'development') == 'development'

environment ENV.fetch('RAILS_ENV', ENV['RACK_ENV'] || 'production')

pidfile ENV.fetch('PIDFILE', 'tmp/pids/server.pid')
workers ENV.fetch('WEB_CONCURRENCY', 2)

preload_app!
plugin :tmp_restart

app_root = File.expand_path('..', __dir__)
bind "unix://#{app_root}/tmp/sockets/puma.sock"

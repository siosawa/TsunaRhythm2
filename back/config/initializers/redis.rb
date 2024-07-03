require 'redis'
require 'psych'

redis_config = Psych.safe_load(File.read(Rails.root.join('config', 'redis.yml')), aliases: true)[Rails.env]
$redis = Redis.new(url: redis_config['url'])

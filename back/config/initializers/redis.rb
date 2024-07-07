require 'redis'
require 'yaml'

redis_config = YAML.safe_load(File.read(Rails.root.join('config', 'redis.yml')), aliases: true)[Rails.env]
$redis = Redis.new(url: redis_config['url'])

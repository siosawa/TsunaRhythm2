FactoryBot.define do
  factory :relationship do
    follower factory: %i[user]
    followed factory: %i[user]
  end
end

FactoryBot.define do
  # associationを使って関連付け
  factory :relationship do
    follower factory: %i[user]
    followed factory: %i[user]
  end
end

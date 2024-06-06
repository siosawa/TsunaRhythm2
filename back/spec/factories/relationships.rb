FactoryBot.define do
    # associationを使って関連付け
    factory :relationship do
      association :follower, factory: :user
      association :followed, factory: :user
    end
end
  
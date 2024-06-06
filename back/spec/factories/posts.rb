FactoryBot.define do
  factory :post do
    user
    title   { Faker::Lorem.characters(number: 56) }
    content { Faker::Lorem.characters(number: 2050) }
  end
end

# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    user_id { 1 }
    company { 'MyString' }
    name { 'MyString' }
    work_type { 'MyString' }
    unit_price { 1 }
    quantity { 1 }
    is_completed { false }
  end
end

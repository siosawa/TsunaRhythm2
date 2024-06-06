FactoryBot.define do
  factory :user do
    name                  { Faker::Name.name }
    email                 { Faker::Internet.email }
    work                  { %w[ライター 動画編集 ITエンジニア SNSマーケティング].sample }
    profile_text          { Faker::Lorem.sentence }
    avatar                { Rack::Test::UploadedFile.new(Rails.root.join('app/assets/avatars/default.jpeg'), 'image/jpeg') }
    password              { 'password' }
    password_confirmation { 'password' }
  end
end

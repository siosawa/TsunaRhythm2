# frozen_string_literal: true

require 'faker'

# ユーザー作成メソッド
def create_user(name, email, work)
  user = User.find_or_initialize_by(email: email)
  if user.new_record?
    user.name = name
    user.password = 'foobar'
    user.password_confirmation = 'foobar'
    user.work = work

    # ランダムに1~25のアバターを設定
    avatar_number = rand(1..25)
    avatar_path = Rails.root.join("public/uploads/user/sample_avatar/#{avatar_number}.webp")

    # CarrierWaveを使ってアバターをアップロード
    if File.exist?(avatar_path)
      user.avatar = File.open(avatar_path)
    else
      puts "Avatar file not found: #{avatar_path}"
    end

    user.save!
  end

  user
end

# usersテーブルのサンプルデータ作成
create_user('さわた', 'sawata@example.com', '動画編集')
create_user('ゲスト', 'guest@example.com', 'バックエンドエンジニア')

user_count = 10
work_types = [
  'YouTube専門動画編集者', 'Shortsが得意な動画編集者', 'NFT・Web3専門ライター',
  'Webライター', 'ライター/動画編集者', 'フロントエンドエンジニア(主にReact)',
  'バックエンドエンジニア(主にRails)'
]

# Fakerの一意性をリセット
Faker::UniqueGenerator.clear

(1..user_count).each do |i|
  email = Faker::Internet.unique.email
  name = Faker::Name.unique.name
  work = work_types.sample

  create_user(name, email, work)
end

puts 'ユーザーが作成されました。'

# postsを作成
user_ids = User.pluck(:id) # DBに存在するユーザーIDを取得
user_ids.each do |user_id|
  15.times do
    Post.create!(
      user_id: user_id,
      title: Faker::Lorem.sentence(word_count: 5), # ランダムなタイトル
      content: Faker::Lorem.paragraph_by_chars(number: 1000, supplemental: false), # ランダムな1000文字のテキスト
      created_at: rand(3.months.ago..Time.now) # 過去3ヶ月以内のランダムな日付
    )
  end
end
puts "ポストデータが作成されました。"

# ランダムに六人をフォローする(relationshipテーブルの作成)
user_ids.each do |follower_id|
  potential_followees = user_ids - [follower_id]
  followees = potential_followees.sample(6)
  followees.each do |followed_id|
    Relationship.find_or_create_by!(
      follower_id: follower_id,
      followed_id: followed_id
    )
  end
end
puts "フォローデータが作成されました。"

# projectsテーブルのサンプルデータ作成
unit_price_range = (1000..10000).to_a
quantity_range = (2..15).to_a
companies = ["三和農業株式会社", "ネットワークエキスパーツ株式会社", "東日本電力株式会社", "テクノロジーイノベーターズ株式会社", "教育支援株式会社", "サポートスペシャリスツ株式会社", "都市開発株式会社", "第一不動産株式会社", "マーケティンググルーズ株式会社", "未来技術研究所"]
project_names = ["ウェブ開発プロジェクト", "モバイルアプリデザイン", "ビジネスコンサルティング", "デジタルマーケティングキャンペーン", "ITサポートサービス", "クラウドインフラ構築", "データ分析プロジェクト"]
project_work_types = ["開発", "デザイン", "コンサルティング", "マーケティング", "サポート"]

user_ids.each do |user_id|
  project_count = rand(7..13)  # 各ユーザーに対して7から13のプロジェクトをランダムに作成
  project_count.times do |i|
    created_at = rand(3.months.ago.to_f..Time.now.to_f).to_i
    Project.create!(
      user_id: user_id,
      company: companies.sample,
      name: project_names.sample,
      work_type: project_work_types.sample,
      unit_price: unit_price_range.sample,
      quantity: quantity_range.sample,
      is_completed: i < project_count / 2 ? false : true,  # 半分はfalse、半分はtrueに設定
      created_at: Time.at(created_at)
    )
  end
end

puts "プロジェクトデータが作成されました。"

# recordsテーブルのサンプルデータ作成
user_ids.each do |user_id|
  user = User.find(user_id)
  projects = user.projects

  projects.each do |project|
    record_count = rand(5..10)  # 各プロジェクトに対して5から10のレコードをランダムに作成
    record_count.times do
      minutes = rand(30..120)  # ランダムに30から120の間で時間を設定
      date = rand(3.months.ago..Time.now)  # ランダムに過去3ヶ月以内の日付を設定
      work_end = rand < 0.7 ? date + minutes.minutes : nil  # 7割はdateからminutes分だけ進んだ日付、3割はnullを設定

      begin
        Record.create!(
          user_id: user_id,
          project_id: project.id,
          minutes: minutes,
          date: date,
          work_end: work_end
        )
      rescue => e
        puts "Error creating record for user_id #{user_id}, project_id #{project.id}: #{e.message}"
      end
    end
  end
end

puts "レコードデータが作成されました。"

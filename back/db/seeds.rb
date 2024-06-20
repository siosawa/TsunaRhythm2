# frozen_string_literal: true

# usersテーブルのサンプルデータ作成
# ユーザーの作成
User.create(name: "さわた", email: "sawata@example.com", password: "foobar", password_confirmation: "foobar", work: "動画編集")
User.create(name: "ゲスト", email: "guest@example.com", password: "foobar", password_confirmation: "foobar", work: "バックエンドエンジニア")

# user1 から user10 を作成する
user_count = 30
work_types = ["YouTube専門動画編集者", "Shortsが得意な動画編集者", "NFT・Web3専門ライター", "Webライター", "ライター/動画編集者", "フロントエンドエンジニア(主にReact)", "バックエンドエンジニア(主にRails)"]

(1..user_count).each do |i|
  email = "user#{i}@example.com"
  name = "user#{i}"
  work = work_types[i % work_types.size]
  
  User.create(name: name, email: email, password: "foobar", password_confirmation: "foobar", work: work)
end

puts "ユーザーが作成されました。"

# projectsテーブルのサンプルデータ作成
unit_price_range = (1000..10000).to_a
quantity_range = (2..15).to_a
user_ids = (1..10).to_a
companies = ["三和農業株式会社", "ネットワークエキスパーツ株式会社", "東日本電力株式会社", "テクノロジーイノベーターズ株式会社", "教育支援株式会社", "サポートスペシャリスツ株式会社", "都市開発株式会社", "第一不動産株式会社", "マーケティンググルーズ株式会社", "未来技術研究所"]
project_names = ["ウェブ開発プロジェクト", "モバイルアプリデザイン", "ビジネスコンサルティング", "デジタルマーケティングキャンペーン", "ITサポートサービス", "クラウドインフラ構築", "データ分析プロジェクト"]
work_types = ["開発", "デザイン", "コンサルティング", "マーケティング", "サポート"]

user_ids.each do |user_id|
  project_count = rand(7..21)  # 各ユーザーに対して7から21のプロジェクトをランダムに作成
  project_count.times do |i|
    created_at = rand(3.months.ago.to_f..Time.now.to_f).to_i
    Project.create!(
      user_id: user_id,
      company: companies.sample,
      name: project_names.sample,
      work_type: work_types.sample,
      unit_price: unit_price_range.sample,
      quantity: quantity_range.sample,
      is_completed: i < project_count / 2 ? false : true,  # 半分はfalse、半分はtrueに設定
      created_at: Time.at(created_at)
    )
  end
end

puts "サンプルデータが作成されました。"

# recrodsテーブルのサンプルデータ作成(userIdが1~10)
(1..10).each do |user_id|
    user = User.find(user_id)
    projects = user.projects
    
    projects.each do |project|
      record_count = rand(5..15)  # 各プロジェクトに対して5から15のレコードをランダムに作成
      record_count.times do
        Record.create!(
          user_id: user_id,
          project_id: project.id,
          minutes: rand(30..120),  # ランダムに30から120の間で時間を設定
          date: rand(3.months.ago..Time.now)  # ランダムに過去3ヶ月以内の日付を設定
        )
      end
    end
  end
  
  puts "サンプルデータが作成されました。"

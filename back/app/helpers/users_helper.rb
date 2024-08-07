# frozen_string_literal: true

module UsersHelper
  # Strong Parameters: Userモデルの安全なパラメータを許可する
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :work, :profile_text, :avatar)
  end

  # ユーザー情報をJSON形式で返す
  def user_info_json(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      following: user.following.count,
      followers: user.followers.count,
      posts_count: user.posts.count,
      work: user.work,
      profile_text: user.profile_text,
      avatar: user.avatar
    }
  end

  # 未認証時のエラーレスポンスを返す
  def render_unauthorized
    render json: { error: 'ログインしていません' }, status: :unauthorized
  end

  # ユーザーのリストをページネーションする
  def paginate_index(users, per_page, page)
    total_users = users.length
    paginated_users = users.limit(per_page).offset((page - 1) * per_page)
    total_pages = (total_users.to_f / per_page).ceil

    [paginated_users, total_pages]
  end

  # 投稿数、フォロワー数、フォロー数を含むユーザー情報を取得する
  def fetch_users_with_counts
    User
      .select('users.id, users.name, users.created_at, users.work, users.profile_text, users.avatar,
                 COUNT(posts.id) AS posts_count,
                 (SELECT COUNT(1) FROM relationships WHERE relationships.followed_id = users.id) AS followers_count,
                 (SELECT COUNT(1) FROM relationships WHERE relationships.follower_id = users.id) AS following_count')
      .left_joins(:posts)
      .group('users.id, users.name, users.created_at, users.work, users.profile_text, users.avatar')
  end

  # 特定のリレーションシップを持つユーザーをページネーションして返す
  def paginate_relationships(relationship_type, relationship_model, foreign_key)
    per_page = 10
    page = params[:page]&.to_i

    user = User.find(params[:id])
    relationships = fetch_relationships(user, relationship_type, relationship_model, foreign_key)

    total_users = relationships.size
    (total_users.to_f / per_page).ceil

    paginated_users, total_pages, page = cal_paginate_relationships(relationships, page, per_page)

    render json: {
      users: paginated_users,
      total_pages:, # 変数名を正しく挿入
      current_page: page
    }
  end

  # 特定のリレーションシップ情報を取得する
  def fetch_relationships(user, relationship_type, relationship_model, foreign_key)
    user.send(relationship_type).includes(relationship_model).map do |related_user|
      relationship = find_relationship(user, relationship_model, foreign_key, related_user)
      build_relationship_data(related_user, relationship)
    end
  end

  # ユーザーとリレーションシップの情報を見つける
  def find_relationship(user, relationship_model, foreign_key, related_user)
    user.send(relationship_model).find_by(foreign_key => related_user.id)
  end

  # リレーションシップに基づいたユーザー情報を構築する
  def build_relationship_data(related_user, relationship)
    {
      id: related_user.id,
      name: related_user.name,
      work: related_user.work,
      profile_text: related_user.profile_text,
      avatar: build_avatar_data(related_user),
      relationship_id: relationship&.id,
      followers_count: related_user.followers.count,
      following_count: related_user.following.count,
      posts_count: related_user.posts.count
    }
  end

  # アバターのデータを構築する
  def build_avatar_data(related_user)
    { url: related_user.avatar.to_s }
  end

  # リレーションシップのページネーションを計算する
  def cal_paginate_relationships(relationships, page, per_page)
    if page
      paginated_users = relationships.slice((page - 1) * per_page, per_page)
      total_pages = (relationships.size.to_f / per_page).ceil
    else
      paginated_users = relationships
      total_pages = 1
      page = 1
    end

    [paginated_users, total_pages, page]
  end
end

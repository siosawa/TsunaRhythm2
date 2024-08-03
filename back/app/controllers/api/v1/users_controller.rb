# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      include UsersHelper

      before_action :logged_in_user, only: %i[index update destroy following followers update_password]
      before_action :correct_user, only: %i[update destroy update_password]

      # ユーザー一覧をページネーションして返す
      def index
        per_page = 10
        page = params[:page]&.to_i || 1

        users = fetch_users_with_counts
        paginated_users, total_pages = paginate_index(users, per_page, page)

        render json: {
          users: paginated_users.as_json(only: %i[id name created_at work profile_text avatar],
                                         methods: %i[posts_count followers_count following_count]),
          total_pages:,
          current_page: page
        }
      end

      # 指定したIDのユーザー情報を返す
      def show
        @user = fetch_users_with_counts.find(params[:id].to_i)
        render json: @user.as_json(
          except: %i[email password_digest]
        )
      end

      # 新しいユーザーを作成する
      def create
        @user = User.new(user_params)
        assign_avatar(@user)

        if @user.save
          render json: { message: 'ユーザーが正常に作成されました', user: @user }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザー情報を更新する
      def update
        @user = User.find(params[:id].to_i)
        if @user.update(user_params)
          render json: { message: 'ユーザー情報の更新に成功しました', user: @user }, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザーを削除する
      def destroy
        user = User.find_by(id: params[:id].to_i)
        if user.nil?
          render json: { message: 'ユーザーが見つかりませんでした' }, status: :not_found
          return
        end
        if user.destroy
          render json: { message: 'ユーザーを削除しました' }, status: :ok
        else
          render json: { message: 'ユーザーの削除に失敗しました' }, status: :unprocessable_entity
        end
      end

      # パスワードを変更する
      def update_password
        if current_user.authenticate(params[:current_password])
          if current_user.update(password: params[:new_password])
            render json: { message: 'パスワードが正常に更新されました', user: current_user }, status: :ok
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { errors: ['現在のパスワードが間違っています'] }, status: :unprocessable_entity
        end
      end

      # フォローしているユーザーを返す
      def following
        paginate_relationships(:following, :active_relationships, :followed_id)
      end

      # フォロワーを返す
      def followers
        paginate_relationships(:followers, :passive_relationships, :follower_id)
      end

      # ログインしているユーザー情報を返す
      def current_user_info
        if logged_in?
          render json: user_info_json(current_user)
        else
          render_unauthorized
        end
      end

      # ログインしているユーザーの投稿を返す
      def current_user_posts
        if logged_in?
          render json: {
            posts: current_user.posts
          }
        else
          render json: { error: 'ログインしていません' }, status: :unauthorized
        end
      end

      private

      # ユーザーのアバターを設定する
      def assign_avatar(user)
        return if user.avatar.present?

        begin
          user.avatar = File.open(Rails.public_path.join('uploads', 'user', 'sample_avatar', "#{rand(1..25)}.webp"))
        rescue StandardError => e
          Rails.logger.error("アバター画像の設定に失敗しました: #{e.message}")
          # アバター画像が設定できなくてもエラーにはしない
        end
      end

      # ユーザーがログインしているか確認する
      def correct_user
        @user = User.find_by(id: params[:id].to_i)
        return if current_user?(@user)

        render json: { status: 'failure', message: '不正なアクセスです' }, status: :forbidden
      end
    end
  end
end

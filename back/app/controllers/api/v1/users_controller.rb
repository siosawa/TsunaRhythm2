# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      include UsersHelper

      before_action :logged_in_user, only: %i[index update destroy following followers update_password]
      before_action :correct_user, only: %i[update destroy update_password]

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

      def show
        @user = fetch_users_with_counts.find(params[:id])
        render json: @user.as_json(
          except: %i[email password_digest]
        )
      end

      def create
        @user = User.new(user_params)
        if @user.save
          render json: { message: 'ユーザーが正常に作成されました', user: @user }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @user = User.find(params[:id])
        if @user.update(user_params)
          render json: { message: 'ユーザー情報の更新に成功しました', user: @user }, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        user = User.find_by(id: params[:id])
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

      # パスワード変更アクション
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

      def following
        paginate_relationships(:following, :active_relationships, :followed_id)
      end

      def followers
        paginate_relationships(:followers, :passive_relationships, :follower_id)
      end

      def current_user_info
        if logged_in?
          render json: user_info_json(current_user)
        else
          render_unauthorized
        end
      end

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

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :work, :profile_text, :avatar)
      end

      def correct_user
        @user = User.find_by(id: params[:id])
        return if current_user?(@user)

        render json: { status: 'failure', message: '不正なアクセスです' }, status: :forbidden
      end
    end
  end
end

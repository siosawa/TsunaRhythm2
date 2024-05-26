module Api
  module V1
    class UsersController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper

      before_action :logged_in_user, only: %i[index edit update destroy following followers]
      before_action :correct_user, only: %i[edit update destroy]

      def index
        @users = User.all
        render json: @users
      end
      

      def show
        Rails.logger.info 'users_controllerのshowアクションを実行しようとしています'
        @user = User.find(params[:id])
        render json: @user
      end

      def create
        Rails.logger.info 'ユーザー作成処理を開始します。'
        @user = User.new(user_params)
        if @user.save
          Rails.logger.info "ユーザー(ID: #{@user.id})が正常に保存されました。"
          render json: { message: 'ユーザーが正常に作成されました', user: @user }, status: :created
        else
          Rails.logger.warn 'ユーザーの保存に失敗しました。'
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        Rails.logger.info 'users_controllerのupdateアクションを実行しようとしています'
        @user = User.find(params[:id])
        if @user.update(user_params)
          Rails.logger.info 'ユーザー情報の更新に成功しました。'
          render json: { message: 'ユーザー情報の更新に成功しました', user: @user }, status: :ok
        else
          Rails.logger.info 'ユーザー情報の更新に失敗しました。'
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        Rails.logger.info 'users_controllerのdestroyアクションを実行しようとしています'
        user = User.find_by(id: params[:id])

        if user.nil?
          Rails.logger.info 'ユーザーが見つかりませんでした。'
          render json: { message: 'ユーザーが見つかりませんでした' }, status: :not_found
          return
        end

        if user.destroy
          Rails.logger.info 'ユーザーを削除しました。'
          render json: { message: 'ユーザーを削除しました' }, status: :ok
        else
          Rails.logger.info 'ユーザーの削除に失敗しました。'
          render json: { message: 'ユーザーの削除に失敗しました' }, status: :unprocessable_entity
        end
      end

      def following
        user = User.find(params[:id])
        following_users = user.following.includes(:active_relationships).map do |followed_user|
          relationship = user.active_relationships.find_by(followed_id: followed_user.id)
          followed_user.attributes.merge(relationship_id: relationship.id)
        end
        render json: following_users
      end

      def followers
        user = User.find(params[:id])
        followers = user.followers
        render json: followers
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end

      # /diarysで取得するデータ
      # def posts_user_info
      #   users = User.all.select(:id, :name)
      #     render json: {
      #     users: users,
      #     current_user: {
      #       id: current_user.id,
      #     }
      #   }
      # end

      # マイページで取得するデータ
      def current_user_info
        if logged_in?
          render json: {
            id: current_user.id,
            name: current_user.name,
            email: current_user.email,
            following: current_user.following.count,
            followers: current_user.followers.count,
            posts: current_user.posts
          }
        else
          render json: { error: 'ログインしていません' }, status: :unauthorized
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def correct_user
        @user = User.find_by(id: params[:id])
        unless current_user?(@user)
          render json: { status: 'failure', message: '不正なアクセスです' }, status: :forbidden
        end
      end
    end
  end
end

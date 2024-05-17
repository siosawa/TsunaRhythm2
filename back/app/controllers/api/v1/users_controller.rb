module Api
  module V1
    class UsersController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper

      before_action :logged_in_user, only: %i[index edit update destroy following followers]
      before_action :correct_user, only: %i[edit update]
      before_action :admin_user, only: :destroy

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
        Rails.logger.info 'users_controllerのfollowingアクションを実行しようとしています'
        @user = User.find(params[:id])
        @users = @user.following.paginate(page: params[:page])
        render json: @users
      end

      def followers
        Rails.logger.info "#{params[:id]}番のユーザーのfollowersアクションを実行しようとしています"
        @user = User.find(params[:id])
        @users = @user.followers.paginate(page: params[:page])
        render json: @users
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def correct_user
        @user = User.find(params[:id])
        redirect_to(root_url, status: :see_other) unless current_user?(@user)
      end

      def admin_user
        redirect_to(root_url, status: :see_other) unless current_user.admin?
      end
    end
  end
end

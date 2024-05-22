module Api
  module V1
    class RelationshipsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user

      def create
        Rails.logger.info 'RelationshipsControllerのcreateアクションが実行されようとしています。'
        @user = User.find(params[:followed_id])
        if current_user.follow(@user)
          Rails.logger.info "ユーザー(ID: #{current_user.id})がユーザー(ID: #{@user.id})をフォローしました。"
          render json: { message: 'フォローに成功しました', followed_id: @user.id, follower_id: current_user.id }, status: :created
        else
          render json: { error: 'フォローに失敗しました' }, status: :unprocessable_entity
        end
      end

      def destroy
        Rails.logger.info 'RelationshipsControllerのdestroyアクションが実行されようとしています。'
        relationship = Relationship.find(params[:id])
        @user = relationship.followed
        if current_user.unfollow(@user)
          Rails.logger.info "ユーザー(ID: #{current_user.id})がユーザー(ID: #{@user.id})をフォロー解除しました。"
          render json: { message: 'フォロー解除に成功しました', unfollowed_id: @user.id, unfollower_id: current_user.id }, status: :ok
        else
          render json: { error: 'フォロー解除に失敗しました' }, status: :unprocessable_entity
        end
      end
    end
  end
end

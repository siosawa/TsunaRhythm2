module Api
  module V1
    class RelationshipsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user

      def create
        Rails.logger.info "フォロー操作を開始: current_user.id=#{current_user.id}, followed_id=#{params[:followed_id]}"
        @user = User.find_by(id: params[:followed_id])
        @relationship = current_user.active_relationships.build(followed_id: @user.id)
        if @relationship.save
          Rails.logger.info "フォローが成功しました: relationship.id=#{@relationship.id}"
          render_relationship_status('create')
        else
          Rails.logger.error "フォローに失敗しました: #{@relationship.errors.full_messages}"
          render json: { status: 'failure', message: 'Unable to follow user' }, status: :unprocessable_entity
        end
      end

      def destroy
        Rails.logger.info "フォロー解除操作を開始: current_user.id=#{current_user.id}, relationship_id=#{params[:id]}"
        @relationship = current_user.active_relationships.find(params[:id])
        if @relationship
          @relationship.destroy
          Rails.logger.info "フォロー解除が成功しました: relationship.id=#{@relationship.id}"
          render_relationship_status('destroy')
        else
          Rails.logger.error "フォロー解除に失敗しました: relationship_id=#{params[:id]}が見つかりません"
          render json: { status: 'failure', message: 'Relationship not found' }, status: :not_found
        end
      end

      private

      def render_relationship_status(action)
        count = @relationship.followed.followers.size
        following = current_user.following?(@relationship.followed)
        message = [I18n.t("relationships.#{action}.flash.success")]

        render json: {
          status: 'success',
          message: message,
          count: count,
          following: following,
          relationship_id: @relationship.id
        }
      end
    end
  end
end

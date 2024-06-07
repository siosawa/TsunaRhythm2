module Api
  module V1
    class RelationshipsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user

      def create
        Rails.logger.info "フォロー操作を開始: current_user.id=#{current_user.id}, followed_id=#{params[:followed_id]}"
        @user = find_user(params[:followed_id])
        return render json: { status: 'failure', message: 'ユーザーが見つかりません' }, status: :not_found unless @user

        @relationship = build_relationship(@user)
        if @relationship.save
          Rails.logger.info "フォローが成功しました: relationship.id=#{@relationship.id}"
          render json: { status: 'success', relationship_id: @relationship.id }, status: :created
        else
          log_and_render_error('ユーザーをフォローできません', @relationship.errors.full_messages.join(', '))
        end
      end

      def destroy
        Rails.logger.info "フォロー解除操作を開始: current_user.id=#{current_user.id}, relationship_id=#{params[:id]}"
        @relationship = current_user.active_relationships.find_by(id: params[:id])
        if @relationship
          @relationship.destroy
          Rails.logger.info "フォロー解除が成功しました: relationship.id=#{@relationship.id}"
          render_relationship_status('destroy')
        else
          log_and_render_error('関係が見つかりません', "relationship_id=#{params[:id]}が見つかりません")
        end
      end

      private

      def render_relationship_status(action)
        following = current_user.following?(@relationship.followed)
        message = action == 'create' ? 'フォローが成功しました' : 'フォロー解除が成功しました'
        render json: {
          status: 'success',
          following:,
          relationship_id: @relationship.id,
          message:
        }, status: :ok
      end

      def find_user(id)
        User.find_by(id:)
      end

      def build_relationship(user)
        current_user.active_relationships.build(followed_id: user.id)
      end

      def log_and_render_error(message, errors)
        Rails.logger.error "#{message}: #{errors}"
        render json: { status: 'failure', message: }, status: :unprocessable_entity
      end
    end
  end
end

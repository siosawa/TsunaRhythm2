module Api
  module V1
    class PostsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user, only: %i[create destroy update]
      before_action :correct_user, only: %i[destroy update]

      def index
        @posts = Post.all
        render json: @posts
      end

      def show
        @post = Post.find(params[:id])
        render json: @post
      end

      def create
        @post = current_user.posts.build(post_params)
        if @post.save
          message = [I18n.t('posts.create.flash.success')]
          render json: { status: 'success', message: message }, status: :created
        else
          message = @post.errors.full_messages
          render json: { status: 'failure', message: message }, status: :unprocessable_entity
        end
      end

      def update
        @post = Post.find(params[:id])
        if @post.update(post_params)
          render json: @post
        else
          render json: @post.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @post = Post.find(params[:id])
        @post.destroy
        Rails.logger.info "ポストが削除されました。ユーザーID: #{current_user.id}"
        render json: { status: 'success', message: 'ポストが削除されました' }
      end

      private

      def post_params
        params.require(:post).permit(:title, :content )
      end

      def correct_user
        @post = current_user.posts.find_by(id: params[:id])
        render json: { error: '許可されていません' }, status: :forbidden if @post.nil?
      end

      def logged_in_user
        unless logged_in?
          Rails.logger.info '未ログインユーザーがログインが必要なページにアクセスしようとしました。'
          render json: { status: 'notLoggedIn', message: 'ログインしてください' }, status: :unauthorized
        end
      end
    end
  end
end

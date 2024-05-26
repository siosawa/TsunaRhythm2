module Api
  module V1
    class PostsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user, only: %i[create destroy update]
      before_action :correct_user, only: %i[destroy update]
      
      def index
        if params[:user_id]
          begin
            @user = User.find(params[:user_id])
            @posts = @user.posts.includes(:user).to_a  # @userの投稿を取得し、ユーザー情報を含めて配列に変換
          rescue ActiveRecord::RecordNotFound => e
            render json: { error: "User not found: #{e.message}" }, status: :not_found
            return
          end
        else
          @posts = Post.includes(:user).to_a  # 全ての投稿を取得し、ユーザー情報を含めて配列に変換
        end
    
        # Kaminari.paginate_arrayを使用してページネーション対応にする
        @posts = Kaminari.paginate_array(@posts).page(params[:page]).per(5)  # 配列に対してページネーションを適用、1ページあたり1件
    
        render json: {
          posts: @posts.as_json(include: { user: { only: [:name] } }),  # ユーザー名を含む投稿データをJSON形式で返す
          current_page: @posts.current_page,  # 現在のページ番号を返す
          total_pages: @posts.total_pages  # 全ページ数を返す
        }
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

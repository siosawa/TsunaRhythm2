module Api
  module V1
    class PostsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user, only: :destroy

      def index
        @posts = Post.all
        render json: @posts
      end

      def show
        @post = Post.find(params[:id])
        render json: @post
      end

      def create
        Rails.logger.info 'posts_controllerのcreateアクションが実行されようとしています。'
        @post = current_user.posts.build(post_params)
        @post.image.attach(params[:post][:image])
        if @post.save
          flash[:success] = I18n.t('posts.create.flash.success')
          redirect_to post_path(@post)
          Rails.logger.info "ポストが作成されました。ユーザーID: #{current_user.id}, ポスト内容: #{@post.content}"
        else
          @feed_items = current_user.feed.paginate(page: params[:page])
          render 'posts/new', status: :unprocessable_entity
          Rails.logger.info "ポストの保存に失敗しました。ユーザーID: #{current_user.id}"
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
        # ログ出力のため一時保存
        @post.destroy
        flash[:success] = I18n.t('posts.destroy.flash.success')
        Rails.logger.info "ポストが削除されました。ユーザーID: #{current_user.id}"
        if request.referer.nil?
          Rails.logger.info "リファラーが存在しないため、ルートURLにリダイレクトします。ユーザーID: #{current_user.id}"
          redirect_to root_url, status: :see_other
        else
          Rails.logger.info "前のページ（リファラー: #{request.referer}）にリダイレクトします。ユーザーID: #{current_user.id}"
          redirect_to request.referer, status: :see_other
        end
      end

      private

      def post_params
        params.require(:post).permit(:content)
      end

      def correct_user
        @post = current_user.posts.find_by(id: params[:id])
        redirect_to root_url, status: :see_other if @post.nil?
        Rails.logger.info "ポストが見つかりません。ユーザーID: #{current_user.id}, 指定されたID: #{params[:id]}"
      end

      # ログイン済みユーザーかどうか確認
      def logged_in_user
        if logged_in?
          Rails.logger.info 'ログイン済みユーザーによるアクセスが確認されました。'
        else
          Rails.logger.info '未ログインユーザーがログインが必要なページにアクセスしようとしました。login_pathへリダイレクトします。'
          flash[:danger] = I18n.t('sessions.flash.danger')
          redirect_to login_path
        end
      end
    end
  end
end

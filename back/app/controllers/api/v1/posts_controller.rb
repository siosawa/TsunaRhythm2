module Api
  module V1
    class PostsController < ApplicationController
      def index
        @posts = Post.all
        render json: @posts
      end

      def show
        @post = Post.find(params[:id])
        render json: @post
      end

      def create
        @post = Post.new(post_params)
        @mpost.image.attach(params[:post][:image])

        if @post.save
          render json: @post, status: :created
        else
          render json: @post.errors, status: :unprocessable_entity
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
        if @post.destroy
          head :no_content
        else
          render json: @post.errors, status: :unprocessable_entity
        end
      end

      private

      def post_params
        params.require(:post).permit(:title, :content, :image)
      end

      def correct_user
        @post = current_user.posts.find_by(id: params[:id])
        redirect_to root_url, status: :see_other if @post.nil?
      end
    end
  end
end

module Api
  module V1
    class UsersController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper

      before_action :logged_in_user, only: %i[index edit update destroy following followers update_password]
      before_action :correct_user, only: %i[edit update destroy update_password]

      def index
        per_page = 10
        page = params[:page].to_i > 0 ? params[:page].to_i : 1
        
        users = User
                  .select('users.id, users.name, users.created_at, COUNT(posts.id) AS posts_count, users.work, users.profile_text,users.avatar')
                  .left_joins(:posts)
                  .group('users.id, users.name, users.created_at, users.work, users.profile_text,users.avatar')
                  .limit(per_page)
                  .offset((page - 1) * per_page)
      
        total_users = User.count
        total_pages = (total_users.to_f / per_page).ceil
      
        render json: {
          users: users.as_json(only: [:id, :name, :created_at, :work, :profile_text, :avatar], methods: [:posts_count]),
          total_pages: total_pages,
          current_page: page
        }
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
          render json: {
            id: current_user.id,
            name: current_user.name,
            email: current_user.email,
            following: current_user.following.count,
            followers: current_user.followers.count,
            # posts: current_user.posts,
            posts_count: current_user.posts.count,
            work: current_user.work,
            profile_text: current_user.profile_text,
            avatar: current_user.avatar
          }
        else
          render json: { error: 'ログインしていません' }, status: :unauthorized
        end
      end

      def current_user_posts
        if logged_in?
          render json: {
            posts: current_user.posts,
          }
        else
          render json: { error: 'ログインしていません' }, status: :unauthorized
        end 
      end

      private

      def paginate_relationships(relationship_type, relationship_model, foreign_key)
        per_page = 10
        page = params[:page].to_i > 0 ? params[:page].to_i : 1

        user = User.find(params[:id])
        relationships = user.send(relationship_type).includes(relationship_model).map do |related_user|
          relationship = user.send(relationship_model).find_by(foreign_key => related_user.id)
          related_user.attributes.merge(relationship_id: relationship.id)
        end

        total_users = relationships.size
        total_pages = (total_users.to_f / per_page).ceil
        paginated_users = relationships.slice((page - 1) * per_page, per_page)

        render json: {
          users: paginated_users,
          total_pages: total_pages,
          current_page: page
        }
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :work, :profile_text, :avatar)
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

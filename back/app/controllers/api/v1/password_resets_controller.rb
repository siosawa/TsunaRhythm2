# module Api
#   module V1
#     class PasswordResetsController < ApplicationController
#       before_action :get_user, only: %i[edit update]
#       before_action :valid_user, only: %i[edit update]
#       before_action :check_expiration, only: %i[edit update]

#       def edit; end

#       def create
#         @user = User.find_by(email: params[:password_reset][:email].downcase)
#         if @user
#           @user.create_reset_digest
#           @user.send_password_reset_email
#           render json: { message: 'パスワードリセットの手順が記載されたメールを送信しました。' }, status: :ok
#         else
#           render json: { error: 'メールアドレスが見つかりません。' }, status: :unprocessable_entity
#         end
#       end

#       def update
#         if params[:user][:password].empty?
#           render json: { error: 'パスワードを入力してください。' }, status: :unprocessable_entity
#         elsif @user.update(user_params)
#           reset_session
#           log_in @user
#           render json: { message: 'パスワードがリセットされました。', user: @user }, status: :ok
#         else
#           render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
#         end
#       end

#       private

#       def user_params
#         params.require(:user).permit(:password, :password_confirmation)
#       end

#       # beforeフィルタ

#       def get_user
#         @user = User.find_by(email: params[:email])
#       end

#       # 有効なユーザーかどうか確認する
#       def valid_user
#         return if @user && @user.activated? && @user.authenticated?(:reset, params[:id])

#         render json: { error: '無効なユーザーです。' }, status: :unprocessable_entity
#       end

#       # トークンが期限切れかどうか確認する
#       def check_expiration
#         return unless @user.password_reset_expired?

#         render json: { error: 'パスワードリセットの有効期限が切れています。' }, status: :unprocessable_entity
#       end
#     end
#   end
# end

# frozen_string_literal: true

module Api
  module V1
    class SessionsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper

      def create
        user = User.find_by(email: params[:session][:email].downcase)

        if user&.authenticate(params[:session][:password])
          reset_session
          remember(user)
          log_in(user)
          render json: { message: 'ログインに成功しました。', user: user.as_json(only: %i[id email]) }, status: :ok
        else
          render json: { error: 'ログインに失敗しました。' }, status: :unprocessable_entity
        end
      end

      def destroy
        if logged_in?
          log_out
          render json: { message: 'ログアウトに成功しました。' }, status: :ok
        else
          render json: { error: 'ユーザーはログインしていません。' }, status: :unprocessable_entity
        end
      end
    end
  end
end

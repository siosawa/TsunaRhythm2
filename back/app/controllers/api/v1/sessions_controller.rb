module Api
  module V1
    class SessionsController < ApplicationController
      def create
        Rails.logger.info 'Sessions_Controllerのcreateアクションが呼び出されました。'
        user = User.find_by(email: params[:session][:email].downcase)

        if user&.authenticate(params[:session][:password])
          reset_session
          log_in user
          render json: { message: 'ログインに成功しました。', user: }, status: :ok
        else
          render json: { error: I18n.t('sessions.create.flash.danger') }, status: :unprocessable_entity
        end
      end

      def destroy
        Rails.logger.info 'SessionsControllerのdestroyアクションが呼び出されました。ログアウト処理を開始します。'

        if logged_in?
          Rails.logger.info 'ユーザーがログイン状態にあるため、ログアウト処理を実行します。'
          log_out
          Rails.logger.info 'ユーザーのログアウト処理が正常に完了しました。'
          render json: { message: 'ログアウトに成功しました。' }, status: :ok
        else
          Rails.logger.info 'ログインしているユーザーが存在しないため、ログアウト処理は実行されません。'
          render json: { error: 'ユーザーはログインしていません。' }, status: :unprocessable_entity
        end
      end
    end
  end
end

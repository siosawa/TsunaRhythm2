module Api
  module V1
    class SessionsController < ApplicationController
      def create
        Rails.logger.info 'Sessions_Controllerのcreateアクションが呼び出されました。'
        user = User.find_by(email: params[:session][:email].downcase)

        if user
          Rails.logger.info 'ユーザーが見つかりました。パスワードの認証を試みます。'
        else
          Rails.logger.info '指定されたメールアドレスのユーザーが見つかりませんでした。'
        end

        if user&.authenticate(params[:session][:password])
          Rails.logger.info 'パスワードが正しいことが確認されました。'

          if user.activated?
            Rails.logger.info 'ユーザーアカウントがアクティブ化されています。'
            reset_session

            if params[:session][:remember_me] == '1'
              remember(user)
              Rails.logger.info 'ユーザーのログイン情報を記憶しました。'
            else
              forget(user)
              Rails.logger.info 'ユーザーのログイン情報を記憶しません。'
            end

            log_in user
            Rails.logger.info 'ユーザーをログイン状態にしました。'
            # リダイレクトの代わりにJSONレスポンスを返す
            render json: { message: 'ログインに成功しました。', user: user }, status: :ok
          else
            Rails.logger.info 'ユーザーアカウントがアクティブ化されていません。エラーメッセージを設定し、リダイレクトします。'
            render json: { error: 'アカウントがアクティブ化されていません。メールでアクティベーションリンクを確認してください。' }, status: :unprocessable_entity
          end
        else
          Rails.logger.info 'メールアドレスとパスワードの組み合わせが無効です。エラーメッセージを設定し、ログインフォームを再度表示します。'
          # フラッシュメッセージの代わりにJSONレスポンスを返す
          render json: { error: I18n.t('sessions.create.flash.danger') }, status: :unprocessable_entity
        end

        Rails.logger.info 'Sessions_Controllerのcreateアクションの処理が完了しました。'
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

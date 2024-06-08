# frozen_string_literal: true

module Api
  module V1
    class ApplicationController < ActionController::API
      include ActionController::Cookies
      include SessionsHelper

      private

      def logged_in_user
        Rails.logger.info 'logged_in_user メソッドが呼び出されました'

        if logged_in?
          Rails.logger.info 'ユーザーはログインしています'
          return
        end

        Rails.logger.info 'ユーザーはログインしていません'
        store_location
        message = [I18n.t('sessions.flash.danger')]
        Rails.logger.info "リダイレクト用のメッセージ: #{message}"
        render json: { status: 'notLoggedIn', message: }
      end
    end
  end
end

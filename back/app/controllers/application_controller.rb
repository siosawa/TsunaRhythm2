class ApplicationController < ActionController::API
  include SessionsHelper

  private

  # ログイン済みユーザーかどうか確認
  def logged_in_user
    return if logged_in?

    store_location
    message = [I18n.t("sessions.flash.danger")]
    render json: { status: "notLoggedIn", message: }
  end
end

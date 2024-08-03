# frozen_string_literal: true

module SessionsHelper
  # ログイン処理を行い、セッションとクッキーを設定する
  def log_in(user)
    create_session(user)
    store_cookies(user)
  end

  # ユーザーのセッションを永続的にする
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] =
      { value: user.id, httponly: true, secure: Rails.env.production?, same_site: :lax }
    cookies.permanent[:remember_token] =
      { value: user.remember_token, httponly: true, secure: Rails.env.production?, same_site: :lax }
  end

  # 現在ログイン中のユーザーを返す（いる場合）
  def current_user
    if session_user_id
      find_user_by_session
    elsif cookie_user_id
      find_user_by_cookie
    end
  end

  # 渡されたユーザーがカレントユーザーであればtrueを返す
  def current_user?(user)
    Rails.logger.info "カレントユーザー確認 - ユーザーID: #{user&.id}"
    result = user && user == current_user
    Rails.logger.info "カレントユーザー確認結果: #{result}"
    result
  end

  # ユーザーがログインしていればtrue、その他ならfalseを返す
  def logged_in?
    Rails.logger.info 'ログイン状態確認'
    result = !current_user.nil?
    Rails.logger.info "ログイン状態確認結果: #{result}"
    result
  end

  # 永続的セッションを破棄する
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # ユーザーをログアウトさせる
  def log_out
    Rails.logger.info "ログアウト処理開始 - カレントユーザーID: #{@current_user&.id}"
    forget(current_user)
    reset_session
    @current_user = nil
    Rails.logger.info 'ログアウト完了'
  end

  # アクセスしようとしたURLを保存する
  def store_location
    return unless request.get?

    Rails.logger.info "アクセスしようとしたURLを保存: #{request.original_url}"
    session[:forwarding_url] = request.original_url
  end
end

private

# セッションからユーザーIDを取得する
def session_user_id
  session[:user_id]
end

# クッキーからユーザーIDを取得する
def cookie_user_id
  cookies.encrypted[:user_id]
end

# セッションに基づいてユーザーを検索し、現在のユーザーとして設定する
def find_user_by_session
  user = User.find_by(id: session_user_id)
  @current_user ||= user if user && valid_session_token?(user)
end

# セッションのトークンが有効か確認する
def valid_session_token?(user)
  session[:session_token] == user.session_token
end

# クッキーに基づいてユーザーを検索し、現在のユーザーとして設定する
def find_user_by_cookie
  user = User.find_by(id: cookie_user_id)
  return unless user&.authenticated?(:remember, cookies[:remember_token])

  log_in(user)
  @current_user = user
end

# セッションを作成する
def create_session(user)
  session[:user_id] = user.id
  session[:session_token] = user.session_token
end

# クッキーを設定する
def store_cookies(user)
  store_encrypted_cookie(:user_id, user.id)
  store_encrypted_cookie(:session_token, user.session_token)
end

# 暗号化されたクッキーを保存する
def store_encrypted_cookie(name, value)
  cookies.encrypted[name] = {
    value:,
    expires: 2.weeks.from_now,
    httponly: true,
    secure: Rails.env.production?,
    same_site: :lax
  }
end

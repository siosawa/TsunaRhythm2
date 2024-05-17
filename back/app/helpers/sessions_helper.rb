module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
    session[:session_token] = user.session_token
  end

  def remember(user)
    user.remember
    cookies.permanent.encrypted[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  def current_user
    if (user_id = session[:user_id])
      user = User.find_by(id: user_id)
      @current_user ||= user if user && session[:session_token] == user.session_token
    elsif (user_id = cookies.encrypted[:user_id])
      user = User.find_by(id: user_id)
      if user&.authenticated?(:remember, cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  # 渡されたユーザーがカレントユーザーであればtrueを返す
  def current_user?(user)
    user && user == current_user
  end

  # ユーザーがログインしていればtrue、その他ならfalseを返す
  def logged_in?
    !current_user.nil?
  end

  # 永続的セッションを破棄する
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # 現在のユーザーをログアウトする
  def log_out
    forget(current_user) # userのクッキー内のデータを削除
    reset_session
    @current_user = nil
  end

  # アクセスしようとしたURLを保存する
  def store_location
    session[:forwarding_url] = request.original_url if request.get?
  end
end

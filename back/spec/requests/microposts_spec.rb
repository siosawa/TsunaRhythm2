require 'rails_helper'
# ログインの有無によるポストのCRUD処理の検証
RSpec.describe 'posts' do
  descriグイン確認テスト' do
    let(:user) { create(:u}
    let(:unregistered_user) { build(:user) }

    context '存在するユーザーは' do
      specify 'ログインが成功しルートパスにリダイレクトする' do
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post login_path, params: { session: session_params }
        expect(response).to redirect_to(root_url)
      end
    end

    context '存在しないユーザーは' do
      specify 'ログインが失敗しnewテンプレートがレンダーされる' do
        session_params = { email: unregistered_user.email, password: unregistered_user.password, remember_me: 0 }
        post login_path, params: { session: session_params }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response).to render_template('new')
      end
    end
  end

  describe 'POST #create' do
    let(:user) { create(:user) }
    let(:post) { create(:post, user_id: user.id) }
    let(:other_user) { create(:user) }
    let(:other_post) { create(:post) }

    context 'ログインしている状態で' do
      before do
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post login_path, params: { session: session_params }
      end

      specify 'GET #post_pathへのリクエストが成功し、HTTPステータスコード200が返される' do
        get post_path(user)
        expect(response).to have_http_status(:ok)
      end

      specify 'ログインユーザーのポストが3件正確に表示される' do
        get post_path(user)
        user.posts.limit(3).each do |post|
          expect(response.body).to include(post.content)
        end
      end

      specify 'ポストの作成が成功すると、post数が3件増える' do
        expect do
          post posts_path, params: { post: { content: 'テスト投稿' } }
          post posts_path, params: { post: { content: 'テスト投稿' } }
          post posts_path, params: { post: { content: 'テスト投稿' } }
        end.to change(user.posts, :count).by(3)
      end

      specify 'ポストの作成が失敗すると、post数が増減しない' do
        expect do
          post posts_path, params: { post: { content: ' ' } }
        end.not_to change(user.posts, :count)
      end
    end

    context 'ログインしていない状態で' do
      # 　未実装
      # specify 'GET #post_pathへのリクエストが失敗しlogin_pathにリダイレクトされる' do
      #   get post_path
      #   expect(response).to redirect_to(login_path)
      # end

      specify 'ポストを作成しようとするとlogin_pathにリダイレクトされる' do
        post posts_path, params: { post: { content: 'テスト投稿' } }
        expect(response).to redirect_to(login_path)
      end
    end
  end

  describe 'ログインしている状態でフォローしているユーザーのポストの閲覧' do
    let(:user) { create(:user) }
    let(:alice_user) { create(:user) }
    let(:bob_user) { create(:user) }

    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post login_path, params: { session: session_params }
      # 別のユーザーでポストを新規作成
      @post1 = create(:post, user: alice_user)
      @post2 = create(:post, user: bob_user)
      # ログインユーザーで別のユーザーをフォロー
      post relationships_path, params: { followed_id: alice_user.id }
      post relationships_path, params: { followed_id: bob_user.id }
    end

    specify 'GET #post_pathへのリクエストが成功し、HTTPステータスコード200が返される' do
      get post_path(user)
      expect(response).to have_http_status(:ok)
    end

    specify '他のユーザーが投稿したマイクをポストが確認できる' do
      get post_path
      expect(response.body).to include(@post1.content)
      expect(response.body).to include(@post2.content)
    end
  end

  describe 'DELETE #destroy' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    # 未実装
    # context 'ログインしていない状態' do
    #   before do
    #   @post = create(:post, user: user)
    #   end
    #   specify 'ログイン画面へ遷移する' do
    #     expect {
    #       delete post_path(@post)
    #     }.to redirect_to(rogin_path)
    #   end
    # end

    context 'ログインしている状態' do
      before do
        # ログイン
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post login_path, params: { session: session_params }
        # 新規ポスト作成
        @post = create(:post, user:)
      end

      specify 'ポストの削除が成功すると、post数が1件減る' do
        expect do
          delete post_path(@post)
        end.to change(user.posts, :count).by(-1)
      end

      specify 'ポストの削除が失敗すると、post数が変わらない' do
        # 別のユーザーのポストを削除しようとする
        other_post = create(:post, user: other_user)
        expect do
          delete post_path(other_post)
        end.not_to change(other_user.posts, :count)
      end
    end
  end
end

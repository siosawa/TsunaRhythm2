require 'rails_helper'

RSpec.describe 'Posts' do
  describe 'GET /api/v1/posts' do
    let(:user) { create(:user, name: 'ゲスト') }

    before do
      create_list(:post, 3, user:)
      log_in user
    end

    it 'ポストを正常に取得する' do
      get '/api/v1/posts'
      expect(response).to have_http_status(:success)
      expect(response.parsed_body['posts'].length).to eq(3)
    end
  end

  describe 'POST /api/v1/posts' do
    let(:user) { create(:user) }
    let(:valid_params) { { post: { title: '新しいポスト', content: 'ポストの内容' } } }

    before do
      log_in user
    end

    it '新しいポストを作成する' do
      expect { post '/api/v1/posts', params: valid_params }.to change(Post, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe 'PUT /api/v1/posts/:id' do
    let(:user) { create(:user) }
    let(:post_record) { create(:post, user:) }
    let(:valid_params) { { post: { title: '更新されたタイトル', content: '更新された内容' } } }

    before do
      log_in user
    end

    it '既存のポストを更新する' do
      put "/api/v1/posts/#{post_record.id}", params: valid_params
      expect(response).to have_http_status(:ok)
      expect(response.parsed_body['title']).to eq('更新されたタイトル')
    end
  end

  describe 'DELETE /api/v1/posts/:id' do
    let(:user) { create(:user) }
    let!(:post_record) { create(:post, user:) }

    before do
      log_in user
    end

    it '既存のポストを削除する' do
      expect { delete "/api/v1/posts/#{post_record.id}" }.to change(Post, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end

  private

  def log_in(user)
    session_params = { email: user.email, password: user.password }
    post '/api/v1/sessions', params: { session: session_params }
  end
end

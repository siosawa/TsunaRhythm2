# spec/requests/posts_spec.rb
require 'rails_helper'

RSpec.describe 'Posts', type: :request do
  describe 'GET /api/v1/posts' do
    let(:user) { create(:user, name: 'ゲスト') }

    before do
      create_list(:post, 3, user:)
      allow_any_instance_of(Api::V1::PostsController).to receive(:current_user).and_return(user)
    end

    it 'ポストを正常に取得する' do
      get '/api/v1/posts'
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['posts'].length).to eq(3)
      expect(json['posts'][0]['user']['name']).to eq('ゲスト')
      expect(json['posts'][0]['current_user_id']).to eq(user.id)
    end
  end

  describe 'POST /api/v1/posts' do
    let(:user) { create(:user) }
    let(:valid_params) { { post: { title: '新しいポスト', content: 'ポストの内容' } } }

    before do
      allow_any_instance_of(Api::V1::PostsController).to receive(:current_user).and_return(user)
    end

    it '新しいポストを作成する' do
      expect do
        post '/api/v1/posts', params: valid_params
      end.to change(Post, :count).by(1)
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['status']).to eq('success')
      expect(json['message']).to include('投稿が完了しました')
    end
  end

  describe 'PUT /api/v1/posts/:id' do
    let(:user) { create(:user) }
    let(:post_record) { create(:post, user:) }
    let(:valid_params) { { post: { title: '更新されたタイトル', content: '更新された内容' } } }

    before do
      allow_any_instance_of(Api::V1::PostsController).to receive(:current_user).and_return(user)
    end

    it '既存のポストを更新する' do
      put "/api/v1/posts/#{post_record.id}", params: valid_params
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['title']).to eq('更新されたタイトル')
      expect(json['content']).to eq('更新された内容')
    end
  end

  describe 'DELETE /api/v1/posts/:id' do
    let(:user) { create(:user) }
    let!(:post_record) { create(:post, user:) }

    before do
      allow_any_instance_of(Api::V1::PostsController).to receive(:current_user).and_return(user)
    end

    it '既存のポストを削除する' do
      expect do
        delete "/api/v1/posts/#{post_record.id}"
      end.to change(Post, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end

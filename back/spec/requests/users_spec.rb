require 'rails_helper'

RSpec.describe 'Users' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:first_other_user) { create(:user) }
  let(:second_other_user) { create(:user) }

  describe 'GET #index' do
    let(:first_user) { create(:user) }

    before do
      create(:user)
      login(first_user)
    end

    it 'リクエストが成功する' do
      get '/api/v1/users'
      expect(response).to have_http_status(:ok)
    end

    it '要求通りの情報を返す' do
      get '/api/v1/users'
      expect(json['users'].length).to eq(2)
    end
  end

  describe 'GET #show' do
    it 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}"
      expect(response).to have_http_status(:ok)
    end

    it '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}"
      expect(json['name']).to eq(user.name)
    end
  end

  describe 'GET #following' do
    before do
      login(user)
      post '/api/v1/relationships', params: { followed_id: first_other_user.id }
      post '/api/v1/relationships', params: { followed_id: second_other_user.id }
    end

    it 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following"
      expect(response).to have_http_status(:ok)
    end

    it '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following"
      expect(json['users'].length).to eq(2)
    end
  end

  describe 'GET #followers' do
    before do
      login(user)
      post '/api/v1/relationships', params: { followed_id: first_other_user.id }
      post '/api/v1/relationships', params: { followed_id: second_other_user.id }
    end

    it 'リクエストが成功する' do
      get "/api/v1/users/#{first_other_user.id}/followers"
      expect(response).to have_http_status(:ok)
    end

    it '要求通りの情報を返す' do
      get "/api/v1/users/#{first_other_user.id}/followers"
      expect(json['users'].length).to eq(1)
    end
  end

  describe 'POST #create' do
    context '成功の場合' do
      it 'ユーザー数が１件増える' do
        valid_params = { name: 'テストユーザー',
                         email: 'example@gmail.com',
                         password: 'password',
                         password_confirmation: 'password' }
        expect do
          post '/api/v1/users', params: { user: valid_params }
        end.to change(User.all, :count).by(1)
      end

      it '成功した情報を返す' do
        valid_params = { name: 'テストユーザー',
                         email: 'example@gmail.com',
                         password: 'password',
                         password_confirmation: 'password' }
        post '/api/v1/users', params: { user: valid_params }
        expect(json['message']).to eq('ユーザーが正常に作成されました')
      end
    end

    context '失敗の場合' do
      it 'ユーザー数が増減しない' do
        invalid_params = { name: '',
                           email: 'example@gmail.com',
                           password: 'password',
                           password_confirmation: 'password' }
        expect do
          post '/api/v1/users', params: { user: invalid_params }
        end.not_to change(User.all, :count)
      end

      it '処理失敗の情報を返す' do
        invalid_params = { name: '',
                           email: 'example@gmail.com',
                           password_confirmation: 'password' }
        post '/api/v1/users', params: { user: invalid_params }
        expect(json['errors']).to be_present
      end
    end
  end

  describe 'DELETE #destroy' do
    before do
      login(user)
    end

    it 'ユーザー数が１件減る' do
      expect { delete "/api/v1/users/#{user.id}" }.to change(User.all, :count).by(-1)
    end
  end

  describe 'PATCH #update' do
    before do
      login(user)
    end

    context '更新成功の場合' do
      it 'nameが更新される' do
        user_name = user.name
        valid_params = { name: "#{user.name} updateテスト" }
        patch "/api/v1/users/#{user.id}", params: { user: valid_params }
        expect(user.reload.name).to eq("#{user_name} updateテスト")
      end

      it '更新したユーザー情報を返す' do
        valid_params = { name: "#{user.name} updateテスト" }
        patch "/api/v1/users/#{user.id}", params: { user: valid_params }
        expect(json['message']).to eq('ユーザー情報の更新に成功しました')
        expect(json['user']['id']).to eq(user.id)
      end
    end

    context '更新失敗の場合' do
      it '処理失敗の情報を返す' do
        invalid_params = { name: '' }
        patch "/api/v1/users/#{user.id}", params: { user: invalid_params }
        expect(json['errors']).to be_present
      end

      it 'ログインユーザー以外を更新しようとすると操作失敗の情報を返す' do
        valid_params = { name: "#{user.name} updateテスト" }
        patch "/api/v1/users/#{other_user.id}", params: { user: valid_params }
        expect(response).to have_http_status(:forbidden)
        expect(json['message']).to eq('不正なアクセスです')
      end
    end
  end
end

def json
  response.parsed_body
end

def login(user)
  post '/api/v1/sessions', params: { session: { email: user.email, password: user.password } }
end

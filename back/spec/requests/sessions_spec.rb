# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sessions' do
  let(:user) { create(:user) }
  let(:unregistered_user) { build(:user) }

  describe 'POST #create' do
    context '存在するユーザー' do
      it 'ログインが成功する' do
        session_params = { email: user.email, password: user.password }
        post '/api/v1/sessions', params: { session: session_params }
        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json['message']).to eq('ログインに成功しました。')
        expect(json['user']['id']).to eq(user.id)
      end
    end

    context '存在しないユーザー' do
      it 'ログインが失敗する' do
        session_params = { email: unregistered_user.email, password: unregistered_user.password }
        post '/api/v1/sessions', params: { session: session_params }
        json = response.parsed_body

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['error']).to eq('ログインに失敗しました。')
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'ログアウトが成功する' do
      session_params = { email: user.email, password: user.password }
      post '/api/v1/sessions', params: { session: session_params }

      delete '/api/v1/logout'
      json = response.parsed_body

      expect(response).to have_http_status(:ok)
      expect(json['message']).to eq('ログアウトに成功しました。')
    end

    it 'ログインしていない場合のログアウト' do
      delete '/api/v1/logout'
      json = response.parsed_body

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['error']).to eq('ユーザーはログインしていません。')
    end
  end

  def json
    response.parsed_body
  end
end

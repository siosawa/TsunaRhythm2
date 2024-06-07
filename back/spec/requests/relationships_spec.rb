require 'rails_helper'

RSpec.describe 'Relationships', type: :request do
  let(:user) { create(:user) }
  let(:target_user) { create(:user) }
  let(:other_user) { create(:user) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      it 'ログイン画面へ遷移するための情報を返す' do
        post '/api/v1/relationships', params: { followed_id: target_user.id }
        json = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        session_params = { email: user.email, password: user.password }
        post '/api/v1/sessions', params: { session: session_params }
      end

      context '成功の場合' do
        it 'フォローフォロワーの関係の数が１件増える' do
          expect do
            post '/api/v1/relationships', params: { followed_id: target_user.id }
          end.to change(Relationship.all, :count).by(1)
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      it 'ログイン画面へ遷移するための情報を返す' do
        relationship = Relationship.create(follower_id: user.id, followed_id: target_user.id)
        delete "/api/v1/relationships/#{target_user.id}", params: { followed_id: target_user.id }
        json = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        session_params = { email: user.email, password: user.password }
        post '/api/v1/sessions', params: { session: session_params }
        post '/api/v1/relationships', params: { followed_id: target_user.id }
        @relationship = Relationship.last
      end

      context '成功の場合' do
        it 'フォローフォロワーの関係の数が１件減る' do
          expect do
            delete "/api/v1/relationships/#{@relationship.id}", params: { followed_id: @relationship.followed_id }
          end.to change(Relationship.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        it 'フォローしていないユーザーのフォロー解除をしようとすると操作失敗の情報を返す' do
          delete "/api/v1/relationships/#{other_user.id}", params: { followed_id: other_user.id }
          json = JSON.parse(response.body)

          expect(response).to have_http_status(:not_found)
          expect(json['status']).to eq('failure')
        end
      end
    end
  end
end

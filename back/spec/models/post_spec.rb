require 'rails_helper'

RSpec.describe Post do
  let(:user) { create(:user) }
  let(:post) { create(:post) }

  describe 'テストデータ' do
    specify 'のuser_id, contentがある場合は有効になる' do
      expect(post).to be_valid
    end

    specify 'user_idが存在しない場合は無効になる' do
      post.user_id = nil
      expect(post).not_to be_valid
    end

    specify 'のcontentが空の時は無効になる' do
      post.content = ''
      expect(post).not_to be_valid
    end

    specify 'のcontentが140字を超えた時は無効になる' do
      post.content = Faker::Lorem.characters(number: 141)
      expect(post).not_to be_valid
    end
  end
end

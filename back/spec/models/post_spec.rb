require 'rails_helper'

RSpec.describe Post, type: :model do
  before do
    @user = FactoryBot.create(:user)
    @post = FactoryBot.build(:post, user: @user)
  end

  describe 'バリデーション' do
    it '有効な属性を持つポストは有効である' do
      expect(@post).to be_valid
    end

    it 'ユーザーIDがなければ無効である' do
      @post.user_id = nil
      expect(@post).not_to be_valid
    end

    it 'タイトルがなければ無効である' do
      @post.title = nil
      expect(@post).not_to be_valid
    end

    it 'コンテンツがなければ無効である' do
      @post.content = nil
      expect(@post).not_to be_valid
    end

    it 'タイトルが56文字を超える場合は無効である' do
      @post.title = 'a' * 57
      expect(@post).not_to be_valid
    end

    it 'コンテンツがなければ無効である' do
      @post.content = nil
      expect(@post).not_to be_valid
    end

    it 'コンテンツが2050文字を超える場合は無効である' do
      @post.content = 'a' * 2051
      expect(@post).not_to be_valid
    end

    it 'ポストがユーザーに属している' do
      expect(@post.user).to eq(@user)
    end

    it 'ポストが作成日時の降順で並ぶ' do
      post1 = FactoryBot.create(:post, user: @user, created_at: 1.day.ago)
      post2 = FactoryBot.create(:post, user: @user, created_at: 1.hour.ago)
      expect(Post.all).to eq([post2, post1])
    end
  end
end

require 'rails_helper'

RSpec.describe Relationship, type: :model do
  before do
    @user1 = FactoryBot.create(:user)
    @user2 = FactoryBot.create(:user)
    @relationship = FactoryBot.build(:relationship, follower: @user1, followed: @user2)
  end

  describe 'バリデーション' do
    it '有効な属性を持つリレーションシップは有効である' do
      expect(@relationship).to be_valid
    end

    it 'フォロワーIDがなければ無効である' do
      @relationship.follower_id = nil
      expect(@relationship).not_to be_valid
    end

    it 'フォロイーIDがなければ無効である' do
      @relationship.followed_id = nil
      expect(@relationship).not_to be_valid
    end

    it '同じフォロワーとフォロイーの組み合わせは一意でなければ無効である' do
      @relationship.save
      duplicate_relationship = @relationship.dup
      expect(duplicate_relationship).not_to be_valid
    end

    # Relationshipモデルがfollowerとfollowedという2つの関連付けを持っていることを確認
    it 'フォロワーに属している' do
      expect(@relationship.follower).to eq(@user1)
    end

    it 'フォロイーに属している' do
      expect(@relationship.followed).to eq(@user2)
    end
  end
end

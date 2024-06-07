require 'rails_helper'

RSpec.describe Relationship do
  let(:follower) { create(:user) }
  let(:followed) { create(:user) }
  let(:relationship) { build(:relationship, follower:, followed:) }

  describe 'バリデーション' do
    it '有効な属性を持つリレーションシップは有効である' do
      expect(relationship).to be_valid
    end

    it 'フォロワーIDがなければ無効である' do
      relationship.follower_id = nil
      expect(relationship).not_to be_valid
    end

    it 'フォロイーIDがなければ無効である' do
      relationship.followed_id = nil
      expect(relationship).not_to be_valid
    end

    it '同じフォロワーとフォロイーの組み合わせは一意でなければ無効である' do
      relationship.save
      duplicate_relationship = relationship.dup
      expect(duplicate_relationship).not_to be_valid
    end

    it 'フォロワーに属している' do
      expect(relationship.follower).to eq(follower)
    end

    it 'フォロイーに属している' do
      expect(relationship.followed).to eq(followed)
    end
  end
end

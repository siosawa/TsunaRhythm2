require 'rails_helper'

RSpec.describe User do
  let(:user) { build(:user) }

  describe 'バリデーション' do
    it '有効な属性を持つユーザーは有効である' do
      expect(user).to be_valid
    end

    it '名前がなければ無効である' do
      user.name = nil
      expect(user).not_to be_valid
    end

    it 'メールアドレスがなければ無効である' do
      user.email = nil
      expect(user).not_to be_valid
    end

    it 'メールアドレスが一意でなければ無効である' do
      duplicate_user = user.dup
      duplicate_user.email = user.email.upcase
      user.save
      expect(duplicate_user).not_to be_valid
    end

    it 'パスワードが6文字未満では無効である' do
      user.password = user.password_confirmation = 'a' * 5
      expect(user).not_to be_valid
    end

    it 'パスワードが一致しなければ無効である' do
      user.password_confirmation = 'mismatch'
      expect(user).not_to be_valid
    end
  end

  describe 'メソッド' do
    it 'ランダムなトークンを生成する' do
      token = described_class.new_token
      expect(token).to be_a(String)
    end

    it 'ランダムなトークンの長さが0より大きい' do
      token = described_class.new_token
      expect(token.length).to be > 0
    end

    it '渡された文字列のハッシュ値を返す' do
      digest = described_class.digest('password')
      expect(digest).to be_a(String)
    end

    it 'ハッシュ値の長さが0より大きい' do
      digest = described_class.digest('password')
      expect(digest.length).to be > 0
    end

    it 'フォローできる' do
      other_user = create(:user)
      user.save
      user.follow(other_user)
      expect(user.following?(other_user)).to be true
    end

    it 'フォロー中でないことを確認' do
      other_user = create(:user)
      user.save
      expect(user.following?(other_user)).to be false
    end

    it 'フォロー解除できる' do
      other_user = create(:user)
      user.save
      user.follow(other_user)
      user.unfollow(other_user)
      expect(user.following?(other_user)).to be false
    end
  end

  describe 'ユーザーが削除された時' do
    it '関連するポストも削除される' do
      user.save
      user.posts.create!(title: 'Sample title', content: 'Lorem ipsum')
      expect { user.destroy }.to change(Post, :count).by(-1)
    end

    it '関連するフォロワー関係も削除される' do
      user.save
      other_user = create(:user)
      user.follow(other_user)
      expect { user.destroy }.to change(Relationship, :count).by(-1)
    end
  end
end

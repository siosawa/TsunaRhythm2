class Post < ApplicationRecord
  belongs_to :user
  default_scope -> { order(created_at: :desc) }
  validates :title, presence: true, length: { maximum: 56 }
  validates :content, presence: true, length: { maximum: 2050 }
end

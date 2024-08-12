# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :records, dependent: :destroy
  # 案件名を一意にしたいなら下記を適用する
  # validates :name, presence: true, uniqueness: { scope: :user_id, message: :taken_with_user }
  validates :name, presence: true
  validates :company, presence: true
  validates :work_type, presence: true
  validates :unit_price, numericality: { only_integer: true }
  validates :quantity, numericality: { only_integer: true }
  validates :is_completed, inclusion: { in: [true, false] }
end

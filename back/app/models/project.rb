# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :records, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id, message: :taken_with_user }
  validates :company, presence: true
  validates :work_type, presence: true
  validates :unit_price, numericality: { only_integer: true }
  validates :quantity, numericality: { only_integer: true }
  validates :is_completed, inclusion: { in: [true, false] }
end

# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_many :records, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id, message: "案件名は重複しないようにしてください" }
  validates :company, presence: true
  validates :work_type, presence: true
  validates :unit_price, numericality: { only_integer: true }
  validates :quantity, numericality: { only_integer: true }
  validates :is_completed, inclusion: { in: [true, false] }
end


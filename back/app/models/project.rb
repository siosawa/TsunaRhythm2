# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  validates :unit_price, numericality: { only_integer: true }
  validates :quantity, numericality: { only_integer: true }
  validates :is_completed, inclusion: { in: [true, false] }
end

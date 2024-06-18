class Record < ApplicationRecord
  belongs_to :user
  belongs_to :project
  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :project_id, presence: true, numericality: { only_integer: true }
  validates :minutes, presence: true, numericality: { only_integer: true }
  validates :date, presence: true
end

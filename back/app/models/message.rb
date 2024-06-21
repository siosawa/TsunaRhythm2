# frozen_string_literal: true

class Message < ApplicationRecord
  validates :content, presence: true
  validates :user_id, presence: true
  validates :room_id, presence: true
end

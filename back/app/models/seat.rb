# frozen_string_literal: true

class Seat < ApplicationRecord
  validates :user_id, presence: true
  validates :room_id, presence: true
  validates :seat_id, presence: true, uniqueness: { scope: :room_id }
  validates :user_id, uniqueness: { scope: :seat_id, message: :taken_by_another_user }
end

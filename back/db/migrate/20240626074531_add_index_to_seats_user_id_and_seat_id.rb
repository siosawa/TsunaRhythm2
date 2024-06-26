class AddIndexToSeatsUserIdAndSeatId < ActiveRecord::Migration[7.0]
  def change
    add_index :seats, [:user_id, :seat_id], unique: true
  end
end

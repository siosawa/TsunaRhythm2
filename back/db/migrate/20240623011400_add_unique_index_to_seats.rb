class AddUniqueIndexToSeats < ActiveRecord::Migration[7.0]
  def change
    add_index :seats, [:seat_id, :room_id], unique: true
  end
end

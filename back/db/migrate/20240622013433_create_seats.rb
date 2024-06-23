class CreateSeats < ActiveRecord::Migration[7.0]
  def change
    create_table :seats do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :room_id, null: false 
      t.integer :seat_id, null: false
      
      t.timestamps
    end
  end
end

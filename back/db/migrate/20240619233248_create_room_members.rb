class CreateRoomMembers < ActiveRecord::Migration[7.0]
  def change
    create_table :room_members do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :room_id, null: false
      t.datetime :entered_at, null: false
      t.datetime :leaved_at
    end
  end
end
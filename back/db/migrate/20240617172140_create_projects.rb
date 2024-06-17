class CreateProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :projects do |t|
      t.integer :user_id
      t.string :company
      t.string :name
      t.string :work_type
      t.integer :unit_price
      t.integer :quantity
      t.boolean :is_completed

      t.timestamps
    end
  end
end

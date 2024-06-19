class AddWorkEndToRecords < ActiveRecord::Migration[7.0]
  def change
    add_column :records, :work_end, :datetime, null: true
  end
end

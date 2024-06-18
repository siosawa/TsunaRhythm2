class CreateRecords < ActiveRecord::Migration[6.1]
  def change
    create_table :records do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.integer :minutes, null: false
      t.datetime :date, null: false

      t.timestamps
    end
  end
end


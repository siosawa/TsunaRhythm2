class AddUniqueIndexToProjectsName < ActiveRecord::Migration[7.0]
  def change
    add_index :projects, [:user_id, :name], unique: true
  end
end

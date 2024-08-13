class RemoveUniqueIndexFromProjectsName < ActiveRecord::Migration[7.0]
  def change
    remove_index :projects, column: [:user_id, :name], unique: true
  end
end

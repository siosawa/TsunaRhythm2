class AddIndexToUsersEmail < ActiveRecord::Migration[7.0]
  def change
    unless index_exists?(:users, :email, unique: true)
      add_index :users, :email, unique: true
    end
  end
end

class AddWorkToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :work, :string
  end
end

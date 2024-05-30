class AddProfileTextToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :profile_text, :text
  end
end

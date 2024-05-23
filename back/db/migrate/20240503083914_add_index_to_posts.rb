class AddIndexToPosts < ActiveRecord::Migration[7.0]
  def change
    add_index :posts, %i[user_id created_at], name: 'index_posts_on_user_id_and_created_at'
  end
end

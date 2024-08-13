class AddUniqueIndexToProjectsName < ActiveRecord::Migration[7.0]
  def change
    # 案件名を一意にしたいならロールバックしてコメントアウトを外してマイグレート
    # add_index :projects, [:user_id, :name], unique: true
  end
end

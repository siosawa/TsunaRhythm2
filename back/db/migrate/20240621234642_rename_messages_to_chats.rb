class RenameMessagesToChats < ActiveRecord::Migration[7.0]
  def change
    rename_table :messages, :chats
  end
end

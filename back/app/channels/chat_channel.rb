# frozen_string_literal: true

class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    Message.create!(
      content: data['message'],
      user_id: current_user.id,
      room_id: params[:room]
    )
  end
end

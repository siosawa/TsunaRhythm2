# frozen_string_literal: true

class SeatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def occupy(data)
    seat = Seat.find_or_initialize_by(seat_id: data['seat_id'], room_id: params[:room])
    seat.update(user_id: data['user_id'])
    ActionCable.server.broadcast "room_#{params[:room]}", seat_id: data['seat_id'], user_id: data['user_id']
  end
end

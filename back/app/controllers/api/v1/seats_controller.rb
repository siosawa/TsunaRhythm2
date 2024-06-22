# app/controllers/api/v1/seats_controller.rb
module Api
    module V1
      class SeatsController < ApplicationController
        def index
          seats = Seat.where(room_id: params[:room_id])
          render json: seats
        end
  
        def create
          seat = Seat.find_or_initialize_by(seat_params)
          seat.user_id = current_user.id
          if seat.save
            ActionCable.server.broadcast "RoomChannel_#{params[:room_id]}", seat
            render json: seat, status: :created
          else
            render json: seat.errors, status: :unprocessable_entity
          end
        end
  
        private
  
        def seat_params
          params.require(:seat).permit(:seat_id, :room_id)
        end
      end
    end
  end
  
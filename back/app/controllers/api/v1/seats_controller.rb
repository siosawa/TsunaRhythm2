# frozen_string_literal: true

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
          ActionCable.server.broadcast "room_#{params[:room_id]}", { seat_id: seat.seat_id, user_id: seat.user_id }
          render json: seat, status: :created
        else
          render json: seat.errors, status: :unprocessable_entity
        end
      end

      def destroy
        seat = Seat.find_by(id: params[:id])
        if seat
          room_id = seat.room_id
          seat.destroy
          ActionCable.server.broadcast "room_#{room_id}", { action: "destroy", seat_id: seat.id }
          head :no_content
        else
          render json: { error: "Seat not found" }, status: :not_found
        end
      end

      private

      def seat_params
        params.require(:seat).permit(:seat_id, :room_id)
      end
    end
  end
end

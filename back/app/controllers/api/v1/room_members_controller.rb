module Api
  module V1
    class RoomMembersController < ApplicationController
      def index
        room_members = RoomMember.all
        puts "Room members: #{room_members.inspect}"
        render json: room_members
      end
      

      def show
        room_member = RoomMember.find(params[:id])
        render json: room_member
      end

      def create
        room_member = RoomMember.new(room_member_params)
        if room_member.save
          render json: { message: 'Room member created successfully', room_member: room_member }, status: :created
        else
          render json: { errors: room_member.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        room_member = RoomMember.find(params[:id])
        if room_member.update(leaved_at: params[:leaved_at])
          render json: { message: 'Room member updated successfully', room_member: room_member }, status: :ok
        else
          render json: { errors: room_member.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def room_member_params
        params.require(:room_member).permit(:user_id, :room_id, :entered_at, :leaved_at)
      end
    end
  end
end

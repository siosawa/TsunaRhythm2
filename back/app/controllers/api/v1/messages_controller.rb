# frozen_string_literal: true

module Api
  module V1
    class MessagesController < ActionController::API
      include ActionController::Cookies
      include SessionsHelper
      before_action :set_message, only: [:show]
      before_action :logged_in_user, only: %i[index show create]

      # GET /api/v1/messages
      def index
        @messages = Message.where(room_id: params[:room_id])
        render json: @messages
      end

      # GET /api/v1/messages/:id
      def show
        render json: @message
      end

      # POST /api/v1/messages
      def create
        @message = Message.new(message_params)
        if @message.save
          ActionCable.server.broadcast("chat_#{@message.room_id}", @message.as_json)
          render json: @message, status: :created
        else
          render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_message
        @message = Message.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Message not found' }, status: :not_found
      end

      def message_params
        params.require(:message).permit(:content, :user_id, :room_id)
      end

      def logged_in_user
        return if logged_in?

        render json: { status: 'notLoggedIn', message: 'ログインしてください' }, status: :unauthorized
      end
    end
  end
end

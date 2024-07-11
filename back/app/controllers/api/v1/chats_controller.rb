# frozen_string_literal: true

module Api
  module V1
    class ChatsController < ActionController::API
      include ActionController::Cookies
      include SessionsHelper
      before_action :set_chat, only: [:show]
      before_action :logged_in_user, only: %i[index show create]

      # GET /api/v1/chats
      def index
        @chats = Chat.where(room_id: params[:room_id].to_i).order(created_at: :asc)

        if @chats.count > 100
          excess_chats = @chats.limit(@chats.count - 100)
          excess_chats.destroy_all
        end

        @chats = @chats.limit(100)
        render json: @chats
      end

      # GET /api/v1/chats/:id
      def show
        render json: @chat
      end

      # POST /api/v1/chats
      def create
        @chat = Chat.new(chat_params)
        if @chat.save
          cleanup_old_chats(@chat.room_id)
          ActionCable.server.broadcast("chat_#{@chat.room_id}", @chat.as_json)
          render json: @chat, status: :created
        else
          render json: { errors: @chat.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_chat
        @chat = Chat.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'chat not found' }, status: :not_found
      end

      def chat_params
        params.require(:chat).permit(:content, :user_id, :room_id).tap do |chat_params|
          chat_params[:user_id] = chat_params[:user_id].to_i
          chat_params[:room_id] = chat_params[:room_id].to_i
        end
      end

      def logged_in_user
        return if logged_in?

        render json: { status: 'notLoggedIn', chat: 'ログインしてください' }, status: :unauthorized
      end

      def cleanup_old_chats(room_id)
        chats = Chat.where(room_id:).order(created_at: :asc)

        return unless chats.count > 100

        excess_chats = chats.limit(chats.count - 100)
        excess_chats.destroy_all
      end
    end
  end
end

# frozen_string_literal: true

module Api
  module V1
    class RecordsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user, only: %i[index show create destroy update]
      before_action :correct_user, only: %i[show update destroy]

      def index
        @records = current_user.records.order(date: :desc)
        render json: @records
      end

      def show
        @record = Record.find(params[:id])
        render json: @record
      end

      def create
        @record = current_user.records.build(record_params) # ログインユーザーに関連付けてレコードを作成
        if @record.save
          render json: @record, status: :created
        else
          render json: @record.errors, status: :unprocessable_entity
        end
      end

      def update
        @record = Record.find(params[:id])
        if @record.update(record_params)
          render json: @record, status: :ok
        else
          render json: @record.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @record = Record.find(params[:id])
        @record.destroy
        head :no_content
      end

      private

      def record_params
        params.require(:record).permit(:user_id, :project_id, :minutes, :date, :work_end)
      end

      def logged_in_user
        return if logged_in?

        render json: { status: 'notLoggedIn', message: 'ログインしてください' }, status: :unauthorized
      end

      def correct_user
        @record = current_user.records.find_by(id: params[:id])
        return if @record

        render json: { error: 'Unauthorized access' }, status: :unauthorized
      end
    end
  end
end

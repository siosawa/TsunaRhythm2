# frozen_string_literal: true

module Api
  module V1
    class ProjectsController < ApplicationController
      include ActionController::Cookies
      include SessionsHelper
      before_action :logged_in_user, only: %i[index show create destroy update]
      before_action :correct_user, only: %i[destroy update]
      before_action :set_project, only: %i[show update destroy]

      # GET /api/v1/projects
      def index
        @projects = Project.where(user_id: current_user.id).order(created_at: :desc)
        render json: @projects
      end

      # GET /api/v1/projects/:id
      def show
        if @project.user_id == current_user.id
          render json: @project
        else
          render json: { error: 'Unauthorized access' }, status: :unauthorized
        end
      end

      # POST /api/v1/projects
      def create
        @project = Project.new(project_params.merge(user_id: current_user.id))
        if @project.save
          render json: @project, status: :created
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/projects/:id
      def update
        if @project.user_id == current_user.id && @project.update(project_params)
          render json: @project
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/projects/:id
      def destroy
        if @project.user_id == current_user.id
          @project.destroy
          head :no_content
        else
          render json: { error: 'Unauthorized access' }, status: :unauthorized
        end
      end

      private

      def set_project
        @project = Project.find(params[:id])
      end

      def project_params
        params.require(:project).permit(:company, :name, :work_type, :unit_price, :quantity, :is_completed)
      end

      def logged_in_user
        return if logged_in?

        render json: { status: 'notLoggedIn', message: 'ログインしてください' }, status: :unauthorized
      end

      def correct_user
        @project = Project.find(params[:id])
        return if @project.user_id == current_user.id

        render json: { error: 'Unauthorized access' }, status: :unauthorized
      end
    end
  end
end

# frozen_string_literal: true

module Api
  module V1
    class HealthCheckController < Api::V1::ApplicationController
      def index
        render json: { message: 'Success Health Check!!!' }, status: :ok
      end
    end
  end
end

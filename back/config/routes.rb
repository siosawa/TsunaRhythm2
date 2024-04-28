Rails.application.routes.draw do
  namespace :api, format:'json' do
    namespace :v1 do
      resources :posts, only: [:index, :show, :create, :update, :destroy]
    end
  end
  get "up" => "rails/health#show", as: :rails_health_check
end

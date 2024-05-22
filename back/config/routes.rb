Rails.application.routes.draw do
  get 'users/new'
  namespace :api, format: 'json' do
    namespace :v1 do
      resources :users do
        member do
          get :following, :followers
        end
      end
      get 'current_user', to: 'users#current_user_info'
      resources :sessions, only: [:create]
      delete '/logout', to: 'sessions#destroy'
      # resources :account_activations, only: [:edit]
      resources :posts, only: %i[index show create update destroy]
      resources :password_resets,     only: %i[new create edit update]
      resources :relationships,       only: %i[create destroy]
    end
  end
  get 'up' => 'rails/health#show', as: :rails_health_check
end

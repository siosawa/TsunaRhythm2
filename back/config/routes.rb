Rails.application.routes.draw do
  get 'users/new'
  namespace :api, format: 'json' do
    namespace :v1 do
      get '/signup', to: 'users#new'
      get '/login', to: 'sessions#new'
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      resources :users do
        member do
          get :following, :followers
        end
      end
      resources :account_activations, only: [:edit]
      resources :posts, only: %i[index show create update destroy]
      # get '/posts', to: 'static_pages#home'
      resources :password_resets,     only: [:new, :create, :edit, :update]
      resources :relationships,       only: %i[create destroy]
    end
  end
  get 'up' => 'rails/health#show', as: :rails_health_check
end

Rails.application.routes.draw do
  get 'password_resets/new'
  get 'password_resets/edit'
  get 'users/new'
  namespace :api, format: 'json' do
    namespace :v1 do
      get '/signup', to: 'users#new'
      get '/login', to: 'sessions#new'
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      resources :users
      resources :account_activations, only: [:edit]
      resources :posts, only: %i[index show create update destroy]
      # get '/posts', to: 'static_pages#home'
    end
  end
  get 'up' => 'rails/health#show', as: :rails_health_check
end

# frozen_string_literal: true

Rails.application.routes.draw do
  get 'users/new'
  namespace :api, format: 'json' do
    namespace :v1 do
      resources :users do
        member do
          get :following, :followers
          patch :update_password
        end
      end
      get 'current_user', to: 'users#current_user_info'
      get 'current_user_posts', to: 'users#current_user_posts'
      # get 'posts_user', to: 'users#posts_user_info'
      resources :sessions, only: %i[create]
      delete '/logout', to: 'sessions#destroy'
      # resources :account_activations, only: [:edit]
      resources :posts, only: %i[index show create update destroy] do
        collection do
          get 'user/:user_id', to: 'posts#user_posts'
        end
      end
      resources :password_resets, only: %i[create edit update]
      resources :relationships, only: %i[create destroy]
      resources :projects, only: %i[index show create update destroy]
      resources :records
      resources :room_members, only: %i[create update index show]
      resources :chats, only: %i[create index show]
      resources :seats, only: %i[index create destroy]
      get 'health_check', to: 'health_check#index'
    end
  end
  get 'up' => 'rails/health#show', as: :rails_health_check
  mount ActionCable.server => '/cable'
end

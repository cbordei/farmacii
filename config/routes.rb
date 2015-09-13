Rails.application.routes.draw do
  resources :pharmacies do
    resources :comments
  end
  devise_for :users
  root :to => "home#index"

  namespace :api, defaults: { format: :json } do
    resources :places, only: [:show, :index]
  end
end

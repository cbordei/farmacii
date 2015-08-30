Rails.application.routes.draw do
  resources :pharmacies
  devise_for :users
  root :to => "home#index"

  namespace :api, defaults: { format: :json } do
    resources :places, only: [:show, :index]
  end
end

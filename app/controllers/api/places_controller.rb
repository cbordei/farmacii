class Api::PlacesController < ApplicationController

  def index
    @pharmacies = Pharmacy.close_to(params[:lat], params[:long])
    
    render json: @pharmacies
  end
end
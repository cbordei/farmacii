class Api::PlacesController < ApplicationController
  require 'iconv'
  PER_PAGE = 12

  def index
    @pharmacies = Pharmacy.close_to(params[:lat], params[:long])
    
    render json: @pharmacies
  end
end
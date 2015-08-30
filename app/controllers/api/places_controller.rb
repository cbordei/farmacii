class Api::PlacesController < ApplicationController
  require 'iconv'
  def index
    city_name = Iconv.iconv('ascii//translit', 'utf-8', params[:city_name]).first.to_s
    @pharmacies = Pharmacy.where(city: city_name.upcase).limit(2)
    render json: @pharmacies
  end
end
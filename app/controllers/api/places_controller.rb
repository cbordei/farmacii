class Api::PlacesController < ApplicationController
  require 'iconv'
  PER_PAGE = 12

  def index
    city_name = Iconv.iconv('ascii//translit', 'utf-8', params[:city_name]).first.to_s
    @q = Pharmacy.ransack({"city_cont"=>city_name})
    @pharmacies = @q.result.page(params[:page]).per(PER_PAGE)
    render json: @pharmacies
  end
end
class PharmaciesController < ApplicationController
  before_action :set_pharmacy, only: [:show, :edit, :update, :destroy]
  before_filter :authenticate_admin_user!, except: [:index, :show]
  
  PER_PAGE = 12
  # GET /pharmacies
  def index
    @q = Pharmacy.ransack(params[:q])
    @pharmacies = @q.result.page(params[:page]).per(PER_PAGE)
  end

  # GET /pharmacies/1
  def show
  end

  # GET /pharmacies/new
  def new
    @pharmacy = Pharmacy.new
  end

  # GET /pharmacies/1/edit
  def edit
  end

  # POST /pharmacies
  def create
    @pharmacy = Pharmacy.new(pharmacy_params)

    if @pharmacy.save
      redirect_to @pharmacy, notice: 'Pharmacy was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /pharmacies/1
  def update
    if @pharmacy.update(pharmacy_params)
      redirect_to @pharmacy, notice: 'Pharmacy was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /pharmacies/1
  def destroy
    @pharmacy.destroy
    redirect_to pharmacies_url, notice: 'Pharmacy was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pharmacy
      @pharmacy = Pharmacy.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def pharmacy_params
      params.require(:pharmacy).permit(:name, :structure, :county, :city, :address, :chief_pharmacist_name, :details)
    end
end

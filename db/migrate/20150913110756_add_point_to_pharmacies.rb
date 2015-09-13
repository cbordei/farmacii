class AddPointToPharmacies < ActiveRecord::Migration
  def change
    add_column :pharmacies, :coordinates, :point, geographic: true
  end
end

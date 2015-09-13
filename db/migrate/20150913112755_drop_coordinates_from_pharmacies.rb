class DropCoordinatesFromPharmacies < ActiveRecord::Migration
  def change
    remove_column :pharmacies, :coordinates
  end
end

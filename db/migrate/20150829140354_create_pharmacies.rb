class CreatePharmacies < ActiveRecord::Migration
  def change
    create_table :pharmacies do |t|
      t.string :name
      t.string :structure
      t.string :county
      t.string :city
      t.string :address
      t.string :chief_pharmacist_name
      t.string :details

      t.timestamps null: false
    end
  end
end

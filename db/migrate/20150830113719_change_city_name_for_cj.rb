class ChangeCityNameForCj < ActiveRecord::Migration
  def change
    execute("UPDATE pharmacies SET city='CLUJ-NAPOCA' where city='CLUJ NAPOCA'")
  end
end

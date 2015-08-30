class Pharmacy < ActiveRecord::Base
  # geocoded_by :full_address
  # after_validation :geocode          

  def full_address
    city.to_s + " " + address.to_s
  end
end

class Pharmacy < ActiveRecord::Base
  geocoded_by :full_address
  after_validation :geocode
    
  has_many :comments

  validates :name, presence: true
  validates :county, presence: true
  validates :city, presence: true
  validates :address, presence: true

  def self.close_to(lat, long, range_km = 0.5)
    where(
        "ST_DWithin(Geography(ST_MakePoint(#{long}, #{lat})),
                    Geography(ST_MakePoint(longitude, latitude)),
                    #{(range_km * 1000).to_i})"
      )
  end

  def full_address
    city.to_s + " " + address.to_s
  end
end

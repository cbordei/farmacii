# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'roo'

folder_name = "date_farmacii"
files = Dir.entries(folder_name)
pharmacies = []

files.each do |file|    
    spreadsheet = Roo::Excel.new(folder_name + "/" + file) if file.include? ".xls"
    next if spreadsheet.nil?
    header = spreadsheet.row(1)
    (2..spreadsheet.last_row).each do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]     
      
      pharmacies << {
        name: row[" "].nil? ? row["DENUMIRE"] : row[" "],
        structure: row["IN STRUCTURA"],
        county: row["JUD/SECT"],
        city: row["LOCALITATE"],
        address: row["ADRESA"],
        chief_pharmacist_name: row["FARMACIST SEF"],
        details: row["OBSERVATII"]
      }
    end    
end
Pharmacy.create(pharmacies)

class AddAdminUser < ActiveRecord::Migration
  def change
    User.create({email:"admin@farmacii.com", password:"12341234", password_confirmation:"12341234", admin: true})
  end
end

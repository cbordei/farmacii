class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def authenticate_admin_user!
    redirect_to '/' and return if user_signed_in? && !current_user.admin?

    authenticate_user!
  end
end

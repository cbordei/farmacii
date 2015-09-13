module ApplicationHelper
  def user_is_admin?
    current_user && current_user.admin?
  end

  def cool_date_format(date)
    date.strftime("%B #{date.day.ordinalize}, %Y")
  end
end

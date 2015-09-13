class Comment < ActiveRecord::Base
  belongs_to :pharmacy
  validates :commenter, presence: true
  validates :body, presence: true
end

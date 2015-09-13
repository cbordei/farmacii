class CommentsController < ApplicationController
  before_filter :authenticate_user! 

  def create
    @pharmacy = Pharmacy.find(params[:pharmacy_id])
    @comment = @pharmacy.comments.build(comment_params)
    @comment.commenter = current_user.username ? current_user.username : current_user.email
    @comment.save!
    redirect_to pharmacy_path(@pharmacy)
  end
 
  private
    def comment_params
      params.require(:comment).permit(:body)
    end
end

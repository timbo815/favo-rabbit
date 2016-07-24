class Api::SessionsController < ApplicationController

	def oauth
		user = User.find_or_create_from_auth_hash(request.env['omniauth.auth'])

		login(user)

		redirect_to "#/home"
	end

	def create
		@user = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )

    if @user
			login(@user)
			render "api/users/show"


		else
			render(
        json: {
          base: ["Invalid username/password combination"]
        },
        status: 401
      )
		end
	end

	def destroy
		@user = current_user
		if @user
			logout
			render "api/users/show"
		else
			render(
        json: {
          base: ["Nobody signed in"]
        },
        status: 404
      )
		end
	end

	def show
		if current_user
			@user = current_user
			render "api/users/show"
		else
			render json: {}
		end
	end

end

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from django.contrib.auth import authenticate,login
from .serializer import Username_serializer
from django.contrib.auth.models import User
from .models import Username

#========= Create User ===============
class create_user(APIView):
	permission_classes = ([AllowAny])

	def post(self, request):
		# getting username as input and saving it
		user = Username()
		serializer = Username_serializer(user,data = request.data)
		if serializer.is_valid():
			serializer.save()

		# getting the latest username object created
		username_obj = Username.objects.all().order_by("-date")[0:1]
		username_serializer = Username_serializer(username_obj,many = True)
		username = username_serializer.data[0]["username"]

		# Checking if user is already present or not
		login_user = authenticate(username=username, password="Password@")
		if login_user is not None:
			login(request,login_user)
			# get the user token
			token = Token.objects.get(user = request.user)
			return Response({"Token" : token.key})
		# if user is not there,then create a new user and generate the token
		else:
			# creating user
			user = User.objects.create_user(username, password="Password@")
			user.save()
			login(request,user)
			# generating token
			token = Token.objects.create(user = request.user)
			return Response({"Token" : token.key})
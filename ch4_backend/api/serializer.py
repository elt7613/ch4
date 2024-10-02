from rest_framework import serializers
from . models import Username

# Username Serializer 
class Username_serializer(serializers.ModelSerializer):
	class Meta:
		model = Username
		fields = ["username"]
from django.db import models

# User Creation
class Username(models.Model):
	username = models.CharField(max_length = 100,null = False,blank = False)
	date = models.DateTimeField(auto_now_add = True)
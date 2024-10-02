from django.urls import path,include
from . views import create_user

urlpatterns = [       
    path("user-login/",create_user.as_view()),
]
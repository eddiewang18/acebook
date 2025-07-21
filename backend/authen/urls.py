from django.urls import path
from .views import GoogleLoginAPIView

urlpatterns = [
    path('login/google/', GoogleLoginAPIView.as_view(), name='google-login'),
]

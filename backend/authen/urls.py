from django.urls import path
from .views import GoogleLoginAPIView,LoginView,LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('login/google/', GoogleLoginAPIView.as_view(), name='google-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

from django.urls import path
from .views import ProfileUpdateView,InterestGroupWithTagsAPIView,UploadPhotoView,MatchView

urlpatterns = [
    path('profile/', ProfileUpdateView.as_view()),
    path('upload-photo/', UploadPhotoView.as_view()),
    path('match/', MatchView.as_view()),
    path('interest-groups/', InterestGroupWithTagsAPIView.as_view(), name='interest-groups'),
]

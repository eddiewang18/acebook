from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InterestGroup, InterestTag,Profile, ProfilePhoto,ProfileInit
from django.core.exceptions import ObjectDoesNotExist
from .serializers import InterestGroupSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status, permissions, parsers
 

class InterestGroupWithTagsAPIView(APIView):
    authentication_classes = [JWTAuthentication]  # JWT 認證
    permission_classes = [IsAuthenticated]       # 必須登入
    def get(self, request, *args, **kwargs):
        interest_groups = InterestGroup.objects.prefetch_related('interesttag_set').all()
        serializer = InterestGroupSerializer(interest_groups, many=True)
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Profile, ProfilePhoto, InterestTag, ProfileInterestTag
from django.db import transaction


class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, format=None):
        user = request.user
        data = request.data

        # 取得或建立 Profile
        profile, created = Profile.objects.get_or_create(user=user)

        # 更新基本欄位
        profile.nickname = data.get('nickname', profile.nickname)
        profile.birthday = data.get('birthday', profile.birthday)
        profile.gender = data.get('gender', profile.gender)
        profile.bio = data.get('bio', profile.bio)

        # 交友偏好
        profile.preferred_gender = data.get('preference', profile.preferred_gender)
        age_range = data.get('ageRange', [18, 40])
        if isinstance(age_range, list) and len(age_range) == 2:
            profile.preferred_age_min = age_range[0]
            profile.preferred_age_max = age_range[1]

        profile.save()

        # 更新興趣標籤（ManyToMany）
        interest_ids = data.get('interests', [])
        if isinstance(interest_ids, list):
            # 清除舊的連結
            ProfileInterestTag.objects.filter(profile=profile).delete()
            # 建立新的關聯
            tags = InterestTag.objects.filter(id__in=interest_ids)
            for tag in tags:
                ProfileInterestTag.objects.create(profile=profile, interest_tag=tag)

        ProfileInit.objects.create(
            profile=profile,
            is_init=True
        )

        return Response({
            "message": "Profile saved successfully."
        }, status=status.HTTP_200_OK)


class UploadPhotoView(APIView):
    authentication_classes = [JWTAuthentication]  # JWT 認證
    permission_classes = [IsAuthenticated]       # 必須登入
    parser_classes = [parsers.MultiPartParser]  # 可處理 multipart/form-data
    def post(self, request, format=None):
        user = request.user

        # 檢查是否存在 Profile
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response({"error": "Profile does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # 取得上傳的檔案
        photo_file = request.FILES.get('photo')
        if not photo_file:
            return Response({"error": "No photo uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        # 儲存照片
        profile_photo = ProfilePhoto.objects.create(
            profile=profile,
            image=photo_file
        )

        return Response({
            "message": "Photo uploaded successfully.",
            "photo_url": profile_photo.image.url  # 回傳圖片的相對 URL
        }, status=status.HTTP_201_CREATED)
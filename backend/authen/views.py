from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from dotenv import load_dotenv
import traceback
from personal.models import Profile
import os
from django.contrib.auth import authenticate
from rest_framework import status, permissions

load_dotenv()



class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response({"error": "Missing id_token"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 驗證 token，audience 要換成你的 Google client ID
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                 os.getenv('GOOGLE_CLIENT_ID')
            )

            # 取得用戶資訊
            email = idinfo['email']
            name = idinfo.get('name', '')

            # 建立或取得使用者
            user, created = User.objects.get_or_create(
                username=email,
                defaults={"email": email, "first_name": name}
            )
            
            profile, created = Profile.objects.get_or_create(user=user)


            # 發送 JWT token
            refresh = RefreshToken.for_user(user)

            redirect_page = "profile"

            try:
                profile = user.profile
                redirect_page = "match"
            except Profile.DoesNotExist:
                pass


            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "redirect_page":redirect_page
            })

        except ValueError as e:
            print("❌ Token 驗證失敗：", str(e))
            traceback.print_exc()
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("❌ 未預期錯誤：", str(e))
            traceback.print_exc()
            return Response({"error": "Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({"error": "請輸入使用者名稱與密碼"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            redirect_page = "profile"

            try:
                profile = user.profile
                redirect_page = "match"
            except Profile.DoesNotExist:
                pass

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "redirect_page":redirect_page
            },status=status.HTTP_200_OK)
        else:
            return Response({"error": "使用者名稱或密碼錯誤"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "缺少 refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "登出成功"}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"error": "無效的 refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "登出時發生錯誤"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
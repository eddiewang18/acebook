from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from dotenv import load_dotenv
import traceback

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
                "497218345427-n2on088pc0rl07krdv06k6ob3ff3c134.apps.googleusercontent.com"
            )

            # 取得用戶資訊
            email = idinfo['email']
            name = idinfo.get('name', '')

            # 建立或取得使用者
            user, created = User.objects.get_or_create(
                username=email,
                defaults={"email": email, "first_name": name}
            )

            # 發送 JWT token
            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })

        except ValueError as e:
            print("❌ Token 驗證失敗：", str(e))
            traceback.print_exc()
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("❌ 未預期錯誤：", str(e))
            traceback.print_exc()
            return Response({"error": "Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

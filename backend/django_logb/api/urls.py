# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, UserPostsViewSet, UserProfileViewSet, validate_token, register_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'users', UserProfileViewSet, basename='userprofile')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('validate-token/', validate_token, name='validate-token'),
    path('register/', register_user, name='register'),
    path('users/<str:username>/posts/', UserPostsViewSet.as_view({'get': 'list'}), name='user-posts'),
]

# api/views.py
from rest_framework import viewsets, status
from blog.models import Post
from .serializers import PostSerializer, ProfileSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework import status

@api_view(['POST'])
def validate_token(request):
    token = request.data.get('token')
    if not token:
        return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)

    try:
        AccessToken(token)
        return Response({'valid': True})
    except Exception as e:
        return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.author:
            raise PermissionDenied("You don't have permission to edit this post.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author:
            raise PermissionDenied("You don't have permission to delete this post.")
        instance.delete()

    @action(detail=False, methods=['get'])
    def user_posts(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            posts = Post.objects.filter(author_id=user_id)
            serializer = self.get_serializer(posts, many=True)
            return Response(serializer.data)
        return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        try:
            profile = self.request.user.profile
            user = self.request.user
        except Exception:
            return Response({"error": "Profile does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data)

        elif request.method in ('PUT', 'PATCH'):
            user_serializer = UserSerializer(user, data=request.data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            profile_serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
                return Response(profile_serializer.data)
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add this view to your views.py
class UserPostsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, username):
        try:
            user = User.objects.get(username=username)
            posts = Post.objects.filter(author=user)
            serializer = PostSerializer(posts, many=True)
            return Response({
                "count": posts.count(),
                "results": serializer.data
            })
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

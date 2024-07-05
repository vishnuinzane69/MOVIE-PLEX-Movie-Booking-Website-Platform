from rest_framework import status
from rest_framework.response import Response
from .forms import CustomUserCreationForm
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from movieapi.models import book,Event
from .serializers import EventSerializer
from .serializers import bookSerializer
from django.shortcuts import get_object_or_404
from .forms import EventForm
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser




@api_view(['POST'])
@permission_classes((AllowAny,))
def signup(request):
    form = CustomUserCreationForm(data=request.data)
    if form.is_valid():
        user = form.save()
        return Response("account created successfully", status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            is_superuser = user.is_superuser
            return Response({'token': token.key, 'is_superuser': is_superuser}, status=HTTP_200_OK)
    except User.DoesNotExist:
        pass
    return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_event(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_detail(request, pk):
    event = get_object_or_404(Event, pk=pk)
    serializer = EventSerializer(event)
    return Response(serializer.data)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def update_event(request, pk):
    event = get_object_or_404(Event, pk=pk)
    serializer = EventSerializer(event, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_event(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    event.delete()
    return Response("deleted successfully")



class ToggleMovieStatusView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        enabled = request.data.get('enabled', True)
        instance.enabled = enabled
        instance.movie_status = 'active' if enabled else 'notactive'  # Set movie_status based on enabled status
        instance.save()
        return Response({"detail": "Movie status updated successfully"}, status=status.HTTP_200_OK)
    


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'success': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_detail_user(request, movie_id):
    movie = get_object_or_404(Event, pk=movie_id)
    serializer = EventSerializer(movie)
    data = serializer.data

    # Fetching the show associated with the movie
    show = book.objects.filter(movie=movie).first()

    # Adding showId to the response data if show exists
    if show:
        data['showId'] = show.id
    else:
        data['showId'] = None

    return Response(data)






@api_view(['POST'])
@permission_classes((AllowAny,))
def movie_Booking(request):
    serializer = bookSerializer(data=request.data)
    if serializer.is_valid():
        booking = serializer.save()
        serialized_data = bookSerializer(booking).data
        return Response(serialized_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Event
from .serializers import EventSerializer
from rest_framework.permissions import IsAuthenticated

class ViewMovie(APIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Event.objects.all()

    def get(self, request, pk, format=None):
        movie = self.get_queryset().filter(id=pk).first()
        if movie:
            serializer = EventSerializer(movie)
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)




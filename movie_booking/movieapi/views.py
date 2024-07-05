from rest_framework import status
from rest_framework.response import Response
from .forms import CustomUserCreationForm
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from movieapi.models import book,Event,Payment
from .serializers import EventSerializer
from .serializers import bookSerializer
from django.shortcuts import get_object_or_404
from .forms import EventForm
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from rest_framework.permissions import BasePermission
from django.http import JsonResponse
import json
import razorpay
from django.core.mail import send_mail

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



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json
import razorpay
from .models import Event, book
from .serializers import bookSerializer, EventSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import book
from .serializers import bookSerializer
from rest_framework.views import APIView


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def movie_Booking(request, pk):
    # Make a mutable copy of request.data
    data = request.data.copy()
    # Include the authenticated user's ID in the request data
    data['user'] = request.user.id
    serializer = bookSerializer(data=data)
    if serializer.is_valid():
        booking = serializer.save()
        serialized_data = bookSerializer(booking).data
        return Response(serialized_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewMovie(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        movie = Event.objects.filter(id=pk).first()
        if movie:
            serializer = EventSerializer(movie)
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON in request body."}, status=400)

    amount = data.get('amount')
    if not isinstance(amount, int) or amount < 1:
        return JsonResponse({"detail": "Invalid amount. Amount should be an integer and at least 1 INR."}, status=400)

    user_id = data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found."}, status=404)

    client = razorpay.Client(auth=('rzp_test_juCSC8R25SR9Jh', 'LFrrOwX2Bm3meiGA1tvMnTVN'))
    order = client.order.create({
        "amount": amount * 100,  # Convert to paise
        "currency": "INR",
        "payment_capture": 1
    })

    payment = Payment.objects.create(
        user=user,
        razorpay_order_id=order['id'],
        amount=amount  # Store amount in INR
    )

    serializer = bookSerializer(payment)
    return Response({
        'order_id': order['id'],
        'amount': amount,
        'payment_id': payment.id,
        'payment_details': serializer.data
    })


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import book
from .serializers import bookSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import book  # Ensure the correct model name
from .serializers import bookSerializer  # Ensure the correct serializer name

@api_view(['GET'])
@permission_classes([AllowAny])
def booking_history(request, user_id):
    try:
        #fetch the bkng history for provided user id
        bookings = book.objects.filter(user_id=user_id)

        if not bookings.exists():
            return Response({"message": "No previous bookings"}, status=404)
        
        serializer = bookSerializer(bookings, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        return Response({"message": str(e)}, status=500)



@api_view(['POST'])
@permission_classes((AllowAny,))
def send_email(request):
    if request.method == 'POST':
        recipient_email = request.data.get('recipient_email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        if recipient_email and subject and message:
            try:
                # Send email
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[recipient_email],
                    fail_silently=False,
                )
                return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Missing required data in request'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)




from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from .models import Product, Category
import json

# DRF imports for API views
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer, ReviewSerializer
from .forms import ReviewForm
from django.db.models import Q

# ----------------- User APIs -----------------
@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({"message": "User created successfully", "username": user.username})

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful", "username": user.username})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

# ----------------- Product / Category Views -----------------

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Product, Category, Order, OrderItem

# ----------------- Categories & Products -----------------
class CategoryList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class CategoryProducts(APIView):
    permission_classes = [AllowAny]

    def get(self, request, category_slug):
        category = get_object_or_404(Category, slug=category_slug)
        products = Product.objects.filter(category=category, available=True)

        # Search and filters
        query = request.GET.get("q", "")
        min_price = request.GET.get("min_price")
        max_price = request.GET.get("max_price")
        sort = request.GET.get("sort")

        if query:
            products = products.filter(Q(name__icontains=query) | Q(description__icontains=query))

        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)

        if sort == "price_asc":
            products = products.order_by("price")
        elif sort == "price_desc":
            products = products.order_by("-price")

        category_serializer = CategorySerializer(category)
        product_serializer = ProductSerializer(products, many=True)
        return Response({
            'category': category_serializer.data,
            'products': product_serializer.data
        })

# Keep template views for backward compatibility
def category_list(request):
    categories = Category.objects.all()
    return render(request, 'shop/category_list.html', {'categories': categories})

def category_products(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    products = Product.objects.filter(category=category, available=True)
    return render(request, 'shop/category_products.html', {'category': category, 'products': products})

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Product, Order, OrderItem

import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Product, Order, OrderItem

class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"add_to_cart called by user: {request.user}, authenticated: {request.user.is_authenticated}")

        product = get_object_or_404(Product, id=product_id)

        # Parse quantity from JSON
        try:
            data = request.data
            quantity = int(data.get("quantity", 1))
        except (ValueError, TypeError):
            quantity = 1

        # Check stock
        if quantity > product.stock:
            return Response(
                {"error": f"Only {product.stock} items available for {product.name}."},
                status=400
            )

        # Get or create order
        order, created = Order.objects.get_or_create(user=request.user, complete=False)
        order_item, created = OrderItem.objects.get_or_create(order=order, product=product)

        # Update quantity: add to existing if not created
        if created:
            order_item.quantity = min(quantity, product.stock)
        else:
            order_item.quantity += quantity
            order_item.quantity = min(order_item.quantity, product.stock)
        order_item.save()

        return Response({"message": f"{product.name} added to cart"})

class Cart(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        order, created = Order.objects.get_or_create(user=request.user, complete=False)
        items = order.items.all()
        serializer = OrderItemSerializer(items, many=True)
        grand_total = sum(item.get_total for item in items)
        return Response({
            'items': serializer.data,
            'grand_total': grand_total
        })

class UpdateCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):
        order = get_object_or_404(Order, user=request.user, complete=False)
        item = get_object_or_404(OrderItem, id=item_id, order=order)
        action = request.data.get('action')
        if action == "increase":
            if item.quantity < item.product.stock:
                item.quantity += 1
                item.save()
                return Response({"message": "Quantity increased"})
            else:
                return Response({"error": "Stock limit reached"}, status=400)
        elif action == "decrease":
            item.quantity -= 1
            if item.quantity <= 0:
                item.delete()
                return Response({"message": "Item removed"})
            else:
                item.save()
                return Response({"message": "Quantity decreased"})
        elif action == "remove":
            item.delete()
            return Response({"message": "Item removed"})
        return Response({"error": "Invalid action"}, status=400)

class Checkout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order = get_object_or_404(Order, user=request.user, complete=False)
        items = order.items.filter(quantity__gt=0)

        if not items:
            return Response({"error": "Cart is empty"}, status=400)

        # Deduct stock
        for item in items:
            item.product.stock -= item.quantity
            if item.product.stock < 0:
                item.product.stock = 0
            item.product.save()

        order.complete = True
        order.save()

        return Response({"message": "Order placed successfully"})

class MyOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user, complete=True).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class OrderDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


# ----------------- Cart -----------------
@login_required
def cart(request):
    order, created = Order.objects.get_or_create(user=request.user, complete=False)
    items = order.items.all()

    # Calculate total per item and grand total
    grand_total = 0
    for item in items:
        item.total_price = item.product.price * item.quantity
        grand_total += item.total_price

    return render(request, 'shop/cart.html', {'items': items, 'grand_total': grand_total})

# ----------------- Update Cart -----------------
@login_required
def update_cart(request, item_id, action):
    order = get_object_or_404(Order, user=request.user, complete=False)
    item = get_object_or_404(OrderItem, id=item_id, order=order)

    if action == "increase":
        if item.quantity < item.product.stock:
            item.quantity += 1
            item.save()
            messages.success(request, f"Quantity updated for {item.product.name}.")
        else:
            messages.error(request, f"Cannot exceed available stock ({item.product.stock}) for {item.product.name}.")

    elif action == "decrease":
        item.quantity -= 1
        if item.quantity <= 0:
            item.delete()
            messages.info(request, f"{item.product.name} removed from cart.")
        else:
            item.save()
            messages.success(request, f"Quantity updated for {item.product.name}.")

    elif action == "remove":
        item.delete()
        messages.info(request, f"{item.product.name} removed from cart.")

    return redirect('cart')
@login_required
def checkout(request):
    order = get_object_or_404(Order, user=request.user, complete=False)
    items = order.items.filter(quantity__gt=0)

    if not items:
        messages.info(request, "Your cart is empty.")
        return redirect('home')

    if request.method == "POST":
        # Deduct stock for each item
        for item in items:
            item.product.stock -= item.quantity
            if item.product.stock < 0:
                item.product.stock = 0  # just in case
            item.product.save()

        # Mark order complete
        order.complete = True
        order.save()

        messages.success(request, "Order placed successfully!")
        return redirect('home')

    # GET request → show billing page
    grand_total = sum(item.product.price * item.quantity for item in items)
    return render(request, 'shop/billing.html', {
        'items': items,
        'grand_total': grand_total
    })



from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Order, OrderItem, Product

@login_required
def billing(request):
    order = get_object_or_404(Order, user=request.user, complete=False)
    items = order.items.filter(quantity__gt=0)

    if not items:
        messages.info(request, "Your cart is empty.")
        return redirect('home')

    grand_total = 0
    for item in items:
        item.total_price = item.product.price * item.quantity
        grand_total += item.total_price

    return render(request, 'shop/billing.html', {
        'items': items,
        'grand_total': grand_total
    })

from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import SignupForm

def signup_page(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Account created for {user.username}! You are now logged in.")
            return redirect('home')
    else:
        form = SignupForm()
    return render(request, 'shop/signup.html', {'form': form})
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages

def login_page(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        next_url = request.POST.get('next')  # get next from POST

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f"Welcome, {user.username}!")
            # Redirect to next if exists, else home
            if next_url:
                return redirect(next_url)
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password.")

    else:
        # GET request: get 'next' from URL query parameter
        next_url = request.GET.get('next', '')
    return render(request, 'shop/login.html', {'next': next_url})

from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import redirect

@login_required
def logout_page(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('home')
@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user, complete=True).order_by('-created_at')
    return render(request, 'shop/my_orders.html', {'orders': orders})
from django.shortcuts import render, get_object_or_404
from .models import Order

@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    items = order.items.all()

    # Calculate total_price for each item
    for item in items:
        item.total_price = item.product.price * item.quantity

    # Calculate grand total
    grand_total = sum(item.total_price for item in items)

    return render(request, 'shop/order_detail.html', {
        'order': order,
        'items': items,
        'grand_total': grand_total,
    })

from django.db.models import Q

from django.shortcuts import render
from django.db.models import Q
from .models import Product, Category

class ProductList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get("q", "")
        min_price = request.GET.get("min_price")
        max_price = request.GET.get("max_price")
        sort = request.GET.get("sort")

        products = Product.objects.all()

        # Search filter
        if query:
            products = products.filter(Q(name__icontains=query) | Q(description__icontains=query))

        # Price filter (optional)
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)

        # Sorting (optional)
        if sort == "price_asc":
            products = products.order_by("price")
        elif sort == "price_desc":
            products = products.order_by("-price")

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=401)
        product = get_object_or_404(Product, pk=pk)
        form = ReviewForm(request.data)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.product = product
            review.save()
            return Response({"message": "Review added"})
        return Response(form.errors, status=400)

# Keep template views for backward compatibility
def product_list(request):
    query = request.GET.get("q", "")
    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")
    sort = request.GET.get("sort")

    products = Product.objects.all()

    # Search filter
    if query:
        products = products.filter(Q(name__icontains=query) | Q(description__icontains=query))

    # Price filter (optional)
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    # Sorting (optional)
    if sort == "price_asc":
        products = products.order_by("price")
    elif sort == "price_desc":
        products = products.order_by("-price")

    categories = Category.objects.all()

    return render(request, "shop/product_list.html", {
        "products": products,
        "categories": categories,
        "query": query,
        "min_price": min_price,
        "max_price": max_price,
        "sort": sort,
    })


from django.shortcuts import render, get_object_or_404, redirect
from .models import Product, Review
from .forms import ReviewForm

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    reviews = product.reviews.order_by('-created_at')
    related_products = Product.objects.filter(category=product.category).exclude(pk=product.pk)[:4]

    if request.method == 'POST':
        if request.user.is_authenticated:
            form = ReviewForm(request.POST)
            if form.is_valid():
                review = form.save(commit=False)
                review.user = request.user
                review.product = product
                review.save()
                return redirect('product_detail', pk=product.pk)
        else:
            return redirect('login_page')
    else:
        form = ReviewForm()

    context = {
        'product': product,
        'reviews': reviews,
        'form': form,
        'related_products': related_products,
    }
    return render(request, 'shop/product_detail.html', context)


from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Product, Order, Review

# Only allow staff/admin users
def admin_check(user):
    return user.is_staff

@user_passes_test(admin_check)
def admin_dashboard(request):
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_users = User.objects.count()
    total_reviews = Review.objects.count()

    latest_orders = Order.objects.order_by('-created_at')[:5]
    latest_reviews = Review.objects.order_by('-created_at')[:5]

    context = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_users': total_users,
        'total_reviews': total_reviews,
        'latest_orders': latest_orders,
        'latest_reviews': latest_reviews,
    }
    return render(request, 'shop/admin_dashboard.html', context)



from .forms import ProductForm

@user_passes_test(admin_check)
def admin_product_list(request):
    products = Product.objects.all()
    return render(request, 'shop/admin_product_list.html', {'products': products})

@user_passes_test(admin_check)
def admin_add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('admin_product_list')
    else:
        form = ProductForm()
    return render(request, 'shop/admin_product_form.html', {'form': form})

@user_passes_test(admin_check)
def admin_edit_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('admin_product_list')
    else:
        form = ProductForm(instance=product)
    return render(request, 'shop/admin_product_form.html', {'form': form})

@user_passes_test(admin_check)
def admin_delete_product(request, pk):
    product = Product.objects.get(pk=pk)
    product.delete()
    return redirect('admin_product_list')

@user_passes_test(admin_check)
def admin_order_list(request):
    orders = Order.objects.order_by('-created_at')
    return render(request, 'shop/admin_order_list.html', {'orders': orders})

@user_passes_test(admin_check)
def admin_order_detail(request, pk):
    order = Order.objects.get(pk=pk)
    if request.method == 'POST':
        status = request.POST.get('status')
        if status:
            order.status = status
            order.save()
    return render(request, 'shop/admin_order_detail.html', {'order': order})



from django.http import JsonResponse

def hello(request):
    return JsonResponse({"message": "Hello from Django!"})
# views.py
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to the backend!"})
